from playwright.sync_api import sync_playwright
from utils.validator import is_youtube_live, is_stream_live

def tvgarden_scraper(url: str):
    with sync_playwright() as p:
        browser = None
        page = None
        screenshot = None
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
            
            try:
                page = context.new_page()

                print(f"📌 LIVE OR NOT: {url}")
                try:
                    page.goto(url, timeout=30000)
                except:
                    screenshot = page.screenshot(full_page=True)
                    return "Website not reachable", screenshot
                
                play_button = page.locator("#play-button-overlay")
                play_button.wait_for(state="visible", timeout=30000)
                play_button.click(force=True)

                page.wait_for_timeout(3000)

                page.wait_for_selector(".video-link", timeout=20000)

                buttons = page.locator(".video-link")
                count = buttons.count()

                for i in range(count):
                    button = buttons.nth(i)

                    try:
                        color = button.evaluate("el => getComputedStyle(el).color")

                        if color == 'rgb(36, 36, 43)':
                            video_url = button.get_attribute("data-video-url")
                            if video_url and video_url.startswith("https://www.youtube-nocookie.com"):
                                status = is_youtube_live(video_url)
                                if status == "UP":
                                    return status, None
                                else:
                                    screenshot = page.screenshot(full_page=True)
                                    return status, screenshot
                            elif video_url:
                                status = is_stream_live(video_url)
                                if status == "UP":
                                    return status, None
                                else:
                                    screenshot = page.screenshot(full_page=True)
                                    return status, screenshot
                    except:
                        screenshot = page.screenshot(full_page=True)
                        return "Video source error", screenshot
            except:
                screenshot = page.screenshot(full_page=True)
                return "Element not found", screenshot
            
            screenshot = page.screenshot(full_page=True)
            return "DOWN", screenshot

        except Exception as e:
            if page:
                screenshot = page.screenshot(full_page=True)
                return e, screenshot
            return e, None
        
        finally:
            try:
                browser.close()
            except:
                pass

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
            try:
                browser.close()
            except:
                pass