from llama_index.core import VectorStoreIndex, Document, Settings
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.ollama import Ollama

print("setting model")
Settings.embed_model = OllamaEmbedding(model_name="nomic-embed-text")
Settings.llm = Ollama(model="llama3:8b", request_timeout=360.0)

print("creating documents")
documents = [Document(text=text) for text in ["hello world"]]
index = VectorStoreIndex.from_documents(documents)

print("running query")
query_engine = index.as_query_engine()
response = query_engine.query("test")
print(response)
