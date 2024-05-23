import pathlib
import random

scraper_dir = pathlib.Path(__file__).resolve().parent
ua_path = scraper_dir / "useragent.txt"
user_agents = ua_path.read_text().split("\n")

def get_random():
  return random.choice(user_agents)