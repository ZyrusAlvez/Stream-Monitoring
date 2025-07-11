import requests

API_KEY = "s"
CHANNEL_ID = "UCSJ4gkVC6NrvII8umztf0Ow"  #channel ID

print("running")
url = "https://www.googleapis.com/youtube/v3/search"
params = {
    "part": "snippet",
    "channelId": CHANNEL_ID,
    "eventType": "live",
    "type": "video",
    "key": API_KEY
}

response = requests.get(url, params=params)
print(response)
data = response.json()

for item in data.get("items", []):
    title = item["snippet"]["title"]
    video_id = item["id"]["videoId"]
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    print(f"Title: {title}")
    print(f"URL: {video_url}\n")
