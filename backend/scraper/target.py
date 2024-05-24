import requests

def get_page_source(url):
  try:
    response = requests.get(url)
    response.raise_for_status()  # Check if the request was successful
    return response.text
  except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
    return None

def get_reviews(url):
  delim = "\\\"text\\\":\\\""
  source_code = get_page_source(url)
  if source_code is None:
    return []

  source_code_parts = source_code.split(delim)
  reviews = []

  for part in source_code_parts[1:]:
    try:
      # Extract review text
      review_text = part.split('\\\",')[0]
      
      # Extract title
      title_part = part.split('title\\\":\\\"')
      title = title_part[1].split("\\\"")[0]
      
      # Extract rating
      rating_part = part.split('value\\\":')
      rating = rating_part[1][0]

      reviews.append({
        "title": title,
        "rating": rating,
        "text": review_text
      })
    except (IndexError, ValueError) as e:
      print(f"An error occurred while parsing review: {e}")
      continue

  return reviews

if __name__ == "__main__":
  url = "https://www.target.com/p/steakhouse-seasoned-beef-patties-frozen-3lbs-good-38-gather-8482/-/A-16781984#lnk=sametab"
  reviews = extract_reviews(url)
  for review in reviews:
    print(review)
