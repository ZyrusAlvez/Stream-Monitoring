from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Setup Chrome
options = webdriver.ChromeOptions()
driver = webdriver.Chrome(options=options)

driver.get("https://www.kiss92.sg/shows/")

# Click the play button
play_button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, 'img[src*="player_01_play.svg"]'))
)
play_button.click()

# Wait until the #nowplaying element has class 'nowplaying running'
try:
    WebDriverWait(driver, 30).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '#nowplaying.running'))
    )
    print("Playback started: #nowplaying has 'running' class.")
except:
    print("Timeout: #nowplaying did not become 'running'.")

driver.quit()