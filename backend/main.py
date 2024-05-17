from llama_index.core import VectorStoreIndex, Document, Settings
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.ollama import Ollama

from flask import Flask, request, make_response

app = Flask(__name__)

def generate(documents):
  print("creating documents")
  documents = [Document(text=text) for text in ["hello world"]]
  index = VectorStoreIndex.from_documents(documents)

  print("running query")
  query_engine = index.as_query_engine()
  response = query_engine.query("test")
  return str(response) #note: possible to get sources used from the response object

@app.route("/")
def index():
  return "<p>the server is running</p>"

@app.route("/api/generate", methods=["POST"])
def api_generate():
  content = request.json
  llm_response = generate(content)
  response = make_response(llm_response, 200)
  response.mimetype = "text/plain"
  return response

if __name__ == "__main__":
  Settings.embed_model = OllamaEmbedding(model_name="nomic-embed-text")
  Settings.llm = Ollama(model="llama3:8b", request_timeout=360.0)
  app.run(host= '0.0.0.0', debug=True)