import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const playwrightModule = process.env.PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = await import(playwrightModule);
const baseURL = process.env.SITE_URL || 'http://127.0.0.1:4173/';
const outputRoot = resolve('docs/phase-4');
await mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = { capturedAt: new Date().toISOString(), baseURL, viewports: {}, navigation: {} };

async function openPage (viewport) {
    const page = await browser.newPage({ viewport });
    const localRequests = [];
    const failures = [];

    page.on('request', function (request) {
        if (request.url().startsWith(baseURL)) {
            localRequests.push(request.url().replace(baseURL, ''));
        }
    });
    page.on('requestfailed', function (request) {
        if (request.url().startsWith(baseURL)) {
            failures.push(request.url());
        }
    });
    await page.route('https://cdn.jsdelivr.net/**', function (route) {
        return route.fulfill({
            contentType: 'application/javascript',
            body: 'window.emailjs={init(){},send(){return Promise.resolve({status:200})}};'
        });
    });
    await page.route('https://www.google.com/recaptcha/**', function (route) {
        return route.fulfill({
            contentType: 'application/javascript',
            body: "window.grecaptcha={getResponse(){return 'token'},reset(){}};"
        });
    });
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(100);

    return { page, localRequests, failures };
}

const viewports = {
    'desktop-1440x1000': { width: 1440, height: 1000 },
    'mobile-390x844': { width: 390, height: 844 }
};

for (const [name, viewport] of Object.entries(viewports)) {
    const { page, localRequests, failures } = await openPage(viewport);
    const initial = await page.evaluate(function () {
        return {
            jqueryGlobal: typeof window.jQuery,
            dollarGlobal: typeof window.$,
            fontAwesomeLinks: document.querySelectorAll('link[href*="fontawesome"]').length,
            legacyIconNodes: document.querySelectorAll('.fa').length,
            inlineIcons: document.querySelectorAll('svg.icon').length,
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth
        };
    });

    if (name.startsWith('mobile')) {
        await page.locator('#menu-toggle').click();
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.main-menu a[href="#section2"]').click();
    await page.waitForTimeout(50);
    const reducedMotionDestination = await page.locator('#section2').evaluate(function (section) {
        return Math.abs(window.scrollY - section.offsetTop) < 2;
    });
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    if (name.startsWith('mobile')) {
        await page.locator('#menu-toggle').click();
    }
    await page.locator('.main-menu a[href="#section3"]').click();
    await page.waitForTimeout(900);
    const activeAfterClick = await page.locator('.main-menu a[href="#section3"]').evaluate(function (link) {
        return link.closest('li').classList.contains('active');
    });
    const menuClosed = !(await page.locator('#menu').evaluate(function (menu) {
        return menu.classList.contains('open');
    }));
    const scrollY = await page.evaluate(function () {
        return window.scrollY;
    });

    await page.screenshot({ path: `${outputRoot}/${name}.png`, fullPage: true });
    if (name.startsWith('mobile')) {
        await page.screenshot({ path: `${outputRoot}/mobile-focus-390x844.png` });
    }
    results.viewports[name] = {
        initial,
        reducedMotionDestination,
        activeAfterClick,
        menuClosed,
        scrollY,
        localRequests,
        failures
    };
    await page.close();
}

const { page } = await openPage({ width: 1440, height: 1000 });
await page.evaluate(function () {
    window.scrollTo(0, document.querySelector('[data-section="section4"]').offsetTop + 100);
});
await page.waitForTimeout(100);
results.navigation.activeAfterManualScroll = await page.locator('.main-menu a[href="#section4"]').evaluate(function (link) {
    return link.closest('li').classList.contains('active');
});
await page.locator('#name').fill('Phase 4');
await page.locator('#email').fill('phase4@example.com');
await page.locator('#subject').fill('Regression');
await page.locator('#message').fill('No external request.');
await page.locator('#form-submit').click();
await page.waitForTimeout(50);
results.navigation.contactStillWorks = /sent/i.test(await page.locator('#form-status').textContent());
await page.close();

await browser.close();
await writeFile(`${outputRoot}/results.json`, `${JSON.stringify(results, null, 2)}\n`);

const checks = Object.values(results.viewports).flatMap(function (result) {
    return [
        result.initial.jqueryGlobal === 'undefined',
        result.initial.dollarGlobal === 'undefined',
        result.initial.fontAwesomeLinks === 0,
        result.initial.legacyIconNodes === 0,
        result.initial.inlineIcons === 6,
        !result.initial.horizontalOverflow,
        result.reducedMotionDestination,
        result.activeAfterClick,
        result.menuClosed,
        result.scrollY > 0,
        !result.localRequests.some(function (request) {
            return /jquery|fontawesome|fontawesome-webfont/i.test(request);
        }),
        result.failures.length === 0
    ];
});
checks.push(
    results.navigation.activeAfterManualScroll,
    results.navigation.contactStillWorks
);

if (!checks.every(Boolean)) {
    process.exitCode = 1;
}
