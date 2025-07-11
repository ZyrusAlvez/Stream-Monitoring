import time
from datetime import datetime
import pytz
from scraper.tvgarden import tvgarden_scraper, extract_tvgarden_name
from config import supabase

# Local timestamp
def get_local_time():
    tz = pytz.timezone("Asia/Manila")
    return datetime.now(tz).strftime("%Y-%m-%d %I:%M:%S %p")

# Main loop function
def run_scraper(url_list):
    for _ in range(24):
        for url in url_list:
            try:
                status = tvgarden_scraper(url)
            except Exception:
                status = "Scrapper Error"
            print(status)
            
            # supabase.table("tvgarden-testing").insert({
            #     "status": status,
            #     "timestamp": get_local_time(),
            #     "url": url
            # }).execute()

        time.sleep(5)

if __name__ == "__main__":
    urls = [
        "https://tv.garden/ph/k1le9DNzsDpeDQ",
        "https://tv.garden/ph/WHLkcAVBDrKrdV",
        "https://tv.garden/ph/iy4DzSWvO3GYHT",
        "https://tv.garden/bo/PuOdackS09IXBO"
    ]
    run_scraper(urls)
    print("Scraping completed.")