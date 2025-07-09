from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from config import supabase
from scraper.tvgarden import extract_tvgarden_name
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

# Data model
class FolderData(BaseModel):
    url: str
    type: str

# POST /folder — create folder
@app.post("/folder")
async def create_folder(data: FolderData):
    # Check if URL already exists
    existing = await asyncio.to_thread(
        lambda: supabase.table("Folder").select("url").eq("url", data.url).execute()
    )
    if existing.data:
        raise HTTPException(status_code=400, detail="URL already exists")

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
        return {"message": "Folder created"}
    else:
        raise HTTPException(status_code=500, detail="Insertion failed")
