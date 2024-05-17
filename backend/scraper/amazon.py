from curl_cffi import requests
from bs4 import BeautifulSoup

def get_reviews(url):
  headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  }

  response = requests.get(url, headers=headers, impersonate="chrome120")
  soup = BeautifulSoup(response.content, "html.parser")
  reviews = soup.find_all("div", class_="review")

  reviews_data = []
  for review in reviews:
    title = review.find("div", class_="review-title").text.strip() if review.find("div", class_="review-title") else "No title"
    rating = review.find("span", class_="seo-avg-rating").text.strip() if review.find("span", class_="seo-avg-rating") else "No rating"
    text = review.find("div", class_="review-text").text.strip() if review.find("div", class_="review-text") else "No review text"
    reviews_data.append({"title": title, "rating": rating, "text": text})
    #print(review, end="\n\n======\n\n")

  return reviews_data