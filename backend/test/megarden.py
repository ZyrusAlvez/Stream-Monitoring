from playwright.sync_api import sync_playwright
from playwright_stealth import stealth_sync
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=False)
        context = browser.new_context()
        page = context.new_page()

        stealth_sync(page)  # Apply stealth patch

        page.goto("https://www.melisten.sg/radio/gold-905")
        page.wait_for_load_state("networkidle")

        print("Simulating human interaction...")
        page.mouse.click(200, 200)  # Trigger user gesture

        time.sleep(60)
        browser.close()

if __name__ == "__main__":
    run()
