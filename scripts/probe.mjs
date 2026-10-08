// Headless check of a page served by the user's dev server (http://localhost:5173).
// Usage: node scripts/probe.mjs '#e6' out.png 'text to wait for'
//   WAIT=ms   extra time after the text appears (let animations run; default 1500)
//   CANVAS=1  screenshot only the first canvas.arena (2× device scale)
// Prints console/page errors and the page text. playwright-core is taken from
// PLAYWRIGHT_CORE (default: the copy installed in ../math-ui) and Chromium from
// the ms-playwright cache.
const core = process.env.PLAYWRIGHT_CORE ?? `${process.env.HOME}/repos/math-ui/node_modules/playwright-core/index.mjs`;
const { chromium } = await import(core);
const [, , hash = '#e1', out = 'probe.png', waitText = ''] = process.argv;
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? `${process.env.HOME}/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome` });
const page = await browser.newPage({ viewport: { width: 1400, height: 1800 }, deviceScaleFactor: process.env.CANVAS ? 2 : 1 });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(`http://localhost:5173/${hash}`);
if (waitText) await page.waitForFunction((t) => document.body.innerText.includes(t), waitText, { timeout: 120000 }).catch(() => errors.push(`timeout waiting for "${waitText}"`));
await page.waitForTimeout(Number(process.env.WAIT ?? 1500));
if (process.env.CANVAS) await (await page.$('canvas.arena')).screenshot({ path: out });
else await page.screenshot({ path: out, fullPage: true });
console.log('errors:', JSON.stringify(errors));
console.log((await page.innerText('body')).slice(0, 4000));
await browser.close();
