import streamlit as st
from supabase import create_client, Client
import pandas as pd
from datetime import datetime

# === Supabase Config ===
url = "https://djwgvbognbimlftgvwxf.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqd2d2Ym9nbmJpbWxmdGd2d3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODE2MDYsImV4cCI6MjA2NzQ1NzYwNn0.dNzQsL7SvwNfB5DtKhex_1nLzXKMxToGeuretoc_3jY"
supabase: Client = create_client(url, key)

# === Helper to convert timestamp ===
def parse_timestamp(ts):
    try:
        return datetime.strptime(ts, "%Y-%m-%d %I:%M:%S %p")
    except:
        return pd.NaT

# === Query Supabase ===
def fetch_grouped_iptv():
    response = supabase.table("iptv-testing").select("*").execute()
    data = response.data
    df = pd.DataFrame(data)

    if df.empty or "url" not in df.columns:
        return {}

    df["parsed_time"] = df["timestamp"].apply(parse_timestamp)
    df = df.sort_values(by="parsed_time", ascending=True)

    grouped = {}
    for url, group_df in df.groupby("url"):
        name = group_df["name"].iloc[0] if "name" in group_df.columns else "Unknown"
        grouped[url] = {
            "name": name,
            "table": group_df[["timestamp", "status"]].reset_index(drop=True)
        }

    return grouped

# === UI ===
st.header("IPTV Monitoring Report")

grouped_data = fetch_grouped_iptv()

if not grouped_data:
    st.warning("No data found in 'iptv-testing' table.")
else:
    for url, data in grouped_data.items():
        name = data["name"]
        table = data["table"]
        st.caption(url)

        table.index += 1
        st.dataframe(table, use_container_width=True)

        st.markdown("---")
