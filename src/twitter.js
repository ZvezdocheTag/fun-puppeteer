const puppeteer = require('puppeteer');
const { assets } = require('../config.default');
const channel = 'Ripple';

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(`https://twitter.com/${channel}`);
  const twit = '.js-stream-item.stream-item .tweet-text';
  const pattern = /(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/g;

  let inner = await page.evaluate((sel) => {
    let html = document.querySelector(sel).innerHTML;
    let all = document.querySelectorAll(sel)
      console.log(document.querySelector(sel))
      console.log(all, "SFS")
    // format is: "69,803 users"
    return html;
  }, twit);
  //need remove all tag
  console.log('Dimensions:', inner.replace( pattern, "" ));

  await browser.close();
})();

