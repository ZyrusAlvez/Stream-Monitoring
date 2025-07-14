import pytz
from datetime import datetime

def get_local_time():
    tz = pytz.timezone("Asia/Manila")
    return datetime.now(tz).strftime("%Y-%m-%d %I:%M:%S %p")

def to_manila_datetime(dt_str):
    tz = pytz.timezone("Asia/Manila")
    return tz.localize(datetime.strptime(dt_str, "%Y-%m-%d %I:%M:%S %p"))