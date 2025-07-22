from urllib.parse import urlparse, parse_qs
from config import YOUTUBE_API_KEY
import requests
import re

def extract_video_id(url):
    parsed = urlparse(url)
    if "youtube-nocookie.com" in parsed.netloc and "/embed/" in parsed.path:
        return parsed.path.split("/embed/")[-1]
    elif "youtu.be" in parsed.netloc:
        return parsed.path.strip("/")
    elif "youtube.com" in parsed.netloc:
        return parse_qs(parsed.query).get("v", [None])[0]
    return None

def extract_youtube_title(youtube_url):
    try:
        video_id = extract_video_id(youtube_url)
        if not video_id:
            return None

        url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            "id": video_id,
            "part": "snippet",
            "key": YOUTUBE_API_KEY
        }
        response = requests.get(url, params=params).json()
        items = response.get("items", [])
        if not items:
            return None
        
        return items[0]["snippet"]["title"]
    except:
        return None

def extract_channel_id(url):
    # Handle /channel/CHANNEL_ID format
    match_channel = re.search(r'youtube\.com/channel/([a-zA-Z0-9_-]+)', url)
    if match_channel:
        return match_channel.group(1)

    # Handle @handle format
    match_handle = re.search(r'youtube\.com/@([\w\-]+)', url)
    if match_handle:
        handle = match_handle.group(1)
        search_url = f'https://www.googleapis.com/youtube/v3/search?part=snippet&q={handle}&type=channel&key={YOUTUBE_API_KEY}'
        res = requests.get(search_url).json()
        if 'items' in res and res['items']:
            return res['items'][0]['snippet']['channelId']
    
    return None
    
def extract_channel_name(url):
    channel_id = extract_channel_id(url)
    url = "https://www.googleapis.com/youtube/v3/channels"
    params = {
        "part": "snippet",
        "id": channel_id,
        "key": YOUTUBE_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    items = data.get("items", [])
    if not items:
        return None

    print("channel name", items[0]["snippet"]["title"])
    return items[0]["snippet"]["title"]

def extract_live_videos(url):
    try:
        try:
            channel_id = extract_channel_id(url)
        except:
            return [], "Error in youtube channel url input"
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "channelId": channel_id,
            "eventType": "live",
            "type": "video",
            "key": YOUTUBE_API_KEY
        }

        response = requests.get(url, params=params)
        data = response.json()

        results = []
        for item in data.get("items", []):
            title = item["snippet"]["title"]
            video_id = item["id"]["videoId"]
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            results.append({"title": title, "url": video_url})
        if not results:
            return results, "DOWN"
        return results, "UP"
    except:
        return [], "Error in youtube API Call"