import pathlib
import random

scraper_dir = pathlib.Path(__file__).resolve().parent
ua_path = scraper_dir / "useragent.txt"
user_agents = ua_path.read_text().split("\n")

fingerprints = [
  "chrome99",
  "chrome100",
  "chrome101",
  "chrome104",
  "chrome107",
  "chrome110",
  "chrome116",
  "chrome119",
  "chrome120",
  "chrome99_android",
  "edge99",
  "edge101",
  "safari15_3",
  "safari15_5",
  "safari17_0",
  "safari17_2_ios"
]

def get_random():
  return random.choice(user_agents)

def get_fingerprint():
  return random.choice(fingerprints)