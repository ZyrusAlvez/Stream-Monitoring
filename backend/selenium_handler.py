# selenium_handler.py

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from youtube_checker import is_video_live
import time

def setup_driver():
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--headless")  # Run without opening a window
    options.add_argument("--disable-gpu")  # Needed for some systems
    options.add_argument("--no-sandbox")  # Good for Linux servers
    return webdriver.Chrome(options=options)

def play_and_check(driver, url):
    driver.get(url)
    try:
        # Click play button
        play_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.ID, "play-button-overlay"))
        )
        play_button.click()
        print("Play button clicked.")

        time.sleep(30)  # Wait for the video to load

        # Confirm video is playing
        is_playing = driver.execute_script("""
            const video = document.querySelector('video');
            return video && !video.paused && !video.ended && video.readyState > 2;
        """)

        if is_playing:
            print("✅ Video is UP and playing.")
        else:
            print("⚠️ Not playing directly. Checking for YouTube embeds...")

            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "video-link"))
            )

            buttons = driver.find_elements(By.CLASS_NAME, "video-link")

            for button in buttons:
                video_url = button.get_attribute("data-video-url")
                channel = button.get_attribute("data-channel-name")
                bg_color = button.value_of_css_property("color")

                if (
                    video_url and
                    video_url.startswith("https://www.youtube-nocookie.com/embed/") and
                    bg_color != "rgba(241, 241, 241, 1)"
                ):
                    print(bg_color)
                    print(f"📺 Channel: {channel}")
                    print(f"🔗 Video URL: {video_url}")
                    print("---")
                    print(is_video_live(video_url))

            print("✅ Done checking embedded videos.")

    except Exception as e:
        print("❌ Error:", e)
    finally:
        driver.quit()
