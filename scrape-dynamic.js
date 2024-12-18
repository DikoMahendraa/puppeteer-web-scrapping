const puppeteer = require("puppeteer");

async function scrapeDynamicContent() {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Go to the target URL
  await page.goto("https://example.com", { waitUntil: "networkidle2" });

  // Extract content
  const titles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("h1")).map(
      (el) => el.textContent
    );
  });

  // Output results
  console.log(titles);

  // Close the browser
  await browser.close();
}

scrapeDynamicContent();
