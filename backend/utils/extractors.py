from urllib.parse import urlparse, parse_qs
import requests

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
            "key": "AIzaSyC-g7v4suUgufq5lbxQ_qRu30qXP3dUSos"
        }
        response = requests.get(url, params=params).json()
        items = response.get("items", [])
        if not items:
            return None

        return items[0]["snippet"]["title"]
    except:
        return None
