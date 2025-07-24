from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def melisten_scrapper(url):
    print("Checking audio status")

    # Setup Chrome
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)

    try:
        try:
            driver.get(url)
        except:
            return "Website not reachable"

        # Wait for the Play button to appear and click it
        play_button = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.play-button-blue'))
        )
        play_button.click()
    except:
        driver.quit()
        return "Element not found or too long to load"

    # Wait for the button's title to change to "Pause"
    try:
        WebDriverWait(driver, 10).until(
            lambda d: d.find_element(By.CSS_SELECTOR, 'button.play-button-blue').get_attribute("title").lower() == "pause"
        )
        driver.quit()
        return "UP"
    except:
        driver.quit()
        return "DOWN"
    

def extract_melisten_name(url):
    print("Extracting station name")

    # Setup Chrome
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # Remove if you want to see the browser
    driver = webdriver.Chrome(options=options)

    try:
        driver.get(url)

        # Wait for the <h1> tag with station name to appear
        station_name = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.top-header-page-left h1"))
        ).text

        driver.quit()
        return station_name
    except:
        driver.quit()
        return "Station name not found"

