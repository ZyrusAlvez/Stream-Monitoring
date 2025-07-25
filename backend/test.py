from scraper.tvgarden import tvgarden_scraper
from scraper.radiogarden import radiogarden_scraper
from utils.screenshot import upload_to_supabase
from scraper.melisten import melisten_scrapper
from scraper.kiss92 import kiss92_scrapper

status = melisten_scrapper("https://www.melisten.sg/radio/gold-905")
# status, ss = kiss92_scrapper("https://www.kiss92.sg/shows/")

print(status)
# upload_to_supabase(ss, ",elisten.png")
