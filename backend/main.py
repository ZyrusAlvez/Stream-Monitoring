from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from config import supabase
from scraper.tvgarden import tvgarden_scraper
import asyncio

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

class ScraperRequest(BaseModel):
    url: str

# POST /folder — create folder
@app.post("/folder")
async def create_folder(data: FolderData):
    existing = supabase.table("Folder").select("url").eq("url", data.url).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="URL already exists")

    insert_response = supabase.table("Folder").insert({
        "url": data.url,
        "name": "",
        "ongoing": True,
        "type": data.type
    }).execute()

    if insert_response.data:
        new_id = insert_response.data[0]["folder_id"]
        return {"message": "Folder created", "id": new_id}
    else:
        raise HTTPException(status_code=500, detail="Insertion failed")

# Scraper background task
async def run_scraper_hourly_24x(url: str):
    for i in range(24):
        print(f"[{i+1}/24] Scraping {url}...")
        await tvgarden_scraper(url)
        await asyncio.sleep(3600)  # 1 hour

# POST /start-scraper — start task with URL
@app.post("/start-scraper")
async def start_scraper_task(request: ScraperRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(run_scraper_hourly_24x, request.url)
    return {"message": f"Scraper will run every hour for 24 times on {request.url}"}
