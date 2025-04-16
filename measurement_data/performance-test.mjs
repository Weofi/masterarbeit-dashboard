import { writeFileSync, existsSync, appendFileSync } from 'fs';
import puppeteer from 'puppeteer';
import { startFlow, desktopConfig } from 'lighthouse';

const urls = [
  { url: 'http://localhost:8083/1k', search: '126', name: "Vue_1k", selector: ".card" },
  { url: 'http://localhost:8083/10k', search: '1126', name: "Vue_10k", selector: ".card" },
  { url: 'http://localhost:8083/100k', search: '11126', name: "Vue_100k", selector: ".card" },
  { url: 'http://localhost:8083/1M', search: '111126', name: "Vue_1M", selector: ".card" },
  { url: 'http://localhost:8082/1k', search: '126', name: "React_1k", selector: ".card" },
  { url: 'http://localhost:8082/10k', search: '1126', name: "React_10k", selector: ".card" },
  { url: 'http://localhost:8082/100k', search: '11126', name: "React_100k", selector: ".card" },
  { url: 'http://localhost:8082/1M', search: '111126', name: "React_1M", selector: ".card" },
  { url: 'http://localhost:8081/1k', search: '126', name: "Angular_1k", selector: "app-card" },
  { url: 'http://localhost:8081/10k', search: '1126', name: "Angular_10k", selector: "app-card" },
  { url: 'http://localhost:8081/100k', search: '11126', name: "Angular_100k", selector: "app-card"},
  { url: 'http://localhost:8081/1M', search: '111126', name: "Angular_1M", selector: "app-card" },
];

const loopCount = 40

for (let loopIndex = 1; loopIndex <= loopCount; loopIndex++) {
  for (const { url, search, name, selector } of urls) {

    console.log(`${name} started for Loop #${loopIndex}`);
    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null,
      args: [`--window-size=1920,1080 --js-flags="--expose-gc"`],
    });

    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    const flow = await startFlow(page, { config: desktopConfig });

    let peakHeap = 0;

    await flow.navigate(url);
    await page.waitForNetworkIdle();
    await page.waitForSelector(selector);
    //console.log(`${name} loaded`);

    const interval = setInterval(async () => {
      const heap = await page.evaluate(() => performance.memory.usedJSHeapSize);
      peakHeap = Math.max(peakHeap, heap);
      // console.log(`Aktueller Heap: ${(heap / 1024 / 1024).toFixed(2)} MB`);
    }, 500);

    await flow.startTimespan();
    const input = await page.waitForSelector('input');
    await input.click({ offset: { x: 74, y: 24 } });
    await input.type(search);
    await page.waitForFunction(`document.querySelectorAll("${selector}").length === 1`);
    await flow.endTimespan();
    //console.log(`${name} search executed`);


    clearInterval(interval)

    //console.log('\n🔺 Peak Heap:', (peakHeap / 1024 / 1024).toFixed(2), 'MB');

    await browser.close();

    const reportJson = await flow.createFlowResult();

    let INP, CLS, TBT, LCP;


    reportJson.steps
      .filter(step => step.lhr.gatherMode === 'navigation')
      .forEach((step, _index) => {
        TBT = step.lhr.audits['total-blocking-time'].numericValue
        LCP = step.lhr.audits['largest-contentful-paint'].numericValue
      });

    reportJson.steps
      .filter(step => step.lhr.gatherMode === 'timespan')
      .forEach((step, _index) => {
        INP = step.lhr.audits['interaction-to-next-paint'].numericValue
        CLS = step.lhr.audits['cumulative-layout-shift'].numericValue
      });



    // writeFileSync('report.html', await flow.generateReport());
    // writeFileSync('report.json', JSON.stringify(reportJson, null, 2));

    const fileName = `${name}.csv`;

    if (!existsSync(fileName)) {
      const csvHeader = 'INP,CLS,TBT,LCP,PeakHeap\n';
      writeFileSync(fileName, csvHeader);
    }

    const csvRows = `${INP},${CLS},${TBT},${LCP},${peakHeap}\n`

    appendFileSync(fileName, csvRows);

    console.log(`Metrics appended to ${fileName}\n`);
  }
}









