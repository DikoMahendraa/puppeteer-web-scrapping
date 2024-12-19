const puppeteer = require("puppeteer");

const getData = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("https://www.tokopedia.com", {
    waitUntil: "domcontentloaded",
  });

  const getProducts = await page.evaluate(() => {
    const products = document.querySelectorAll(
      '[data-testid="master-product-card"]'
    );

    products.forEach((priceElement, index) => {
      const findProduct = priceElement.querySelector(
        ".prd_link-product-name"
      ).innerText;
      const findPrice = priceElement.querySelector(
        ".prd_link-product-price"
      ).innerText;

      console.log({ findProduct, findPrice });

      return {
        title: findProduct,
        price: findPrice,
      };
    });
  });

  console.log("fet the product ========", getProducts);

  // console.log("I got this product", getProducts);
};

getData();
