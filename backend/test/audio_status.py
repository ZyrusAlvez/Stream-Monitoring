import requests

def check_stream_status(url: str) -> bool:
    print("checking now", url)
    try:

        response = requests.get(url, stream=True, timeout=10)
        print(response)
        if 200 <= response.status_code < 400:
            return "UP"
        return "DOWN"
    except requests.exceptions.RequestException:
        return "DOWN"
    
print(check_stream_status("https:\u002F\u002Fplayerservices.streamtheworld.com\u002Fapi\u002Flivestream-redirect\u002FGOLD905_PREM.aac"))