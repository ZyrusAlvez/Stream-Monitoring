
export async function submitUrl(url: string, type: string){
	try{
		const res = await fetch("http://localhost:8000/folder", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({url, type}),
    })

    const data = await res.json()
		console.log("Response from server:", data)
    return data
	}catch(error){
		console.error("Error submitting URL:", error);
    throw error;
	}
}
