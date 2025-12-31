import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

/**
 * Scrapes job details from a given URL using a headless browser.
 * @param {string} url - The job listing URL.
 * @returns {Promise<string>} - The cleaned text content of the page.
 */
export const scrapeJobLink = async (url) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    console.log(`[Scraper] Navigating to: ${url}`);

    await page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });

    await new Promise(resolve => setTimeout(resolve, 2500));

    const extractedContent = await page.evaluate(() => {
      const junkSelectors = [
        'nav', 'footer', 'header', 'script', 'style', 
        'noscript', 'iframe', '.ads', '.social-share', 'button'
      ];
      
      junkSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });

      const contentRoot = document.querySelector('main') || 
                          document.querySelector('article') || 
                          document.body;
                          
      return contentRoot.innerText;
    });

    const sanitizedData = extractedContent.replace(/\s\s+/g, ' ').trim();

    if (sanitizedData.length < 200) {
      throw new Error('Insufficient content extracted. Page might be protected or empty.');
    }

    console.log(`[Scraper] Success! Content length: ${sanitizedData.length}`);
    
    return sanitizedData.substring(0, 10000);

  } catch (error) {
    console.error(`[Scraper] Error: ${error.message}`);
    throw new Error(`Scraping process failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
      console.log("[Scraper] Browser session closed.");
    }
  }
};