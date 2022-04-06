const puppeteer = require('puppeteer');
const Article = require('./article.js');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox"]
    });
    console.log('Browser openned');
    const page = await browser.newPage();
    const url = 'http://tinhdoannghean.vn/tuoitre/';
    await page.goto(url);
    console.log('Page loaded');
    await page.$eval("input[name='user'", el => el.value = 'thuthao');
    await page.$eval("input[name='pass'", el => el.value = '123456');
    await page.$eval("input[type='submit'", form => form.click());
    const totalPage = 232;
    let array = [];
    for (let count = 1; count <= 1; count++) {
        const pageUrl = 'http://tinhdoannghean.vn/tuoitre/okpublier.asp?id=4&lang=2&page=' + count;
        await page.goto(pageUrl);
        let data = [];
        let dateArray = await page.evaluate(() => Array.from(document.querySelectorAll('tr[bgcolor="#ECE9D8"] > td:nth-child(5)'), element => element.innerHTML));
        let urlArray = await page.evaluate(() => Array.from(document.querySelectorAll('.subbottom'), element => element.href));
        urlArray = urlArray.filter(url => !url.startsWith('http://tinhdoannghean.vn/tuoitre/okpublier2'));
        if (dateArray.length == urlArray.length) {
            for (let index = 0; index < urlArray.length; index++) {
                let object = new Object();
                object.url = urlArray[index];
                object.date = dateArray[index];
                data.push(object);
            }
        }
        array = array.concat(data);
    }

    let allArticles = [];
    for (let data of array) {
        await page.goto(data.url);
        let article = new Article();
        article.publishedDate = data.date;
        article.quote = await page.$eval('#news_short', (el) => el.value);
        article.title = await page.$eval('input[name="news_name"]', (input) => {
            return input.getAttribute("value")
        });
        article.content =  await page.$eval('#news_full', (el) => el.value);

        allArticles.push(article);
    }
    Article.bulkSave(allArticles)
    console.log(allArticles);
    await browser.close();
})();