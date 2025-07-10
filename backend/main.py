from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from config import supabase
from scraper.tvgarden import extract_tvgarden_name, tvgarden_scraper
from utils.local_time import get_local_time
import asyncio
import sys

# Use correct event loop policy on Windows
if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class FolderData(BaseModel):
    url: str
    type: str

class ScraperData(BaseModel):
    url: str
    folder_id: str

# POST /folder — create folder
@app.post("/folder")
async def create_folder(data: FolderData):
    # Check if URL already exists
    existing = await asyncio.to_thread(
        lambda: supabase.table("Folder").select("url").eq("url", data.url).execute()
    )
    if existing.data:
        return JSONResponse(
            status_code=400,
            content={"message": "URL already exists", "code": 400}
        )

    # Run sync scraper in thread
    name = await asyncio.to_thread(extract_tvgarden_name, data.url)

    # Insert folder into database
    insert_response = await asyncio.to_thread(
        lambda: supabase.table("Folder").insert({
            "url": data.url,
            "name": name,
            "ongoing": True,
            "type": data.type
        }).execute()
    )

    if insert_response.data:
        return JSONResponse(
            status_code=201,
            content={"message": "Folder created", "folder_id": insert_response.data[0]["folder_id"], "code": 201}
        )
    else:
        return JSONResponse(
            status_code=500,
            content={"error": "Insertion failed", "code": 500}
        )

# POST /start-scraper/tv.garden — run scraper every hour for 24 times
@app.post("/start-scraper/tv.garden")
async def run_scraper(data: ScraperData):
    print("scraper is now running")

    async def run_24_times():
        for i in range(24):
            print(f"▶️ Running scraper {i+1}/24 for URL: {data.url}")
            status = await asyncio.to_thread(tvgarden_scraper, data.url)
            error = ""
            print("Status:", status)

            if status not in ["UP", "DOWN"]:
                error = status
                status = "DOWN"

            await asyncio.to_thread(
                lambda: supabase.table("Logs").insert({
                    "status": status,
                    "ongoing": True,
                    "url": data.url,
                    "timestamp": get_local_time(),
                    "folder_id": data.folder_id,
                    "error": error
                }).execute()
            )

            print(f"✅ Scraper run {i+1}/24 completed for URL: {data.url}")
            await asyncio.sleep(5)  # normally 3600 (1 hour)

        # ✅ After 24 runs, mark folder.ongoing as False
        print("📦 Updating folder.ongoing to False")
        await asyncio.to_thread(
            lambda: supabase.table("Folder")
            .update({"ongoing": False})
            .eq("folder_id", data.folder_id)
            .execute()
        )

    asyncio.create_task(run_24_times())

    return JSONResponse(
        status_code=202,
        content={"message": "Scraper is now running"}
    )
