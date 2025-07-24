from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from config import supabase
from scraper.tvgarden import extract_tvgarden_name, tvgarden_scraper
from scraper.iptvorg import extract_iptv_name, iptv_scraper
from scraper.radiogarden import extract_radiogarden_name, radiogarden_scraper
from scraper.kiss92 import kiss92_scrapper
from scraper.melisten import extract_melisten_name, melisten_scrapper
from utils.local_time import get_local_time, get_local_datetime_object, to_manila_datetime
from utils.validator import is_stream_live, is_youtube_live
from utils.extractors import extract_youtube_title, extract_channel_name, extract_live_videos
from typing import Optional
import asyncio
import sys
from datetime import datetime, timedelta
import pytz

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
    repetition: int
    interval: int
    start_time: str

# POST /folder — create folder
@app.post("/api/createFolder")
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
    if data.type == "tv.garden":
        name = await asyncio.to_thread(extract_tvgarden_name, data.url)
    elif data.type == "iptv-org":
        name = await asyncio.to_thread(extract_iptv_name, data.url)
    elif data.type == "radio.garden":
        name = await asyncio.to_thread(extract_radiogarden_name, data.url)
    elif data.type == "m3u8":
        name = data.url
    elif data.type == "kiss92":
        name = "Custom Source - Kiss92"
    elif data.type == "youtube":
        name = await asyncio.to_thread(extract_youtube_title, data.url)
    elif data.type == "melisten":
        name = await asyncio.to_thread(extract_melisten_name, data.url)
    elif data.type == "youtube/channel":
        print("extracting channel name")
        name = await asyncio.to_thread(extract_channel_name, data.url)
        print(name)
    else:
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid type URL", "code": 400}
        )

    # Insert folder into database
    insert_response = await asyncio.to_thread(
        lambda: supabase.table("Folder").insert({
            "url": data.url,
            "name": name,
            "ongoing": True,
            "type": data.type,
            "start_time": data.start_time,
            "repetition": data.repetition,
            "interval" : data.interval
        }).execute()
    )

    if insert_response.data:
        return JSONResponse(
            status_code=201,
            content={"message": "Folder created", "folder_id": insert_response.data[0]["folder_id"], "code": 201, "name" : name}
        )
    else:
        return JSONResponse(
            status_code=500,
            content={"error": "Insertion failed", "code": 500}
        )

# Store running tasks globally
running_tasks = {}

class ScraperData(BaseModel):
    url: str
    folder_id: str
    type: str
    repetition: int
    interval: int
    start_time: Optional[str] = None

