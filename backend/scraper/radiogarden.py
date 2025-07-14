from playwright.sync_api import sync_playwright
import re
import requests

def radiogarden_scraper(url):
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=[
                "--no-sandbox",
                "--disable-blink-features=AutomationControlled"
            ])
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
            )
            page = context.new_page()

            # Bypass navigator.webdriver
            page.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                });
            """)

            stream_url = None

            # Intercept streaming requests
            def handle_route(route, request):
                nonlocal stream_url
                if re.search(r'/listen/.+/channel\.mp3', request.url):
                    stream_url = request.url
                route.continue_()

            page.route("**/*", handle_route)

            print(f"Opening: {url}")
            page.goto(url, timeout=30000)

            try:
                page.wait_for_selector("div[role='button'][aria-label='Start Radio Garden']", timeout=30000)
                page.click("div[role='button'][aria-label='Start Radio Garden']")
                print("Clicked play button... waiting for stream URL")
            except:
                print("❌ Play button not found.")
                browser.close()
                return "Element not found"

            # Wait up to 15s (500ms × 30) for real stream URL
            for _ in range(30):
                if stream_url:
                    break
                page.wait_for_timeout(500)

            browser.close()
            print(stream_url)
            if stream_url:
                return check_stream_status(stream_url)  # Call your checker function
            else:
                print("❌ Stream URL not found.")
                return "Stream URL not found"

    except Exception as e:
        return f"❌ Web Scraper Failed: {e}"

def check_stream_status(url: str) -> bool:
    print("checking now", url)
    try:

        response = requests.get(url, stream=True, timeout=10)
        if 200 <= response.status_code < 400:
            return "UP"
        return "DOWN"
    except requests.exceptions.RequestException:
        return "DOWN"

def extract_radiogarden_name(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, timeout=60000)

        try:
            # Wait until title is present (max 15 seconds)
            page.wait_for_selector('div._title_xy527_29._themed_uii1s_311.__states_uii1s_13', timeout=15000)
            channel = page.text_content('div._title_xy527_29._themed_uii1s_311.__states_uii1s_13')
        except:
            channel = ""

        try:
            page.wait_for_selector('div._themed_uii1s_311.__states_uii1s_13._subtitle_xy527_36', timeout=15000)
            country = page.text_content('div._themed_uii1s_311.__states_uii1s_13._subtitle_xy527_36')
        except:
            country = ""

        browser.close()

    if not channel:
        return ""
    else:
        return f"{channel} ({country})"
