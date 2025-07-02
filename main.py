import re
import time
import os
import requests
from urllib.parse import urlparse, parse_qs
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from colored import fg, attr

# Load the .env file
load_dotenv()

# Global log storage
log_data = []

def log(message):
    timestamp = time.strftime("[%Y-%m-%d %H:%M:%S]")
    formatted = f"{fg('green')}{attr('bold')}{timestamp} {message}{attr('reset')}"
    print(formatted)
    log_data.append(f"{timestamp} {message}")

# Get the API key from environment
api_key = os.getenv("YOUTUBE_DATA_API_KEY")

def is_youtube(link):
    log("Received URL")
    youtube_regex = re.compile(
        r'(https?://)?(www\.)?(youtube\.com|youtu\.be)/'
    )
    result = bool(youtube_regex.match(link))
    log("URL is YouTube link" if result else "URL is not a YouTube link")
    return result

def extract_video_id(youtube_url):
    log("Extracting video ID")
    query = urlparse(youtube_url)
    if query.hostname in ["youtu.be"]:
        return query.path[1:]
    if query.hostname in ["www.youtube.com", "youtube.com"]:
        if query.path == "/watch":
            return parse_qs(query.query).get("v", [None])[0]
    return None

def is_youtube_live(video_url):
    video_id = extract_video_id(video_url)
    if not video_id:
        log("Invalid YouTube URL")
        return "Invalid YouTube URL"

    log(f"Video ID: {video_id}")
    log("Querying YouTube API")

    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "id": video_id,
        "part": "snippet,liveStreamingDetails",
        "key": api_key
    }

    response = requests.get(url, params=params).json()
    items = response.get("items", [])
    if not items:
        log("Video not found")
        return "Video not found"

    live_status = items[0]["snippet"].get("liveBroadcastContent", "none")
    readable = {
        "live": "UP (Live)",
        "upcoming": "UPCOMING",
        "none": "Down (Recorded)"
    }.get(live_status, live_status)
    log(f"Live status from API: {readable}")
    return readable

def check_link_and_keywords(page_url):
    log("Opening browser to check page content")
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=options)
    driver.get(page_url)
    time.sleep(5)  # Let the page load

    # Check for YouTube iframe
    youtube_link = None
    log("Checking for embedded YouTube iframe")

    keywords_method = False
    iframes = driver.find_elements("tag name", "iframe")
    for iframe in iframes:
        src = iframe.get_attribute("src")
        if src and "youtube.com/embed/" in src:
            video_id = src.split("/embed/")[1].split("?")[0]
            youtube_link = f"https://www.youtube.com/watch?v={video_id}"
            log(f"Found embedded YouTube video: {youtube_link}")
            return youtube_link, None

    # Check for live keywords
    log("No existing embedded YouTube iframe")
    log("Scanning page text for live-related keywords")
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text().lower()
    driver.quit()

    live_keywords = ["live now", "on now", "watch live", "streaming live", "breaking news", "live stream"]
    is_live = 'UP (Live)' if any(keyword in text for keyword in live_keywords) else 'DOWN'
    return None, is_live

# Example usage
link = "https://edition.cnn.com/specials/live-video-1"

if is_youtube(link):
    result = is_youtube_live(link)
    log(f"Final Result: {result}")
else: 
    youtube_link, is_live = check_link_and_keywords(link)
    
    if youtube_link:
        result = is_youtube_live(youtube_link)
        log(f"Final Result via embedded YouTube: {result}")
    else:
        log(f"Final Result via keyword check: {is_live}")

# You can now use `log_data` list for storage
