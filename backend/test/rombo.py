import requests
from datetime import datetime, timedelta

# API URL
url = "https://www.googleapis.com/youtube/v3/videos"
params = {
    "part": "snippet",
    "id": "PqEXgueiXVA",
    "key": "AIzaSyC-g7v4suUgufq5lbxQ_qRu30qXP3dUSos"
}

# Fetch video data
response = requests.get(url, params=params)
data = response.json()

# Extract publishedAt
published_at_utc = data['items'][0]['snippet']['publishedAt']

# Convert to datetime
dt_utc = datetime.strptime(published_at_utc, "%Y-%m-%dT%H:%M:%SZ")

# Convert to Philippine Time (UTC+8)
dt_ph = dt_utc + timedelta(hours=8)

# Format result
formatted_date = dt_ph.strftime("%Y-%m-%d %I:%M:%S %p")
day_of_week = dt_ph.strftime("%A")

print("Philippine Time:", formatted_date)
print("Day of the Week:", day_of_week)
