const fs = require('fs');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const executablePath =  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const filePath = 'D:\\repos\\codes_dolce_gusto.txt';
const userDolceGusto = process.env.USER_DOLCE_GUSTO
const passDolceGusto = process.env.PASS_DOLCE_GUSTO
const lines = fs.readFileSync(filePath, 'utf8', (err, data) => {
  if (err) throw err;
});

puppeteer.use(StealthPlugin())

(async () => {
  
  const browser = await puppeteer.launch({
    executablePath: executablePath, 
    headless: false, 
    args: ['--no-sandbox'] 
  });
  
  const page = await browser.newPage();  
  await page.setDefaultNavigationTimeout(0)
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

  await page.goto('https://www.dolce-gusto.ch/customer/account/login/');
  await page.waitForNetworkIdle();

  await page.type("input[name='login[username]']", userDolceGusto);
  await page.type("input[name='login[password]']", passDolceGusto);

  console.log('clicking login button')
  await page.click("#send2");
  console.log('waiting for network idle 1')
  await page.waitForNavigation();

  console.log('going to reward page')
  await page.goto('https://www.dolce-gusto.ch/reward/customer/info/');
  console.log('waiting for network idle 2')



  console.log('reading file and inserting codes')
  for (let index = 0; index < lines.length; index++) {
    const element = lines[index];
    console.log('inserting code:', element)
    await page.type('#code', element);
    await page.waitForTimeout(1000);
    await page.click("button[type='submit'].form-fieldset__button-primary--blank");
    console.log('waiting for network idle 3')
    await page.waitForNavigation();    
    
    // TODO: get result and save to file

  }
  console.log('done!!!')
  
})();
