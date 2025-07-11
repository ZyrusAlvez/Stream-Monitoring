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
            try:
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
                return "Element not found"
    except:
        return "Web Scraper Failed"

def extract_iptv_name(url: str):
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(url, timeout=60000)

            # Wait for the first table to load
            table = page.locator("table").first
            table.wait_for(timeout=15000)

            rows = table.locator("tr")
            row_count = rows.count()

            name_text = None
            country_text = None

            for i in range(row_count):
                row = rows.nth(i)
                tds = row.locator("td")
                if tds.count() < 2:
                    continue

                key = tds.nth(0).text_content(timeout=3000).strip().lower()
                value = tds.nth(1).text_content(timeout=3000).strip()

                if key == "name":
                    name_text = value
                elif key == "country":
                    country_text = value

            browser.close()

            if name_text and country_text:
                return f"{name_text} ({country_text})"
            else:
                return "Required elements not found"

    except Exception as e:
        return f"Web Scraper Failed: {e}"