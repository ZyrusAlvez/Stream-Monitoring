from playwright.sync_api import sync_playwright
from utils.validator import is_stream_live

def iptv_scraper(url: str):
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            # Go to the page
            page.goto(url, timeout=60000)

            # Click "Streams" button
            page.click('button[title="Streams"]')

            # Wait for <a> elements to appear
            page.wait_for_selector('a[target="_blank"][rel="noopener noreferrer"]', timeout=10000)

            # Get the link
            link = page.query_selector(
                'a[target="_blank"][rel="noopener noreferrer"][class="whitespace-nowrap text-sm hover:text-blue-500 dark:hover:text-blue-400 hover:underline"]'
            )
            href = link.get_attribute("href") if link else None
            status = "UP" if href and is_stream_live(href) else "DOWN"
            browser.close()
            return status
    except:
        return "DOWN"