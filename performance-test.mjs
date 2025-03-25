import { writeFileSync } from 'fs';
import puppeteer from 'puppeteer';
import { startFlow, desktopConfig } from 'lighthouse';

const urls = [
  { url: 'http://localhost:4200/1k', search: '126' },
  { url: 'http://localhost:4200/10k', search: '1126' },
  { url: 'http://localhost:4200/100k', search: '11126' },
  { url: 'http://localhost:4200/1M', search: '111126' },
];

const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: null,
  args: [`--window-size=1920,1080`],
});

const page = await browser.newPage();
await page.setCacheEnabled(false);
const flow = await startFlow(page, { config: desktopConfig });

// Loop over URLs and collect metrics
for (const { url, search } of urls) {
  await flow.navigate(url);
  await page.waitForNetworkIdle();
  await page.waitForSelector('app-card');
  console.log(`${url} loaded`);

  await flow.startTimespan();
  const input = await page.waitForSelector('input');
  await input.click({ offset: { x: 74, y: 24 } });
  await input.type(search);
  await page.waitForFunction('document.querySelectorAll("app-card").length === 1');
  await flow.endTimespan();
  console.log(`${url} search executed`);
}

await browser.close();

// Generate and save reports
const reportJson = await flow.createFlowResult();
writeFileSync('report.html', await flow.generateReport());
writeFileSync('report.json', JSON.stringify(reportJson, null, 2));

// Extract Metrics (INP, CLS, TBT, LCP) for CSV
const loadMetricsData = reportJson.steps
  .filter(step => step.lhr.gatherMode === 'navigation')
  .map((step, index) => ({
    URL: urls[index].url,
    CLS: step.lhr.audits['cumulative-layout-shift'].numericValue.toFixed(4),
    TBT: step.lhr.audits['total-blocking-time'].numericValue.toFixed(2),
    LCP: step.lhr.audits['largest-contentful-paint'].numericValue.toFixed(2),
  }));

const searchMetricsData = reportJson.steps
  .filter(step => step.lhr.gatherMode === 'timespan')
  .map((step, index) => ({
    URL: urls[index].url,
    INP: step.lhr.audits['interaction-to-next-paint'].numericValue.toFixed(2),
    CLS: step.lhr.audits['cumulative-layout-shift'].numericValue.toFixed(4),
    TBT: step.lhr.audits['total-blocking-time'].numericValue.toFixed(2),
  }));

// Convert extracted metrics to CSV
const csvHeader = 'URL,INP,CLS,TBT,LCP';
const csvRows = loadMetricsData
  .map(row => `${row.URL},${row.INP},${row.CLS},${row.TBT},${row.LCP}`)
  .join('\n');
const csvRows2 = searchMetricsData
  .map(row => `${row.URL},${row.INP},${row.CLS},${row.TBT},${row.LCP}`)
  .join('\n');

const csvContent = csvHeader + '\n' + csvRows + '\n' + csvRows2;

// Save to CSV file
writeFileSync('metrics.csv', csvContent);
console.log('Metrics saved to metrics.csv');
