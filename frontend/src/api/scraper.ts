import { backendUrl } from "../config";
import { supabase } from "../config";

export type Log = {
  log_id: string
  folder_id: string
  created_at: string
  url: string
  name: string
  status: string
  timestamp: string
  error: string
}

export const getLogs = async (folderId: string): Promise<Log[]> => {
  let query = supabase.from("Logs").select("*").eq("folder_id", folderId)
  const { data } = await query
  return data || []
}
export type YoutubeChannelLog = {
  log_id: string
  folder_id: string
  created_at: string
  status: string
  timestamp: string
  error: string
  results: {
      url: string,
      title: string
    }[]
}

export const getYoutubeChannelLogs = async (folderId: string): Promise<YoutubeChannelLog[]> => {
  let query = supabase.from("YoutubeChannelLogs").select("*").eq("folder_id", folderId)
  const { data } = await query
  return data || []
}

export async function runScraper (url: string, folderId: string, type: string, repetition: number, interval: number, startTime: string) {
  try {
    const res = await fetch(`${backendUrl}/api/runScraper`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url, folder_id: folderId, type, repetition, interval, start_time: startTime})
    });

    const data = await res.json();
    console.log("Scraper started:", data);
    return data;
  } catch (error) {
    console.error("Error starting scraper:", error);
    throw error;
  }
}

export async function stopScraper (folderId: string) {
  try {
    const res = await fetch(`${backendUrl}/api/stopScraper`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ folder_id: folderId })
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error starting scraper:", error);
    throw error;
  }
}

export type CustomSourceLogs = {
  log_id: number
  created_at: string
  status: string
  timestamp: string
  error: string
  type: string
}

export const getCustomLogs = async (type: string): Promise<CustomSourceLogs[]> => {
  let query = supabase.from("CustomSourceLogs").select("*").eq("type", type)
  const { data } = await query
  return data || []
}

export const deleteCustomLogsByType = async (type: string): Promise<void> => {
  const { error } = await supabase
    .from("CustomSourceLogs")
    .delete()
    .eq("type", type)

  if (error) {
    console.error("Failed to delete logs:", error)
  } else {
    console.log(`All logs with type '${type}' deleted.`)
  }
}


export const getNextCall = async (folderId: string): Promise<string | null> => {
  const res = await fetch(`${backendUrl}/api/nextCall?folder_id=${folderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();
  return data.next_call || null;
};
