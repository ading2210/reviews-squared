from urllib.parse import urlparse
import traceback
import threading

from llama_index.core import VectorStoreIndex, Document, Settings
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.ollama import Ollama

from flask import Flask, request, make_response, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.middleware.proxy_fix import ProxyFix
app = Flask(__name__)
cors = CORS(app)

import scraper.amazon
import scraper.bestbuy
import scraper.target
import scraper.walmart

Settings.embed_model = OllamaEmbedding(model_name="nomic-embed-text")
Settings.llm = Ollama(model="phi3:3.8b-mini-4k-instruct-q5_K_M", request_timeout=360.0)
app = Flask(__name__)

def generate(queries, reviews):
  print("creating documents")
  documents = []
  for review in reviews:
    text = review.pop("text")
    documents.append(Document(text=text, metadata=review))
  index = VectorStoreIndex.from_documents(documents) # p sure the problem is here - Anwar =)

  print("running query")
  query_engine = index.as_query_engine()
  responses = [None] * len(queries)
  threads = []
  def thread_runner(index, query):
    responses[index] = str(query_engine.query(query)).strip()
    print(responses[index])
  for i, query in enumerate(queries):
    t = threading.Thread(target=thread_runner, args=(i, query), daemon=True)
    t.start()
    threads.append(t)
  for t in threads:
    t.join()

  return responses #note: possible to get sources used from the response object

def handle_error(error):
  output = "".join(traceback.format_exception(error))
  print(output)
  response = make_response(output, 500)
  response.mimetype = "text/plain"
  return response

@app.route("/")
def index():
  return "<p>the server is running</p>"

@app.route("/api/generate", methods=["POST"])
@cross_origin(origins=["*"])
def api_generate():
  try:
    content = request.json
    llm_response = generate(content["query"], content["documents"])
    return jsonify(llm_response), 200
  except Exception as e:
    return handle_error(e)

@app.route("/api/reviews", methods=["POST"])
@cross_origin(origins=["*"])
def reviews():
  try:
    data = request.get_json()
    url = data.get("url")
    page = int(data.get("page") or 1)
    stars = int(data.get("stars") or 5)

    if not url:
      return jsonify({"error": "URL is required"}), 400

    sites = {
      "www.amazon.com": scraper.amazon,
      "www.bestbuy.com": scraper.bestbuy,
      "www.target.com": scraper.target,
      "www.walmart.com": scraper.walmart
    }
    domain = urlparse(url).netloc
    site = sites[domain]

    output = ""
    for i in range(0, 3):
      try:
        new_url = site.convert_url(url, page_num=page, stars=stars)
        output = site.get_reviews(new_url)
        return jsonify(output)
      except Exception as e:
        print("".join(traceback.format_exception(e)))
        print(f"retrying review fetch ({i})")
        
    return jsonify([])

  except Exception as e:
    return handle_error(e)

if __name__ == "__main__":  
  print("starting flask")
  app.run(host= "0.0.0.0", debug=True, threaded=True)