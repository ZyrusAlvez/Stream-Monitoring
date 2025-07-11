import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import requests

station_url = "https://radio.garden/listen/bandit-rock/Tk0sD8cv#google_vignette"

options = uc.ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-gpu")
options.add_argument("--disable-dev-shm-usage")

driver = uc.Chrome(options=options)

try:
    print(f"Opening: {station_url}")
    driver.get(station_url)

    # Intercept audio element's src assignment
    driver.execute_script("""
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

    # Adjust the number according to preferred waiting time
    WebDriverWait(driver, 15).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "div[role='button'][aria-label='Start Radio Garden']"))
    ).click()
    print("Clicked play button... waiting for stream URL")

    time.sleep(8)
    stream_url = driver.execute_script("return window.lastStreamURL || null;")

    if stream_url:
        print(f"\n🎧 Stream URL:\n{stream_url}")
    else:
        print("Stream URL not found.")

finally:
    driver.quit()


try:
    print(stream_url)
    response = requests.get(stream_url, stream=True, timeout=10)
    print(response)
    if response.status_code == 200:
        print("✅ Server is UP.")
    else:
        print(f"❌ Server is DOWN")

except requests.exceptions.RequestException as e:
    print("❌ Server is DOWN. Error accessing the stream URL:")