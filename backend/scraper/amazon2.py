import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_reviews_from_page(url):
    options = uc.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    driver = uc.Chrome(options=options)
    driver.get(url)

    reviews = []

    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'review-text-content'))
        )
        review_elements = driver.find_elements(By.CLASS_NAME, 'review-text-content')

        for element in review_elements:
            review_text = element.text
            reviews.append(review_text)

    except Exception as e:
        print(f"An error occurred: {e}")

    driver.quit()

    return reviews

def get_asin(url):
    url_parts = url.replace('?', '/').split('/')
    for part in url_parts:
        if len(part) == 10 and part.startswith('B') and part.isupper():
            return part
    return ""
if __name__ == "__main__":
  url = "https://www.amazon.com/ASUS-Gaming-GeForce-Graphics-DisplayPort/product-reviews/B0C7JYX6LN"
  print(get_reviews(url))
