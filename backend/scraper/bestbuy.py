import httpx
import lxml.html

from . import user_agents

def convert_url(url, page_num = 1, stars = 5):
  url = url.replace("bestbuy.com/site", "bestbuy.com/site/reviews")
  url = url.replace(".p", "")
  url += "&rating=" + str(stars) + "&page=" + str(page_num)
  return url

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
  review_divs = document.cssselect('li[class="review-item"]')
  review_data = []
  
  for review_div in review_divs:
    title_h4 = review_div.cssselect('h4.review-title')[0]
    title_text = title_h4.text_content().strip()
    
    stars_p = review_div.cssselect('p.visually-hidden')[0]
    stars_rating = float(stars_p.text_content().strip().split()[1])
    body_div = review_div.cssselect('div.ugc-review-body')[0]
    body_text = body_div.text_content().strip()

    review_data.append({
      "title": title_text,
      "rating": stars_rating,
      "text": body_text
    })

  return review_data

if __name__ == "__main__":
  url = "https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-3060-12gb-gddr6-pci-express-4-0-graphics-card-black/6468931.p?skuId=6468931"
  url = convert_url(url)
#  print(url)
  print(get_reviews(url))
