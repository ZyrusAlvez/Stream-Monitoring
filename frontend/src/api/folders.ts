import { supabase } from "../config"
import { backendUrl } from "../config";

export async function createFolder(url: string, type: string, repetition: number, interval: number, startTime: string){
	try {
		const res = await fetch(`${backendUrl}/api/createFolder`, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url, type, repetition, interval, start_time: startTime}),
		});

		const data = await res.json();
		console.log(res)
		console.log(data)
		if (data?.code === 400){
			throw new Error(data?.message)
		}
		
		console.log("Response from server:", data);
		return data;
	} catch (error) {
		console.error("Error submitting URL:", error);
		throw error; // Re-throw the error to be handled by the caller
	}
}

export type Folder = {
  folder_id: string
  created_at: string
  url: string
  name: string
  type: string
  ongoing: boolean
  repetition: number
  interval: number
  start_time: string
  next_call_time: string | null
}

export const getAllFolder = async (type: string, ongoing: boolean): Promise<Folder[]> => {
  const baseQuery = supabase
    .from("Folder")
    .select("*")
    .eq("ongoing", ongoing)

  const query = type !== "all" ? baseQuery.eq("type", type) : baseQuery

  const { data } = await query
  return data ?? []
}


export const getFolderById = async (folderId: string): Promise<Folder | null> => {
  const { data } = await supabase
    .from("Folder")
    .select("*")
    .eq("folder_id", folderId)
    .single()

  return data || null
}
export const getFolderByType = async (type: string): Promise<Folder | null> => {
  const { data } = await supabase
    .from("Folder")
    .select("*")
    .eq("type", type)
    .single()

  return data || null
}

export const deleteFolderById = async (folderId: string): Promise<boolean> => {
  // Step 0: Get the folder first to check type
  const { data: folder, error: folderError } = await supabase
    .from("Folder")
    .select("type")
    .eq("folder_id", folderId)
    .single()

  if (folderError || !folder) return false

  const folderType = folder.type
  const shouldDeleteFiles = folderType === "tv.garden" || folderType === "radio.garden"

  let filePaths: string[] = []

  if (shouldDeleteFiles) {
    // Step 1: Get logs with status "DOWN"
    const { data: logs, error: logError } = await supabase
      .from("Logs")
      .select("log_id")
      .eq("folder_id", folderId)
      .eq("status", "DOWN")

    if (logError) return false

    filePaths = logs.map(log => `${log.log_id}.png`)
  }

  // Step 2: Delete folder (cascades logs)
  const { error: deleteError } = await supabase
    .from("Folder")
    .delete()
    .eq("folder_id", folderId)

  // Step 3: Delete files if type matched and deletion successful
  if (!deleteError && shouldDeleteFiles && filePaths.length > 0) {
    await supabase.storage.from("screenshots").remove(filePaths)
  }

  return !deleteError
}

export const deleteFolderByType = async (type: string): Promise<boolean> => {
  const { error } = await supabase
    .from("Folder")
    .delete()
    .eq("type", type)

  return !error
}