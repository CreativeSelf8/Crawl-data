const puppeteer = require('puppeteer');
const Article = require('./article.js');

(async() => {
    const browser = await puppeteer.launch({
        headless:false,
        args: ["--no-sandbox"]
    });
    console.log('Browser openned');
    const page = await browser.newPage();
    const url = 'http://tinhdoannghean.vn/tuoitre/';
    await page.goto(url);
    console.log('Page loaded');
    await page.$eval("input[name='user'", el => el.value = 'thuthao');
    await page.$eval("input[name='pass'", el => el.value = '123456');
    await page.$eval("input[type='submit'", form => form.click() );
    

    // const myclassname = await page.evaluate(() => document.querySelectorAll('.subbottom'));

    // console.log(myclassname);   

    let arrayUrl = [];
    for (let count = 1; count <= 1; count++) {
        const pageUrl = 'http://tinhdoannghean.vn/tuoitre/okpublier.asp?id=4&lang=2&page=' + count;
        await page.goto(pageUrl);
        let elements = await page.evaluate(() => Array.from(document.querySelectorAll('tr[bgcolor="#ECE9D8"] > td'), element => {
            let object = new Object();
            console.log(element.innerHTML);
            return element.innerHTML;
        }));
        // elements = elements.filter(url => !url.startsWith('http://tinhdoannghean.vn/tuoitre/okpublier2'));
        arrayUrl = arrayUrl.concat(elements);
    }
    console.log(arrayUrl);  
    // await browser.close();
})();