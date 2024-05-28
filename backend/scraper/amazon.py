import httpx
import pathlib
import random
import re
import lxml.html
from . import user_agents # added the dot bc it wasn't running otherewise

def get_reviews(url):
  headers = {
    "User-Agent": user_agents.get_random(),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
  }

  response = httpx.get(url, headers=headers)
  document = lxml.html.fromstring(response.content)
  review_divs = document.cssselect('div[id^="customer_review-"]')
  review_data = []
  
  for review_div in review_divs:
    #since our user agent is random, sometimes we get the mobile version of the page
    title_spans = review_div.cssselect('span[data-hook="review-title"]')
    title_links = review_div.cssselect('a[data-hook="review-title"]')
    if title_spans:
      title_text = title_spans[0].text_content().strip()
    else:
      title_text = title_links[0].text_content().strip().split("\n")[-1].strip()
    
    stars_span = review_div.cssselect('span.a-icon-alt')[0]
    stars_rating = float(stars_span.text_content().strip().split()[0])
    body_span = review_div.cssselect('span[data-hook="review-body"]')[-1]
    body_text = body_span.text_content().strip()

    review_data.append({
      "title": title_text,
      "rating": stars_rating,
      "text": body_text
    })

  return review_data

def convert_url(url, page_num=1, stars=5):
  star_dict = {
    1: "one_star",
    2: "two_star",
    3: "three_star",
    4: "four_star",
    5: "five_star"
  }
  star_str = star_dict[stars]
  id_regex = r'B[A-Z0-9]+'
  product_id = re.findall(id_regex, url)[0]
  new_url = f"https://www.amazon.com/product-reviews/{product_id}/?ie=UTF8&reviewerType=all_reviews&pageNumber={page_num}&filterByStar={star_str}"
  return new_url

if __name__ == "__main__":
  url = "https://www.amazon.com/ASUS-Gaming-GeForce-Graphics-DisplayPort/product-reviews/B0C7JYX6LN"
  new_url = convert_url(url, stars=1)
  print(get_reviews(new_url))
