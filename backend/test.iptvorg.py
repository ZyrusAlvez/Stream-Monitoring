import time
from datetime import datetime
import pytz
from scraper.iptvorg import iptv_scraper, extract_iptv_name
from config import supabase

# Local timestamp
def get_local_time():
    tz = pytz.timezone("Asia/Manila")
    return datetime.now(tz).strftime("%Y-%m-%d %I:%M:%S %p")

# Main loop function
def run_scraper(url_list):
    for _ in range(24):  # 24 cycles
        for url in url_list:
            try:
                status = extract_iptv_name(url)
            except Exception:
                status = "DOWN"

            print(status)

            # supabase.table("iptv-testing").insert({
            #     "status": status,
            #     "name": name,
            #     "timestamp": get_local_time(),
            #     "url": url
            # }).execute()

        time.sleep(5)

if __name__ == "__main__":
    urls = [
        "https://iptv-org.github.io/channels/at/RTV#SD",
        "https://iptv-org.github.io/channels/at/AntenneKaernten#SD",
        "https://iptv-org.github.io/channels/af/1TV#SD",
        "https://iptv-org.github.io/channels/ph/A2Z#SD"
    ]
    run_scraper(urls)
    print("Scraping completed.")
