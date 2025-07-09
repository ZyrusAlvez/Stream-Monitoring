import { backendUrl } from "../config";
import { supabase } from "../config";

export type Log = {
  folder_id: string
  created_at: string
  url: string
  name: string
  status: string
}

export const getLogs = async (folderId: string): Promise<Log[]> => {
  let query = supabase.from("Logs").select("*").eq("folder_id", folderId)
  const { data } = await query
  return data || []
}

export async function runTvGardenScraper(url: string, folderId?: string) {
  try {
    const res = await fetch(`${backendUrl}/start-scraper/tv.garden`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url, folder_id: folderId })
    });

    const data = await res.json();
    console.log("Scraper started:", data);
    return data;
  } catch (error) {
    console.error("Error starting scraper:", error);
    throw error;
  }
}

