export async function tvGardenScraper(url: string) {
  try {
    const res = await fetch("http://localhost:8000/start-scraper/tv.garden", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    console.log("Scraper started:", data);
    return data;
  } catch (error) {
    console.error("Error starting scraper:", error);
    throw error;
  }
}
