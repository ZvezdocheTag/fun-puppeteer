const puppeteer = require('puppeteer');
const { assets } = require('../config.default');
const CREDS = require('../creds');
const mongoose = require('mongoose');
const User = require('./models/user');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://github.com/login');
  const USERNAME_SELECTOR = '#login_field';
  const PASSWORD_SELECTOR = '#password';
  const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(CREDS.username);

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(CREDS.password);

  await page.click(BUTTON_SELECTOR);

  await page.waitForNavigation();

  const userToSearch = 'john';
  let firstThreePage = 3;

  const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`;

  await page.goto(searchUrl);
  await page.waitFor(2*1000);

  const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > a';
  const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > ul > li:nth-child(2) > a';
    
  const LENGTH_SELECTOR_CLASS = 'user-list-item';

  let numPages = await getNumPages(page);

  for (let h = 1; h <= numPages; h++) {

    let pageUrl = searchUrl + '&p=' + h;
  
    await page.goto(pageUrl);
  
    let listLength = await page.evaluate((sel) => {
        return document.getElementsByClassName(sel).length;
      }, LENGTH_SELECTOR_CLASS);
  
    for (let i = 1; i <= listLength; i++) {
      // change the index to the next child
      let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i);
      let emailSelector = LIST_EMAIL_SELECTOR.replace("INDEX", i);
  
      let username = await page.evaluate((sel) => {
          return document.querySelector(sel).getAttribute('href').replace('/', '');
        }, usernameSelector);
  
      let email = await page.evaluate((sel) => {
          let element = document.querySelector(sel);
          return element? element.innerHTML: null;
        }, emailSelector);
  
      // not all users have emails visible
      if (!email)
        continue;
  
      console.log(username, ' -> ', email);
  
      // TODO save this users
    }
  }


  // await browser.close();
})();

async function getNumPages(page) {
  const NUM_USER_SELECTOR = '#js-pjax-container > div.container > div > div.column.three-fourths.codesearch-results div.d-flex.flex-justify-between.border-bottom.pb-3 > h3';

  let inner = await page.evaluate((sel) => {
    let html = document.querySelector(sel).innerHTML;
    
    // format is: "69,803 users"
    return html.replace(',', '').replace('users', '').trim();
  }, NUM_USER_SELECTOR);

  let numUsers = parseInt(inner);

  /*
  * GitHub shows 10 resuls per page, so
  */
  let numPages = Math.ceil(numUsers / 10);
  return numPages;
}

function upsertUser(userObj) {
	
	const DB_URL = 'mongodb://localhost/fun-puppeteer';

  	if (mongoose.connection.readyState == 0) { mongoose.connect(DB_URL); }

    	// if this email exists, update the entry, don't insert
	let conditions = { email: userObj.email };
	let options = { upsert: true, new: true, setDefaultsOnInsert: true };

  	User.findOneAndUpdate(conditions, userObj, options, (err, result) => {
  		if (err) throw err;
  	});
}

