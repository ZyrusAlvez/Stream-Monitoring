import streamlit as st
import re
import time
import os
import requests
from urllib.parse import urlparse, parse_qs
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load API key
load_dotenv()
api_key = os.getenv("YOUTUBE_DATA_API_KEY")

# Streamlit UI
st.title("Live Stream Status Checker")
link = st.text_input("Enter video or page URL:")
start_button = st.button("Check Status")

# Placeholder for logs
log_placeholder = st.empty()
log_data = []

# Live log function
def log(message):
    timestamp = time.strftime("[%Y-%m-%d %H:%M:%S]")
    formatted = f"{timestamp} {message}"
    log_data.append(formatted)
    log_placeholder.text("\n".join(log_data[-20:]))

# Helpers
def is_youtube(link):
    log("Received URL")
    youtube_regex = re.compile(r'(https?://)?(www\.)?(youtube\.com|youtu\.be)/')
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
    time.sleep(5)

    log("Checking for embedded YouTube iframe")
    iframes = driver.find_elements("tag name", "iframe")
    for iframe in iframes:
        if iframe:
            src = iframe.get_attribute("src")
            if src and "youtube.com/embed/" in src:
                video_id = src.split("/embed/")[1].split("?")[0]
                youtube_link = f"https://www.youtube.com/watch?v={video_id}"
                log(f"Found embedded YouTube video: {youtube_link}")
                driver.quit()
                return youtube_link, None

    log("No embedded YouTube iframe found")
    log("Scanning for live-related keywords")
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text().lower()
    driver.quit()

    keywords = ["live now", "on now", "watch live", "streaming live", "breaking news", "live stream"]
    status = "UP (Live)" if any(k in text for k in keywords) else "DOWN"
    return None, status

# Processing
if start_button and link:
    log_data.clear()
    if is_youtube(link):
        result = is_youtube_live(link)
        log(f"Final Result: {result}")
    else:
        youtube_link, is_live = check_link_and_keywords(link)
        if youtube_link:
            result = is_youtube_live(youtube_link)
            log(f"Final Result via embedded YouTube: {result}")
        else:
            result = is_live
            log(f"Final Result via keyword check: {result}")

    st.subheader("Status Result")
    st.success(result)
