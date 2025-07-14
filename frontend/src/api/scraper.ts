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

export async function runScraper (url: string, folderId: string, type: string, repetition: number, interval: number, startTime: string) {
  try {
    console.log(interval)
    const res = await fetch(`${backendUrl}/api/runScraper/tv.garden`, {
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