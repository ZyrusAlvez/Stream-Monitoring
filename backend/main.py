from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from config import supabase

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FolderData(BaseModel):
    url: str
    type: str

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
