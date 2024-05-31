import re
import json
from urllib.parse import urlencode

import lxml.html
import httpx
from curl_cffi import requests
from . import user_agents

def get_reviews(url):
  response = requests.get(url, impersonate=user_agents.get_fingerprint())
  response.raise_for_status()
  data_json = response.json()

  review_data = []
  for result in data_json["reviews"]["results"]:
    review_data.append({
      "title": result.get("title") or "",
      "rating": result["Rating"],
      "text": result.get("text") or ""
    })

  return review_data

def convert_url(url, page_num=1, stars=5):
  response = requests.get(url, impersonate=user_agents.get_fingerprint())
  response.raise_for_status()
  key_regex = r'apiKey\\":\\"([0-9a-f]+?)\\"'
  api_key = re.findall(key_regex, response.text)[0]

  id_regex = r'A-(\d+)'
  product_id = re.findall(id_regex, url)[0]

  query_params = urlencode({
    "key": api_key,
    "hasOnlyPhotos": "false",
    "includes": "reviews",
    "page": str(page_num),
    "entity": "",
    "ratingFilter": "rating_" + str(stars),
    "reviewedId": str(product_id),
    "reviewType": "PRODUCT",
    "size": 10,
    "sortBy": "most_recent",
    "verifiedOnly": "false"
  })
  new_url = "https://r2d2.target.com/ggc/v2/summary?" + query_params

  return new_url

if __name__ == "__main__":
  url = "https://www.target.com/p/doritos-nacho-cheese-flavored-tortilla-chips-14-5oz/-/A-13319564"
  new_url = convert_url(url, stars=1)
  print(new_url)
  print(get_reviews(new_url))
