from playwright.sync_api import sync_playwright
from utils.validator import is_youtube_live, is_stream_live

def tvgarden_scraper(url: str):
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

            print(f"📌 LIVE OR NOT: {url}")
            page.goto(url, timeout=30000)
            page.wait_for_timeout(3000)  # optional: let content fully load

            page.wait_for_selector(".video-link", timeout=20000)

            buttons = page.locator(".video-link")
            count = buttons.count()

            for i in range(count):
                button = buttons.nth(i)

                try:
                    video_url = button.get_attribute("data-video-url")
                    color = button.evaluate("el => getComputedStyle(el).color")
                except:
                    continue  # skip this button if error

                if color == 'rgb(36, 36, 43)':
                    if video_url and video_url.startswith("https://www.youtube-nocookie.com"):
                        status = is_youtube_live(video_url)
                        return status
                    elif video_url:
                        status = "UP" if is_stream_live(video_url) else "DOWN"
                        return status

            return "DOWN"

        except Exception as e:
            print("❌ Error:", e)
            return "ERROR"

        finally:
            browser.close()


def extract_tvgarden_name(url: str):
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

            print(f"📌 Extracing channel name from {url}")
            page.goto(url, timeout=30000)
            page.wait_for_timeout(3000)  # optional delay to allow JS to load

            # Wait for required elements
            page.wait_for_selector(".video-link", timeout=20000)
            page.wait_for_selector("#header-title", timeout=20000)

            # Get country name
            country_name = page.locator("#header-title").text_content()
            if not country_name:
                country_name = "Unknown"

            # Get all buttons
            buttons = page.locator(".video-link")
            count = buttons.count()

            for i in range(count):
                button = buttons.nth(i)
                try:
                    color = button.evaluate("el => getComputedStyle(el).color")
                except:
                    continue  # skip if can't get color

                if color == 'rgb(36, 36, 43)':
                    span = button.locator("span.channel-name-container")
                    channel_name = span.text_content()
                    if channel_name:
                        return f"{channel_name} ({country_name})"

            return "Unknown Channel"

        except Exception as e:
            print("❌ Error:", e)
            return "ERROR"

        finally:
            browser.close()