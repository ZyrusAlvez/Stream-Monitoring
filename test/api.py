import os
from dotenv import load_dotenv
import requests
from urllib.parse import urlparse, parse_qs

# Load the .env file
load_dotenv()

# Get the API key from environment
api_key = os.getenv("YOUTUBE_DATA_API_KEY")

def extract_video_id(youtube_url):
    query = urlparse(youtube_url)
    if query.hostname in ["youtu.be"]:
        return query.path[1:]
    if query.hostname in ["www.youtube.com", "youtube.com"]:
        if query.path == "/watch":
            return parse_qs(query.query).get("v", [None])[0]
    return None

def is_video_live(youtube_url, api_key):
    video_id = extract_video_id(youtube_url)
    if not video_id:
        return "Invalid YouTube URL"

    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "id": video_id,
        "part": "snippet,liveStreamingDetails",
        "key": api_key
    }

    response = requests.get(url, params=params).json()
    items = response.get("items", [])
    if not items:
        return "Video not found"

    live_status = items[0]["snippet"].get("liveBroadcastContent", "none")
    if live_status == "none":
        live_status = "Down (Recorded)"
    return live_status  # "live", "upcoming", or "none"

# Example usage
print(is_video_live("https://www.youtube.com/watch?v=8AWEPx5cHWQ", api_key))
