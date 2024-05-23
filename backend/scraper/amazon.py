import httpx
import pathlib
import random
import lxml.html

scraper_dir = pathlib.Path(__file__).resolve().parent
ua_path = scraper_dir / "useragent.txt"
user_agents = ua_path.read_text().split("\n")

def get_reviews(url):
  headers = {
    "User-Agent": random.choice(user_agents),
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

if __name__ == "__main__":
  url = "https://www.amazon.com/ASUS-Gaming-GeForce-Graphics-DisplayPort/product-reviews/B0C7JYX6LN"
  print(get_reviews(url))