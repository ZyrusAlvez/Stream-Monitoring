from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

# Setup Chrome
options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(options=options)

link = "https://abcnews.go.com/Live"
driver.get(link)

# Wait up to 15 seconds for the video tag to load
try:
    WebDriverWait(driver, 30).until(
        EC.presence_of_element_located((By.TAG_NAME, "video"))
    )
except:
    print("Video tag not found in time.")

# Get updated HTML
html = driver.page_source
soup = BeautifulSoup(html, "html.parser")

# Save HTML to file
with open("./page.html", "w", encoding="utf-8") as f:
    f.write(soup.prettify())

driver.quit()