const axios = require("axios");
const cheerio = require("cheerio");

// Target URL
const url = "https://example.com";

async function scrapeTitles() {
  try {
    // Fetch HTML
    const { data } = await axios.get(url);

    // Load HTML with Cheerio
    const $ = cheerio.load(data);

    // Extract titles
    const titles = [];
    $("h1").each((index, element) => {
      titles.push($(element).text());
    });

    // Output results
    console.log(titles);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

scrapeTitles();
