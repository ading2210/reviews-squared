from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

def get_reviews(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")
    reviews = soup.find_all("div", class_="review")

    reviews_data = []
    for review in reviews:
        title = review.find("div", class_="review-title").text.strip() if review.find("div", class_="review-title") else "No title"
        rating = review.find("span", class_="seo-avg-rating").text.strip() if review.find("span", class_="seo-avg-rating") else "No rating"
        text = review.find("div", class_="review-text").text.strip() if review.find("div", class_="review-text") else "No review text"
        reviews_data.append({"title": title, "rating": rating, "text": text})

    return reviews_data

@app.route('/reviews', methods=['POST'])
def reviews():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    try:
        reviews_data = get_reviews(url)
        return jsonify({'reviews': reviews_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
