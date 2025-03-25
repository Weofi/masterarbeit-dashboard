import {writeFileSync} from 'fs';
import puppeteer from 'puppeteer';
import {startFlow, desktopConfig} from 'lighthouse';

const browser = await puppeteer.launch({headless: true, defaultViewport: null, args: [`--window-size=1920,1080`],});
const page = await browser.newPage();
await page.setCacheEnabled(false);
const flow = await startFlow(page, {config: desktopConfig});

await flow.navigate('http://localhost:4200/1k');
await page.waitForNetworkIdle();
await page.waitForSelector("app-card")
console.log("1k cards loaded")

await flow.startTimespan();
const search = await page.waitForSelector("input")
await search.click({offset: {x: 74, y: 24}})
await search.type("126")
await page.waitForFunction('document.querySelectorAll("app-card").length === 1')
await flow.endTimespan();
console.log("1k search executed")

await flow.navigate('http://localhost:4200/10k');
await page.waitForNetworkIdle();
await page.waitForSelector("app-card")
console.log("10k cards loaded")

await flow.startTimespan();
const search2 = await page.waitForSelector("input")
await search2.click({offset: {x: 74, y: 24}})
await search2.type("1126")
await page.waitForFunction('document.querySelectorAll("app-card").length === 1')
await flow.endTimespan();
console.log("10k search executed")

await flow.navigate('http://localhost:4200/100k');
await page.waitForNetworkIdle();
await page.waitForSelector("app-card")
console.log("100k cards loaded")

await flow.startTimespan();
const search3 = await page.waitForSelector("input")
await search3.click({offset: {x: 74, y: 24}})
await search3.type("11126")
await page.waitForFunction('document.querySelectorAll("app-card").length === 1')
await flow.endTimespan();
console.log("100k search executed")

await flow.navigate('http://localhost:4200/1M');
await page.waitForNetworkIdle();
await page.waitForSelector("app-card")
console.log("1M cards loaded")

await flow.startTimespan();
const search4 = await page.waitForSelector("input")
await search4.click({offset: {x: 74, y: 24}})
await search4.type("111126")
await page.waitForFunction('document.querySelectorAll("app-card").length === 1')
await flow.endTimespan();
console.log("1M search executed")


await browser.close();
writeFileSync('report.html', await flow.generateReport());
writeFileSync('report.json', JSON.stringify(await flow.createFlowResult(), null, 2));
