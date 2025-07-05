from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import requests
from dotenv import load_dotenv
import os

load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

# Setup Chrome
options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(options=options)

# Target URL
url = "https://tv.garden/ph/k1le9DNzsDpeDQ"
driver.get(url)

def is_video_live(youtube_url):
    def extract_video_id(url):
        from urllib.parse import urlparse, parse_qs

        parsed = urlparse(url)
        if "youtube-nocookie.com" in parsed.netloc and "/embed/" in parsed.path:
            return parsed.path.split("/embed/")[-1]
        elif "youtu.be" in parsed.netloc:
            return parsed.path.strip("/")
        elif "youtube.com" in parsed.netloc:
            return parse_qs(parsed.query).get("v", [None])[0]
        return None

    video_id = extract_video_id(youtube_url)
    if not video_id:
        return "down"

    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "id": video_id,
        "part": "snippet",
        "key": YOUTUBE_API_KEY
    }

    response = requests.get(url, params=params).json()
    items = response.get("items", [])
    if not items:
        return "down"

    live_status = items[0]["snippet"].get("liveBroadcastContent", "none")
    return "up" if live_status == "live" else "down"

try:
    # Step 1: Click play button
    play_button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "play-button-overlay"))
    )
    play_button.click()
    print("Play button clicked.")

    # Step 2: Wait for video to start
    time.sleep(10)

    # Step 3: Check if video is playing
    is_playing = driver.execute_script("""
        const video = document.querySelector('video');
        return video && !video.paused && !video.ended && video.readyState > 2;
    """)

    if is_playing:
        print("✅ Video is UP and playing.")
    else:
        print("Checking if it's a YouTube embed...")
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

        print("done")

except Exception as e:
    print("Error:", e)

finally:
    driver.quit()