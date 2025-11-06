import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Apply the stealth plugin
puppeteer.use(StealthPlugin());

const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
};

/**
 * Runs the Puppeteer scraper on Amazon for a given search term.
 * @param {string} searchTerm - The product search term (e.g., "laptops").
 * @returns {Promise<Array>} A promise that resolves to an array of scraped product objects.
 */
export const scrapeAmazon = async (searchTerm) => {
    let browser;
    console.log(`🚀 Launching scraper for term: ${searchTerm}`);
    try {
        browser = await puppeteer.launch({
            //headless: false, // Must run in headful mode to bypass security
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        await page.goto('https://www.amazon.in/', { waitUntil: 'networkidle2', timeout: 90000 });
        await page.type('#twotabsearchtextbox', searchTerm, { delay: 100 });
        
        await Promise.all([
            page.keyboard.press('Enter'),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);

        await page.waitForSelector('div.s-result-item[data-asin]', { timeout: 20000 });
        await autoScroll(page);
        await new Promise(resolve => setTimeout(resolve, 3000));

        const products = await page.evaluate(() => {
            const results = [];
            const items = document.querySelectorAll('div.s-result-item[data-asin]');

            for (let i = 0; i < items.length && results.length < 10; i++) { // Get 10 results
                const item = items[i];
                const isSponsored = item.querySelector('.puis-label-popover-hover') || item.querySelector('a.s-link-style[href*="/sspa/click"]');
                if (isSponsored) continue;

                const titleEl = item.querySelector('.a-size-medium.a-color-base.a-text-normal, .a-size-base-plus.a-color-base.a-text-normal');
                const priceEl = item.querySelector('.a-price-whole');
                const imageEl = item.querySelector('.s-image');

                if (titleEl && priceEl && imageEl) {
                    const title = titleEl.innerText;
                    const price = parseFloat(priceEl.innerText.replace(/[₹,]/g, ''));
                    const image = imageEl.src;

                    if (title && !isNaN(price) && image && image.startsWith('https')) {
                        results.push({ title, price, image, description: `A high-quality ${title}.` });
                    }
                }
            }
            return results;
        });

        console.log(`✅ Scraped ${products.length} products.`);
        return products;

    } catch (error) {
        console.error('❌ An error occurred during scraping:', error.message);
        throw new Error('Scraping failed. Amazon may be blocking requests.');
    } finally {
        if (browser) {
            await browser.close();
            console.log('🚪 Browser closed.');
        }
    }
};