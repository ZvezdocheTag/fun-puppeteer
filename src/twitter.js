const puppeteer = require('puppeteer');
const { assets, channel } = require('../config.default');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(`https://twitter.com/${channel}`);
  const twit = '.js-stream-item.stream-item .tweet-text';
  

  let inner = await page.evaluate((sel) => {
    const pattern = /(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/g;
    let html = document.querySelector(sel).innerHTML;
    let all = document.querySelectorAll(sel);
    let result = "";

      for(let i = 0; i < all.length; i+=1) {

        result += `${all[i].innerHTML.replace( pattern, "" )} _______ \n`
      }
    // format is: "69,803 users"
    return result;
  }, twit);
  //need remove all tag
  // console.log('Dimensions:', inner.replace( pattern, "" ));
  console.log(inner)

  await browser.close();
})();

