import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const playwrightModule = process.env.PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = await import(playwrightModule);
const baseURL = process.env.SITE_URL || 'http://127.0.0.1:4173/';
const outputRoot = resolve('docs/phase-5');
await mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = { capturedAt: new Date().toISOString(), baseURL, viewports: {} };
const viewports = {
    'phone-390x844': { width: 390, height: 844, containerMaxWidth: 'none' },
    'tablet-768x1024': { width: 768, height: 1024, containerMaxWidth: '720px' },
    'laptop-1440x1000': { width: 1440, height: 1000, containerMaxWidth: '1140px' },
    'wide-1920x1080': { width: 1920, height: 1080, containerMaxWidth: '1140px' }
};

function boxesShareRow (boxes) {
    return boxes.every(function (box) {
        return Math.abs(box.y - boxes[0].y) < 2;
    });
}

function pairsShareRows (boxes) {
    return boxes.length > 0 && boxes.every(function (box, index) {
        return index % 2 === 0 || Math.abs(box.y - boxes[index - 1].y) < 2;
    });
}

async function getBoxes (page, selector, limit) {
    return page.locator(selector).evaluateAll(function (elements, maximum) {
        return elements.slice(0, maximum ?? elements.length).map(function (element) {
            const box = element.getBoundingClientRect();
            return { x: box.x, y: box.y, width: box.width, height: box.height };
        });
    }, limit ?? null);
}

for (const [name, viewport] of Object.entries(viewports)) {
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
        return route.fulfill({ contentType: 'application/javascript', body: 'window.emailjs={init(){}};' });
    });
    await page.route('https://www.google.com/recaptcha/**', function (route) {
        return route.fulfill({ contentType: 'application/javascript', body: 'window.grecaptcha={getResponse(){return ""},reset(){}};' });
    });
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(150);

    const bootstrapLinks = await page.locator('link[href*="bootstrap"]').count();
    const legacyGridClasses = await page.locator('.container, .row, [class*="col-"]').count();
    const aboutBoxes = await getBoxes(page, '.about-layout > *');
    const highlightBoxes = await getBoxes(page, '.highlight-grid > *', 3);
    const capabilityBoxes = await getBoxes(page, '.my-services .layout-half');
    const formBoxes = await getBoxes(page, '#name, #email');
    const expectsColumns = viewport.width >= 768;
    const computed = await page.evaluate(function () {
        const container = getComputedStyle(document.querySelector('#section1 > .content-container'));
        const fieldset = getComputedStyle(document.querySelector('#contact fieldset'));
        const input = getComputedStyle(document.querySelector('#contact input'));
        const body = getComputedStyle(document.body);
        const heading = getComputedStyle(document.querySelector('.highlight-card h3'));
        const paragraph = getComputedStyle(document.querySelector('.highlight-card p'));

        return {
            containerMaxWidth: container.maxWidth,
            fieldsetBorder: fieldset.borderTopWidth,
            fieldsetPadding: fieldset.paddingLeft,
            inputMargin: input.marginTop,
            inputFontFamily: input.fontFamily,
            bodyFontFamily: body.fontFamily,
            headingMarginTop: heading.marginTop,
            headingFontWeight: heading.fontWeight,
            paragraphMarginTop: paragraph.marginTop
        };
    });
    const layout = {
        aboutColumns: pairsShareRows(aboutBoxes),
        capabilityColumns: pairsShareRows(capabilityBoxes),
        highlightColumns: boxesShareRow(highlightBoxes),
        formColumns: boxesShareRow(formBoxes),
        aboutCount: aboutBoxes.length,
        capabilityCount: capabilityBoxes.length,
        highlightCount: highlightBoxes.length,
        horizontalOverflow: await page.evaluate(function () {
            return document.documentElement.scrollWidth > innerWidth;
        })
    };

    await page.screenshot({ path: `${outputRoot}/${name}.png`, fullPage: true });
    await page.locator('#section3').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await page.screenshot({ path: `${outputRoot}/${name}-focus.png` });
    results.viewports[name] = {
        bootstrapLinks,
        legacyGridClasses,
        localRequests,
        failures,
        expectsColumns,
        expectedContainerMaxWidth: viewport.containerMaxWidth,
        computed,
        layout
    };
    await page.close();
}

await browser.close();
await writeFile(`${outputRoot}/results.json`, `${JSON.stringify(results, null, 2)}\n`);

const checks = Object.values(results.viewports).flatMap(function (result) {
    return [
        result.bootstrapLinks === 0,
        result.legacyGridClasses === 0,
        !result.localRequests.some(function (request) {
            return /bootstrap/i.test(request);
        }),
        result.failures.length === 0,
        result.layout.aboutCount === 4,
        result.layout.capabilityCount === 4,
        result.layout.highlightCount === 3,
        !result.layout.horizontalOverflow,
        result.layout.aboutColumns === result.expectsColumns,
        result.layout.capabilityColumns === result.expectsColumns,
        result.layout.highlightColumns === result.expectsColumns,
        result.layout.formColumns === result.expectsColumns,
        result.computed.containerMaxWidth === result.expectedContainerMaxWidth,
        result.computed.fieldsetBorder === '0px',
        result.computed.fieldsetPadding === '0px',
        result.computed.inputMargin === '0px',
        result.computed.inputFontFamily === result.computed.bodyFontFamily,
        result.computed.headingMarginTop === '0px',
        result.computed.headingFontWeight === '500',
        result.computed.paragraphMarginTop === '0px'
    ];
});

if (!checks.every(Boolean)) {
    process.exitCode = 1;
}
