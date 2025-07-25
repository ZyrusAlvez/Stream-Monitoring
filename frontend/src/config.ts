import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const backendUrl = import.meta.env.VITE_BACKEND_URL;