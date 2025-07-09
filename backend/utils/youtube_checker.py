# youtube_checker.py
import requests
from config import YOUTUBE_API_KEY
from utils.extractors import extract_video_id

def is_video_live(youtube_url):
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
