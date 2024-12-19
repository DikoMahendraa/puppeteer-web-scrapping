const puppeteer = require("puppeteer");

const getQuotes = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will be in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "networkidle2",
  });

  // Get page data
  const quotes = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    // Get the displayed text and returns it
    const quoteList = document.querySelectorAll(".quote");

    // Convert the quoteList to an iterable array
    // For each quote fetch the text and author
    return Array.from(quoteList).map((quote) => {
      // Fetch the sub-elements from the previously fetched quote element
      // Get the displayed text and return it (`.innerText`)
      const text = quote.querySelector(".text").innerText;
      const author = quote.querySelector(".author").innerText;

      return { text, author };
    });
  });

  // Click on the "Next page" button
  await page.click(".pager > .next > a");

  // Display the quotes
  console.log(quotes);

  // Close the browser
  // await browser.close();
};

// Start the scraping
getQuotes();

// ============= CHATGPT ================ //

// import puppeteer from "puppeteer";

const getQuotes = async () => {
  // Launch the Puppeteer browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto(
    "https://www.tokopedia.com/discovery/berdasarkan-pencarianmu-1?source=homepage.top_carousel.0.38456",
    {
      waitUntil: "domcontentloaded",
    }
  );

  // An array to store all quotes
  const allQuotes = [];

  let hasNextPage = true; // Flag to check if there is a next page

  while (hasNextPage) {
    // Extract quotes on the current page
    const quotes = await page.evaluate(() => {
      const quoteList = document.querySelectorAll(".quote");
      return Array.from(quoteList).map((quote) => {
        const text = quote.querySelector(".text").innerText;
        const author = quote.querySelector(".author").innerText;
        return { text, author };
      });
    });

    // Append the current page's quotes to the allQuotes array
    allQuotes.push(...quotes);

    // Check if there is a "Next" button and click it
    hasNextPage = await page.evaluate(() => {
      const nextButton = document.querySelector(".pager > .next > a");
      if (nextButton) {
        nextButton.click();
        return true;
      }
      return false;
    });

    // Wait for the next page content to load, if applicable
    if (hasNextPage) {
      await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    }
  }

  // Log all collected quotes
  console.log(allQuotes);

  // Close the browser
  await browser.close();
};

// Start the scraping
getQuotes();
