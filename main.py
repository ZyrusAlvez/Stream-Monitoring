from selenium_handler import setup_driver, play_and_check

if __name__ == "__main__":
    url = "https://tv.garden/ph/k1le9DNzsDpeDQ"
    driver = setup_driver()
    play_and_check(driver, url)
