const puppeteer = require('puppeteer');

let openMultipleBrowsers = async (url, quantity) => {
  const list = Array.from(Array(quantity).keys());

  await Promise.all(list.map(async (i) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(url);
  }));
}

let checkIfButtonIsActive = async (urlToSearch, selector, msInterval, quantity) => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto(urlToSearch);

  const interval = setInterval(async () => {
    const href = await page.evaluate((selector) => {
      const buttonLink = document.body.querySelector(selector).closest('a');
      return buttonLink.href;
    }, selector);

    if (href != null && href != urlToSearch) {
      console.log("Button is available:", href);

      clearInterval(interval);
      await browser.close();

      openMultipleBrowsers(href, quantity);
    } else {
      console.log("Button not found, refreshing page...");
      await page.reload();
    }
  }, msInterval);
}

(async () => {
  const arguments = process.argv

  const func = arguments[2];

  const urlOptionIndex = arguments.indexOf('--url') > -1 ? arguments.indexOf('--url') : arguments.indexOf('-u');
  let url = urlOptionIndex > -1 ? arguments[urlOptionIndex + 1] : null;

  const quantityOptionIndex = arguments.indexOf('--quantity') > -1 ? arguments.indexOf('--quantity') : arguments.indexOf('-q');
  let quantity = quantityOptionIndex > -1 ? arguments[quantityOptionIndex + 1] : null;

  const intervalOptionIndex = arguments.indexOf('--inverval') > -1 ? arguments.indexOf('--inverval') : arguments.indexOf('-i');
  let interval = intervalOptionIndex > -1 ? arguments[intervalOptionIndex + 1] : null;

  const selectorOptionIndex = arguments.indexOf('--selector') > -1 ? arguments.indexOf('--selector') : arguments.indexOf('-s');
  let selector = selectorOptionIndex > -1 ? arguments[selectorOptionIndex + 1] : null;

  if (!url) {
    console.log('URL is required');
  } else {
    switch (func) {
      case 'check':
        if (!quantity) {
          quantity = 10;
        }

        if (!interval) {
          interval = 30000;
        }

        if (!selector) {
          selector = "a img[alt=scotia]";
        }
          
        checkIfButtonIsActive(url, selector, parseInt(interval), parseInt(quantity));  
        
        break;
    
      case 'open':
        if (!quantity) {
          quantity = 10;
        }
        
        openMultipleBrowsers(url, parseInt(quantity));
      default:
        break;
    }
  }
  
})();

  
