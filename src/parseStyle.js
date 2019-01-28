const puppeteer = require('puppeteer');
const { assets } = require('../config.default');
const { URL } = require('url');
const fse = require('fs-extra'); // v 5.0.0
const path = require('path');
const fs = require('fs');


(async () => {
  const browser = await puppeteer.launch(
//       {
//     headless: false,
//     slowMo: 250 
//   }
);

  const page = await browser.newPage();
  await page.goto('http://fronty.ru/');
  await page._client.send('DOM.enable');
  await page._client.send('CSS.enable');
  const doc = await page._client.send('DOM.getDocument');

  const nodes = await page._client.send('DOM.querySelectorAll', {
      nodeId: doc.root.nodeId,
      selector: '*'
  });

  const list = await page._client.send('DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector: '.list'
});

  const styleForSingleNode = await page._client.send('CSS.getMatchedStylesForNode', {nodeId: 3});
  const stylesForNodes = []
  for (id of nodes.nodeIds) {
    stylesForNodes.push(await page._client.send('CSS.getMatchedStylesForNode', {nodeId: id}));
  }
  const s = await page._client.send('CSS.getMatchedStylesForNode', {nodeId: 46});
  console.log(nodes, list)
//   console.log(JSON.stringify());
//   console.log(JSON.stringify());
  fs.writeFile('1.json', JSON.stringify(s), _ => console.log('HTML saved'));
//   fs.writeFile('2.json', JSON.stringify(styleForSingleNode), _ => console.log('HTML saved'));
  await browser.close();
  
})();