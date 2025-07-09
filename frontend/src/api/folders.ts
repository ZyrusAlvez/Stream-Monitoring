import { supabase } from "../config"

export type Folder = {
  folder_id: string
  created_at: string
  url: string
  name: string
  type: string
  ongoing: boolean
}

export const fetchFolders = async (type: string, ongoing: boolean): Promise<Folder[]> => {
  let query = supabase.from("Folder").select("*").eq("ongoing", ongoing)
  if (type !== "all") query = query.eq("type", type)
  const { data } = await query
  return data || []
}
