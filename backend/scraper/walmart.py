import json
import random
import re

import lxml.html
from curl_cffi import requests

fingerprints = [
  "chrome99",
  "chrome100",
  "chrome101",
  "chrome104",
  "chrome107",
  "chrome110",
  "chrome116",
  "chrome119",
  "chrome120",
  "chrome99_android",
  "edge99",
  "edge101",
  "safari15_3",
  "safari15_5",
  "safari17_0",
  "safari17_2_ios"
]

def get_reviews(url):
  global fingerprints
  fingerprint = random.choice(fingerprints)
  response = requests.get(url, impersonate=fingerprint)
  response.raise_for_status()

  document = lxml.html.fromstring(response.content)
  data_script = document.cssselect("#__NEXT_DATA__")[0]
  data_str = data_script.text_content().strip()
  data = json.loads(data_str)
  review_entries = data["props"]["pageProps"]["initialData"]["data"]["reviews"]["customerReviews"]

  review_data = []
  for review in review_entries:
    review_data.append({
      "title": review["reviewTitle"] or "",
      "rating": review["rating"],
      "text": review["reviewText"]
    })
  
  return review_data

def convert_url(url, page_num=1, stars=5):
  id_regex = r'/\d{10,}'
  product_id = re.findall(id_regex, url)[0]
  new_url = f"https://www.walmart.com/reviews/product/{product_id}?filter={stars}&page={page_num}"
  return new_url

if __name__ == "__main__":
  url = "https://www.walmart.com/ip/2022-Apple-10-9-inch-iPad-Wi-Fi-64GB-Blue-10th-Generation/1485722187"
  new_url = convert_url(url)
  print(new_url)
  print(get_reviews(new_url))