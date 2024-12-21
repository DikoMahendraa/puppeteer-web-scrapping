const puppeteer = require("puppeteer");
const xlsx = require("xlsx");
const path = require("path");

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("https://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  });

  const allQuotes = [];
  let hasNextPage = true;

  while (hasNextPage) {
    const quotes = await page.evaluate(() => {
      const quoteList = document.querySelectorAll(".quote");

      return Array.from(quoteList).map((quote) => {
        const text = quote.querySelector(".text").innerText;
        const author = quote.querySelector(".author").innerText;

        return { text, author };
      });
    });

    allQuotes.push(...quotes);

    hasNextPage = await page.evaluate(() => {
      const nextButton = document.querySelector(".pager > .next > a");

      if (nextButton) {
        nextButton.click();

        return true;
      }

      return false;
    });

    if (hasNextPage) {
      await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    }
  }

  const worksheet = xlsx.utils.json_to_sheet(allQuotes);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "ALL QUOTES");

  const filePath = path.join(__dirname, "quotes.xlsx");

  xlsx.writeFile(workbook, filePath);

  console.log({ allQuotes });
};

getQuotes();
