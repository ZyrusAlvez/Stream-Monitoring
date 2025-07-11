from playwright.sync_api import sync_playwright
import time
import requests

station_url = "https://radio.garden/listen/bandit-rock/Tk0sD8cv#google_vignette"

def extract_stream_url():
    with sync_playwright() as p:
        # Launch browser with headless mode and other options
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-gpu",
                "--disable-dev-shm-usage"
            ]
        )
        
        # Create a new page
        page = browser.new_page()
        
        try:
            print(f"Opening: {station_url}")
            
            # Navigate to the URL
            page.goto(station_url)
            
            # Inject JavaScript to intercept audio element's src assignment
            page.evaluate("""
                const OriginalAudio = window.Audio;
                window.Audio = function(...args) {
                    const audio = new OriginalAudio(...args);
                    const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
                    Object.defineProperty(audio, 'src', {
                        get() { return desc.get.call(audio); },
                        set(val) {
                            window.lastStreamURL = val;
                            desc.set.call(audio, val);
                        }
                    });
                    return audio;
                };
            """)
            
            # Wait for the play button to be clickable and click it
            play_button = page.locator("div[role='button'][aria-label='Start Radio Garden']")
            play_button.wait_for(state="visible", timeout=15000)
            play_button.click()
            print("Clicked play button... waiting for stream URL")
            
            # Wait for the stream URL to be captured
            time.sleep(8)
            
            # Extract the stream URL
            stream_url = page.evaluate("window.lastStreamURL || null")
            
            if stream_url:
                print(f"\n🎧 Stream URL:\n{stream_url}")
                return stream_url
            else:
                print("Stream URL not found.")
                return None
                
        finally:
            browser.close()

# Extract the stream URL
stream_url = extract_stream_url()

# Test the stream URL
if stream_url:
    try:
        print(f"Testing stream URL: {stream_url}")
        response = requests.get(stream_url, stream=True, timeout=10)
        print(f"Response status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Server is UP.")
        else:
            print(f"❌ Server is DOWN")
    except requests.exceptions.RequestException as e:
        print(f"❌ Server is DOWN. Error accessing the stream URL: {e}")
else:
    print("No stream URL to test.")