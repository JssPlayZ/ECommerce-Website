import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

// --- CONFIGURATION ---
const SEARCH_TERM = process.argv[2];
const CATEGORY = process.argv[3];
const PRODUCTS_TO_SCRAPE = 15;
const OUTPUT_FILE = 'scraped_products.json';
const SCREENSHOT_FILE = 'error_screenshot.png';

if (!SEARCH_TERM || !CATEGORY) {
    console.error('ERROR: Please provide a search term and a category name as arguments.');
    console.log('Example: node scraper.js "laptops" "electronics"');
    process.exit(1);
}

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

const scrapeProducts = async () => {
    let browser;
    try {
        console.log('🚀 Launching VISIBLE stealth browser (Headful Mode)...');
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        console.log(`📡 Navigating to Amazon homepage...`);
        await page.goto('https://www.amazon.in/', { waitUntil: 'networkidle2', timeout: 90000 });

        console.log(`🔎 Typing '${SEARCH_TERM}' into the search bar...`);
        await page.type('#twotabsearchtextbox', SEARCH_TERM, { delay: 100 });

        await Promise.all([
            page.keyboard.press('Enter'),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);

        console.log('⏳ Waiting for any product item to appear...');
        try {
            await page.waitForSelector('div.s-result-item[data-asin]', { timeout: 20000 });
        } catch (e) {
            throw new Error('Could not find any product items. Amazon may be showing a CAPTCHA or a different layout.');
        }

        console.log('📜 Scrolling down to load all products...');
        await autoScroll(page);
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('🤖 Scraping product data with universal selectors...');
        const products = await page.evaluate((limit, category) => {
            const results = [];
            const items = document.querySelectorAll('div.s-result-item[data-asin]');

            for (let i = 0; i < items.length && results.length < limit; i++) {
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
                        results.push({ title, price, image, description: `A high-quality ${title}.`, category });
                    }
                }
            }
            return results;
        }, PRODUCTS_TO_SCRAPE, CATEGORY);

        if (products.length === 0) {
            console.warn('⚠️ WARNING: Scraped 0 products.');
            await page.screenshot({ path: SCREENSHOT_FILE });
            console.log(`📸 A screenshot has been saved to '${SCREENSHOT_FILE}' for debugging.`);
        } else {
            let existingProducts = [];
            if (fs.existsSync(OUTPUT_FILE)) {
                const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
                if (fileContent) {
                    existingProducts = JSON.parse(fileContent);
                }
            }

            const existingTitles = new Set(existingProducts.map(p => p.title));
            const newUniqueProducts = products.filter(p => !existingTitles.has(p.title));

            if (newUniqueProducts.length > 0) {
                const combinedProducts = [...existingProducts, ...newUniqueProducts];
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(combinedProducts, null, 2));
                console.log(`✅ Appended ${newUniqueProducts.length} new unique products.`);
                console.log(`💾 File now contains a total of ${combinedProducts.length} products.`);
            } else {
                console.log('✅ No new unique products found to add.');
            }
        }

    } catch (error) {
        console.error('❌ An error occurred:', error.message);
        if (browser) {
            try {
                const pages = await browser.pages();
                if (pages && pages.length > 0 && !pages[0].isClosed()) {
                    await pages[0].screenshot({ path: SCREENSHOT_FILE });
                    console.log(`📸 An error screenshot has been saved to '${SCREENSHOT_FILE}'.`);
                }
            } catch (screenshotError) {
                console.error('Could not take a screenshot:', screenshotError.message);
            }
        }
    } finally {
        if (browser) {
            await browser.close();
            console.log('🚪 Browser closed.');
        }
    }
};

scrapeProducts();