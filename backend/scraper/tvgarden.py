from playwright.sync_api import sync_playwright
from utils.youtube_checker import is_video_live
import requests
import time

def check_file(url):
    print("Checking file:", url)
    try:
        response = requests.head(url, timeout=5)
        return response.status_code == 200 and 'application' in response.headers.get('Content-Type', '')
    except:
        return False

def tvgarden_scraper(url: str, see_name: bool = False):
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(
                headless=True,
                args=[
                    "--start-maximized",
                    "--disable-gpu",
                    "--no-sandbox",
                    "--log-level=3"
                ]
            )
            
            context = browser.new_context()
            page = context.new_page()
            
            print(f"📌 {url}")
            name = None
            
            page.goto(url)
            page.wait_for_selector(".video-link", timeout=20000)
            time.sleep(5)  # Let content fully render

            buttons = page.locator(".video-link")
            count = buttons.count()


            for i in range(count):
                button = buttons.nth(i)

                span = button.locator("span.channel-name-container")
                channel_name = span.text_content()
                video_url = button.get_attribute("data-video-url")

                color = button.evaluate("el => getComputedStyle(el).color")

                if color == 'rgb(36, 36, 43)':

                    if video_url and video_url.startswith("https://www.youtube-nocookie.com"):
                        # logic for YouTube live check
                        status = is_video_live(video_url)
                        print(status)
                        return status, channel_name
                    else:
                        # logic for normal file check
                        status = "UP" if check_file(video_url) else "DOWN"
                        print(status)
                        return status, channel_name

            return "DOWN", name

        except Exception as e:
            print("❌ Error:", e)
            return "ERROR", None

        finally:
            browser.close()