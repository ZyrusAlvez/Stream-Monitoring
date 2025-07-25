import requests
from config import SUPABASE_KEY, SUPABASE_URL

def upload_to_supabase(data: bytes, file_name: str) -> str:
    BUCKET = "screenshots"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "image/png"
    }

    res = requests.post(
        f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{file_name}",
        headers=headers,
        data=data
    )

    if res.status_code in [200, 201]:
        return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{file_name}"
    else:
        raise Exception(f"Upload failed: {res.status_code} - {res.text}")