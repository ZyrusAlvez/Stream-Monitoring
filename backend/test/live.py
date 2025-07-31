import requests
from datetime import datetime, timedelta

API_KEY = "AIzaSyC-g7v4suUgufq5lbxQ_qRu30qXP3dUSos"
CHANNEL_USERNAME = "dzxlnews"

# Step 1: Get channel ID from username
def get_channel_id(username):
    # fallback: search by handle
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": f"@{username}",
        "type": "channel",
        "maxResults": 1,
        "key": API_KEY
    }
    res = requests.get(url, params=params).json()
    print(res["items"][0]["snippet"]["channelId"])
    return res["items"][0]["snippet"]["channelId"]


# Step 2: Get uploads playlist ID
def get_uploads_playlist_id(channel_id):
    url = "https://www.googleapis.com/youtube/v3/channels"
    params = {"part": "contentDetails", "id": channel_id, "key": API_KEY}
    res = requests.get(url, params=params).json()
    return res["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

# Step 3: Get all video IDs from uploads playlist
def get_all_video_ids(playlist_id):
    video_ids = []
    url = "https://www.googleapis.com/youtube/v3/playlistItems"
    params = {
        "part": "contentDetails",
        "playlistId": playlist_id,
        "maxResults": 50,
        "key": API_KEY
    }

    while True:
        res = requests.get(url, params=params).json()
        for item in res["items"]:
            video_ids.append(item["contentDetails"]["videoId"])
        if "nextPageToken" in res:
            params["pageToken"] = res["nextPageToken"]
        else:
            break

    return video_ids

# Step 4: Check each video for livestream type
def filter_live_streams(video_ids):
    live_streams = []
    for i in range(0, len(video_ids), 50):
        batch = video_ids[i:i+50]
        url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            "part": "snippet",
            "id": ",".join(batch),
            "key": API_KEY
        }
        res = requests.get(url, params=params).json()
        for item in res["items"]:
            snippet = item["snippet"]
            if snippet.get("liveBroadcastContent") == "none" and "live" in snippet["title"].lower():
                # Convert to PH Time
                dt_utc = datetime.strptime(snippet["publishedAt"], "%Y-%m-%dT%H:%M:%SZ")
                dt_ph = dt_utc + timedelta(hours=8)
                live_streams.append({
                    "id": item["id"],
                    "title": snippet["title"],
                    "publish_time": dt_ph.strftime("%Y-%m-%d %I:%M:%S %p"),
                    "day": dt_ph.strftime("%A")
                })
    return live_streams

# Run the full process
channel_id = get_channel_id(CHANNEL_USERNAME)
uploads_id = get_uploads_playlist_id(channel_id)
all_ids = get_all_video_ids(uploads_id)
streams = filter_live_streams(all_ids)

# Output
for vid in streams:
    print(f"{vid['id']} | {vid['day']} {vid['publish_time']} | {vid['title']}")
