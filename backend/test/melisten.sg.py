from playwright.sync_api import sync_playwright, TimeoutError

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # Set to True to hide browser window
    page = browser.new_page()
    page.goto("https://www.melisten.sg/radio/gold-905")

    try:
        # Wait for and click the play/pause button
        page.wait_for_selector(".button-playpause button", timeout=5000)
        page.click(".button-playpause button")
        print("Button clicked successfully.")
    except TimeoutError:
        print("Button not found or could not be clicked.")
        browser.close()
        exit()

    try:
        # Wait for the audio source element
        page.wait_for_selector("audio#tdplayer_od_audionode source", timeout=10000)
        audio_src = page.locator("audio#tdplayer_od_audionode source").get_attribute("src")
        print(f"Audio source URL: {audio_src}")
    except TimeoutError:
        print("Audio source not found.")
    
    browser.close()
