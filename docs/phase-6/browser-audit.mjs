import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const playwrightModule = process.env.PLAYWRIGHT_MODULE || 'playwright';
const axePath = process.env.AXE_PATH || resolve('node_modules/axe-core/axe.min.js');
const playwright = await import(playwrightModule);
const { chromium } = playwright.default || playwright;
const baseURL = process.env.SITE_URL || 'http://127.0.0.1:4173/';
const outputRoot = resolve('docs/phase-6');
await mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = { capturedAt: new Date().toISOString(), baseURL, viewports: {} };
const viewports = {
    'phone-390x844': { width: 390, height: 844 },
    'laptop-1440x1000': { width: 1440, height: 1000 }
};

for (const [name, viewport] of Object.entries(viewports)) {
    const page = await browser.newPage({ viewport });
    const consoleErrors = [];
    const pageErrors = [];
    const localFailures = [];
    const httpErrors = [];
    const externalFailures = [];
    const stubbedURLs = [
        'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js',
        'https://www.google.com/recaptcha/api.js'
    ];

    page.on('console', function (message) {
        if (message.type() === 'error') {
            consoleErrors.push(message.text());
        }
    });
    page.on('pageerror', function (error) {
        pageErrors.push(error.message);
    });
    page.on('requestfailed', function (request) {
        if (request.url().startsWith(baseURL)) {
            localFailures.push(request.url());
        } else if (!stubbedURLs.some(function (url) { return request.url().startsWith(url); })) {
            externalFailures.push({ url: request.url(), error: request.failure()?.errorText || 'request failed' });
        }
    });
    page.on('response', function (response) {
        if (response.status() >= 400) {
            const failure = { url: response.url(), status: response.status() };
            if (response.url().startsWith(baseURL)) {
                httpErrors.push(failure);
            } else if (!stubbedURLs.some(function (url) { return response.url().startsWith(url); })) {
                externalFailures.push(failure);
            }
        }
    });
    await page.route('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js', function (route) {
        return route.fulfill({
            contentType: 'application/javascript',
            body: 'window.emailjs={init(){},send(){return Promise.resolve({status:200})}};'
        });
    });
    await page.route('https://www.google.com/recaptcha/api.js*', function (route) {
        return route.fulfill({
            contentType: 'application/javascript',
            body: "window.grecaptcha={getResponse(){return 'token'},reset(){}};addEventListener('DOMContentLoaded',()=>document.querySelectorAll('.g-recaptcha').forEach(element=>{const placeholder=document.createElement('div');placeholder.setAttribute('aria-hidden','true');placeholder.style.cssText='width:304px;height:78px';element.append(placeholder)}));"
        });
    });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.addScriptTag({ path: axePath });

    const accessibility = await page.evaluate(async function () {
        const audit = await window.axe.run(document, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] }
        });
        return audit.violations.map(function (violation) {
            return {
                id: violation.id,
                impact: violation.impact,
                description: violation.description,
                targets: violation.nodes.map(function (node) {
                    return node.target.join(' ');
                })
            };
        });
    });
    const structure = await page.evaluate(function () {
        const internalLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
        const serviceItems = Array.from(document.querySelectorAll('.service-item'));
        const serviceHeights = serviceItems.map(function (item) {
            return Math.round(item.getBoundingClientRect().height);
        });
        const imageAspectRatios = Array.from(document.querySelectorAll('.left-image img, .right-image img')).map(function (image) {
            const box = image.getBoundingClientRect();
            return Math.abs((box.width / box.height) - (image.naturalWidth / image.naturalHeight)) < 0.01;
        });

        return {
            missingAnchorTargets: internalLinks
                .map(function (link) { return link.hash; })
                .filter(function (hash) { return !document.querySelector(hash); }),
            serviceHeights,
            equalServiceHeights: Math.max(...serviceHeights) === Math.min(...serviceHeights),
            imageAspectRatiosPreserved: imageAspectRatios.every(Boolean),
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
            headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(function (heading) {
                return { level: Number(heading.tagName.slice(1)), text: heading.textContent.trim() };
            })
        };
    });
    structure.headingOrderValid = structure.headings.every(function (heading, index, headings) {
        return index === 0 || heading.level <= headings[index - 1].level + 1;
    });

    await page.locator('#section1').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await page.screenshot({ path: `${outputRoot}/${name}-about.png` });
    await page.locator('#section2').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await page.screenshot({ path: `${outputRoot}/${name}-capabilities.png` });
    results.viewports[name] = {
        expectsEqualServiceHeights: viewport.width >= 768,
        consoleErrors,
        pageErrors,
        localFailures,
        httpErrors,
        externalFailures,
        accessibility,
        structure
    };
    await page.close();
}

await browser.close();
await writeFile(`${outputRoot}/browser-results.json`, `${JSON.stringify(results, null, 2)}\n`);

const checks = Object.values(results.viewports).flatMap(function (result) {
    return [
        result.consoleErrors.length === 0,
        result.pageErrors.length === 0,
        result.localFailures.length === 0,
        result.httpErrors.length === 0,
        result.externalFailures.length === 0,
        result.accessibility.length === 0,
        result.structure.missingAnchorTargets.length === 0,
        result.structure.headingOrderValid,
        !result.expectsEqualServiceHeights || result.structure.equalServiceHeights,
        result.structure.imageAspectRatiosPreserved,
        !result.structure.horizontalOverflow
    ];
});

if (!checks.every(Boolean)) {
    process.exitCode = 1;
}
