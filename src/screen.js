const puppeteer = require('puppeteer');
const { assets } = require('../config.default');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://medium.com', {waitUntil: 'networkidle2'});
  await page.screenshot({path: `${assets.dist}/example.png` });

  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  console.log('Dimensions:', dimensions);

  await browser.close();
})();

