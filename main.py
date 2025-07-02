import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from urllib.parse import urlparse, parse_qs
from bs4 import BeautifulSoup
import time


def is_youtube(link):
    youtube_regex = re.compile(
        r'(https?://)?(www\.)?(youtube\.com|youtu\.be)/'
    )
    return bool(youtube_regex.match(link))

def is_youtube_live(video_url):
    # Extract video ID
    try:
        query = urlparse(video_url).query
        video_id = parse_qs(query)['v'][0]
    except (KeyError, IndexError):
        print("Invalid YouTube URL.")
        return None

    # Headless browser setup
    options = Options()
    options.add_argument("--mute-audio")
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    driver = webdriver.Chrome(options=options)

    # Embed YouTube HTML
    embed_url = f"https://www.youtube.com/embed/{video_id}?enablejsapi=1"
    html = f"""
    <html>
    <body>
        <div id="status">Checking...</div>
        <script src="https://www.youtube.com/iframe_api"></script>
        <iframe id="ytplayer" width="640" height="360"
            src="{embed_url}" frameborder="0" allowfullscreen></iframe>
        <script>
        var player;
        function onYouTubeIframeAPIReady() {{
            player = new YT.Player('ytplayer', {{
                events: {{
                    onReady: function () {{
                        try {{
                            var duration = player.getDuration();
                            var isLive = duration === 0;
                            document.getElementById('status').textContent = isLive ? 'UP (LIVE)' : 'DOWN (RECORDED)';
                        }} catch (e) {{
                            document.getElementById('status').textContent = 'RESTRICTED or ERROR';
                        }}
                    }},
                    onError: function () {{
                        document.getElementById('status').textContent = 'RESTRICTED or ERROR';
                    }}
                }}
            }});
        }}
        </script>
    </body>
    </html>
    """

    # Load HTML and wait
    driver.get("data:text/html;charset=utf-8," + html)
    time.sleep(5)
    try:
        status = driver.find_element("id", "status").text
    except Exception as e:
        status = "ERROR"
    driver.quit()
    return status

def check_link_and_keywords(page_url):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=options)
    driver.get(page_url)
    time.sleep(5)  # Let the page load

    # Check for YouTube iframe
    youtube_link = None
    iframes = driver.find_elements("tag name", "iframe")
    for iframe in iframes:
        src = iframe.get_attribute("src")
        if src and "youtube.com/embed/" in src:
            video_id = src.split("/embed/")[1].split("?")[0]
            youtube_link = f"https://www.youtube.com/watch?v={video_id}"
            break

    # Check for live keywords
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text().lower()
    driver.quit()

    live_keywords = ["live now", "on now", "watch live", "streaming live", "breaking news", "live stream"]
    is_live = 'UP' if any(keyword in text for keyword in live_keywords) else 'DOWN'

    return youtube_link, is_live

# Example usage
link = "https://edition.cnn.com/specials/live-video-1"

if is_youtube(link):

    result = is_youtube_live(link)
    print(result)

else: 
    youtube_link, is_live = check_link_and_keywords(link)
    
    if youtube_link:
        result = is_youtube_live(youtube_link)
        print(result)

    else:
        print(is_live)