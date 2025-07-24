from playwright.sync_api import sync_playwright

def play_and_check(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=False)
        context = browser.new_context()
        page = context.new_page()

        try:
            page.goto(url, timeout=30000)

            # Try clicking play if needed
            play_button = page.locator("#play-button-overlay")
            play_button.wait_for(state="visible", timeout=30000)
            play_button.click(force=True)
            print("✅ Play button force-clicked.")

             # Check for active <video>
            try:
                page.wait_for_function("""
                    () => {
                        const v = document.querySelector('video');
                        return v && !v.paused && !v.ended && v.readyState > 2;
                    }
                """, timeout=3000)

                print("UP")
            except:
                print("⚠️ Still not playing. Checking for YouTube embeds...")
                page.wait_for_selector(".video-link", timeout=30000)
                buttons = page.locator(".video-link")

                for i in range(buttons.count()):
                    button = buttons.nth(i)
                    video_url = button.get_attribute("data-video-url")
                    channel = button.get_attribute("data-channel-name")
                    color = button.evaluate("el => getComputedStyle(el).color")

                    if (
                        video_url and
                        video_url.startswith("https://www.youtube-nocookie.com/embed/") and
                        color == "rgb(36, 36, 43)"
                    ):
                        print(f"🎨 Color: {color}")
                        print(f"📺 Channel: {channel}")
                        print(f"🔗 URL: {video_url}")
                        print("---")

        except Exception as e:
            print("❌ Exception:", e)
        finally:
            browser.close()

play_and_check("https://tv.garden/us/X8yK2ahG1lHzY9")
