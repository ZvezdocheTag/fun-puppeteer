const puppeteer = require('puppeteer');
const { assets } = require('../config.default');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://coinmarketcap.com/exchanges/volume/24-hour/', {waitUntil: 'networkidle2'});

  const exchTag = '.table-condensed > tbody > tr'

  let inner = await page.evaluate((sel) => {
    let all = document.querySelectorAll(sel);
    let result = [];

      for(let i = 0; i < all.length; i+=1) {

        if(all[i].hasAttribute("id")) {
          // Get ID
          result.push(all[i].getAttribute("id"))
        }
      }
    // format is: "69,803 users"
    return result;
  }, exchTag);
  console.log(inner)
  await browser.close();
})();