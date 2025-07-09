import { backendUrl } from "../config";

export async function submitUrl(url: string, type: string){
	try {
		const res = await fetch(`${backendUrl}/folder`, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url, type }),
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
