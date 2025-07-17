import re
import requests

API_KEY = 'AIzaSyC-g7v4suUgufq5lbxQ_qRu30qXP3dUSos'

def get_channel_id_from_url(url):
    match = re.search(r'youtube\.com/@([\w\-]+)', url)
    if not match:
        return None
    handle = match.group(1)

    # Use search endpoint since @handles aren't directly supported
    search_url = f'https://www.googleapis.com/youtube/v3/search?part=snippet&q={handle}&type=channel&key={API_KEY}'
    res = requests.get(search_url).json()
    if 'items' in res and res['items']:
        return res['items'][0]['snippet']['channelId']
    return None

# Example
url = 'https://www.youtube.com/@psmnewslive/live'
print(get_channel_id_from_url(url))