@app.post("/api/runScraper")
async def run_scraper(data: ScraperData):
    print("scraper is now running")
    print(data)

    # Check if there's already a running task for this folder
    if data.folder_id in running_tasks:
        return JSONResponse(
            status_code=409,
            content={"error": "Scraper is already running for this folder", "code": 409}
        )

    async def run_repetition():
        try:
            # ⏰ Wait until scheduled time
            if data.start_time:
                now = get_local_datetime_object()
                start_dt = to_manila_datetime(data.start_time)
                delay = (start_dt - now).total_seconds()
                if delay > 0:
                    print(f"⏳ Waiting {delay} seconds until scheduled start...")
                    await asyncio.sleep(delay)

            for i in range(data.repetition):
                await asyncio.to_thread(
                    lambda: supabase.table("Folder")
                    .update({"next_call_time": 'Currently Running'})
                    .eq("folder_id", data.folder_id)
                    .execute()
                )

                # Check if task was cancelled
                current_task = asyncio.current_task()
                if current_task and current_task.cancelled():
                    print("Task was cancelled")
                    break
                    
                print(f"▶️ Running scraper {i+1}/{data.repetition} for URL: {data.url}")
                
                # Initialize variables
                status = ""
                error = ""
                results = None
                
                # Execute scraping based on type
                if data.type == "tv.garden":
                    status = await asyncio.to_thread(tvgarden_scraper, data.url)
                elif data.type == "iptv-org":
                    status = await asyncio.to_thread(iptv_scraper, data.url)
                elif data.type == "radio.garden":
                    status = await asyncio.to_thread(radiogarden_scraper, data.url)
                elif data.type == "m3u8":
                    status = await asyncio.to_thread(is_stream_live, data.url)
                elif data.type == "youtube":
                    status = await asyncio.to_thread(is_youtube_live, data.url)
                elif data.type == "melisten":
                    status = await asyncio.to_thread(melisten_scrapper, data.url)
                elif data.type == "youtube/channel":
                    results, status = await asyncio.to_thread(extract_live_videos, data.url)
                    if status not in ["UP", "DOWN"]:
                        error = status
                        status = "DOWN"

                    await asyncio.to_thread(
                        lambda: supabase.table("YoutubeChannelLogs").insert({
                            "status": status,
                            "results": results,
                            "timestamp": get_local_time(),
                            "folder_id": data.folder_id,
                            "error": error
                        }).execute()
                    )
                    
                    print(f"✅ Scraper run {i+1}/{data.repetition} completed for URL: {data.url}")
                    
                    # Check if this is the last iteration before sleeping
                    if i < data.repetition - 1:
                        next_time = datetime.now(pytz.timezone("Asia/Manila")) + timedelta(seconds=data.interval)

                        await asyncio.to_thread(
                            lambda: supabase.table("Folder")
                            .update({"next_call_time": next_time.isoformat()})
                            .eq("folder_id", data.folder_id)
                            .execute()
                        )

                        await asyncio.sleep(data.interval)  # normally 3600 (1 hour)

                    continue
                
                elif data.type == "kiss92":
                    status = await asyncio.to_thread(kiss92_scrapper, data.url)
                    if status not in ["UP", "DOWN"]:
                        error = status
                        status = "DOWN"

                    await asyncio.to_thread(
                        lambda: supabase.table("CustomSourceLogs").insert({
                            "status": status,
                            "timestamp": get_local_time(),
                            "error": error,
                            "type" : "kiss92"
                        }).execute()
                    )
                    
                    print(f"✅ Scraper run {i+1}/{data.repetition} completed for URL: {data.url}")
                    
                    # Check if this is the last iteration before sleeping
                    if i < data.repetition - 1:
                        next_time = datetime.now(pytz.timezone("Asia/Manila")) + timedelta(seconds=data.interval)

                        await asyncio.to_thread(
                            lambda: supabase.table("Folder")
                            .update({"next_call_time": next_time.isoformat()})
                            .eq("folder_id", data.folder_id)
                            .execute()
                        )

                        await asyncio.sleep(data.interval)  # normally 3600 (1 hour)
                    continue
                else:
                    # Clean up task from dictionary before returning error
                    if data.folder_id in running_tasks:
                        del running_tasks[data.folder_id]
                    return JSONResponse(
                        status_code=400,
                        content={"error": "Invalid type URL", "code": 400}
                    )

                # Handle non-youtube/channel types
                if data.type != "youtube/channel":
                    print("Status:", status)

                    if status not in ["UP", "DOWN"]:
                        error = status
                        status = "DOWN"

                    await asyncio.to_thread(
                        lambda: supabase.table("Logs").insert({
                            "status": status,
                            "url": data.url,
                            "timestamp": get_local_time(),
                            "folder_id": data.folder_id,
                            "error": error
                        }).execute()
                    )

                    print(f"✅ Scraper run {i+1}/{data.repetition} completed for URL: {data.url}")
                    
                    # Check if this is the last iteration before sleeping
                    if i < data.repetition - 1:
                        next_time = datetime.now(pytz.timezone("Asia/Manila")) + timedelta(seconds=data.interval)

                        await asyncio.to_thread(
                            lambda: supabase.table("Folder")
                            .update({"next_call_time": next_time.isoformat()})
                            .eq("folder_id", data.folder_id)
                            .execute()
                        )

                        await asyncio.sleep(data.interval)  # normally 3600 (1 hour)


            # ✅ After all runs, mark folder.ongoing as False
            print("📦 Updating folder.ongoing to False")
            await asyncio.to_thread(
                lambda: supabase.table("Folder")
                .update({"ongoing": False, "next_call_time": "Finished Running"})
                .eq("folder_id", data.folder_id)
                .execute()
            )
            
            print(f"🎉 Scraper completed all {data.repetition} runs for folder: {data.folder_id}")
        except asyncio.CancelledError:
            print(f"❌ Task was cancelled during execution for folder: {data.folder_id}")
        finally:
            # Clean up task from dictionary
            if data.folder_id in running_tasks:
                del running_tasks[data.folder_id]
                print(f"🧹 Cleaned up task reference for folder: {data.folder_id}")

    # Create and store the task
    task = asyncio.create_task(run_repetition())
    if data.type == "kiss92":
        running_tasks[data.type] = task
    else:
        running_tasks[data.folder_id] = task

    return JSONResponse(
        status_code=202,
        content={"message": "Scraper is now running", "folder_id": data.folder_id}
    )

class FolderStopRequest(BaseModel):
    folder_id: str

@app.post("/api/stopScraper")
async def stop_scraper(req: FolderStopRequest):
    folder_id = req.folder_id
    """Stop a running scraper task by folder_id"""
    task = running_tasks.get(folder_id)
    if not task:
        return JSONResponse(
            status_code=404,
            content={"error": "No running scraper found for this folder", "folder_id": folder_id}
        )

    if task.done():
        # Task already completed — remove reference
        running_tasks.pop(folder_id, None)
        return JSONResponse(
            status_code=200,
            content={"message": "Scraper task was already completed", "folder_id": folder_id}
        )

    print(f"🛑 Stopping scraper for folder: {folder_id}")
    task.cancel()

    try:
        await task  # Wait for task to handle cancellation
    except asyncio.CancelledError:
        print(f"✅ Task for folder {folder_id} was cancelled successfully")

    # Cleanup after cancellation
    running_tasks.pop(folder_id, None)

    return JSONResponse(
        status_code=200,
        content={"message": "Scraper stopped successfully", "folder_id": folder_id}
    )