from urllib.parse import urlparse, parse_qs

def extract_video_id(url):
    parsed = urlparse(url)
    if "youtube-nocookie.com" in parsed.netloc and "/embed/" in parsed.path:
        return parsed.path.split("/embed/")[-1]
    elif "youtu.be" in parsed.netloc:
        return parsed.path.strip("/")
    elif "youtube.com" in parsed.netloc:
        return parse_qs(parsed.query).get("v", [None])[0]
    return None
