from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def kiss92_scrapper(url):
    print("kiss92 running")
    # Setup Chrome in headless mode
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)
    try:
        driver.get(url)

        # Click the play button
        play_button = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'img[src*="player_01_play.svg"]'))
        )
        play_button.click()
    except:
        driver.quit()
        return "Element not found"

    # Wait until the #nowplaying element has class 'nowplaying running'
    try:
        WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '#nowplaying.running'))
        )
        driver.quit()
        return "UP"
    except:
        driver.quit()
        return "DOWN"