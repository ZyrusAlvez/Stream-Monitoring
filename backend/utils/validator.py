# youtube_checker.py
import requests
from config import YOUTUBE_API_KEY
from utils.extractors import extract_video_id

def is_youtube_live(youtube_url):

    try:
        video_id = extract_video_id(youtube_url)
        if not video_id:
            return "DOWN"

        url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            "id": video_id,
            "part": "snippet",
            "key": YOUTUBE_API_KEY
        }

        response = requests.get(url, params=params).json()
        items = response.get("items", [])
    except:
        return "Youtube video source error"
    
    if not items:
        return "DOWN"

    live_status = items[0]["snippet"].get("liveBroadcastContent", "none")
    return "UP" if live_status == "live" else "DOWN"

def is_stream_live(url):
    print("Checking file:", url)
    try:
        try:
            response = requests.head(url, timeout=30)
        except:
            return "Timeout Error on the video source"
        print(response)
        if 200 <= response.status_code < 400:
            return "UP"
        return "DOWN"
    
    except:
        return False
    
def is_tv_garden_url(url: str) -> bool:
    return url.startswith("https://tv.garden/")

def is_radio_garden_url(url: str) -> bool:
    return url.startswith("https://radio.garden/visit/")

def is_iptv_org_url(url: str) -> bool:
    return url.startswith("https://iptv-org.github.io/channels/")
