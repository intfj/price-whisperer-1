import requests
from bs4 import BeautifulSoup
import re

SCRAPER_API_KEY = "a6f4d7c931a7becc207fa51a18b0596c"  # Your actual key
SCRAPER_API_URL = "http://api.scraperapi.com"

headers = {
    "User-Agent": "Mozilla/5.0"
}

def get_scraperapi_url(target_url):
    return f"{SCRAPER_API_URL}?api_key={SCRAPER_API_KEY}&url={target_url}"

def extract_price(text):
    price_match = re.search(r"\$\s?\d+(?:[\.,]\d+)?", text)
    return price_match.group(0) if price_match else None

def fetch_amazon(product_name):
    url = f"https://www.amazon.com/s?k={product_name.replace(' ', '+')}"
    response = requests.get(get_scraperapi_url(url), headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    prices = []
    for span in soup.select("span.a-price > span.a-offscreen"):
        price = extract_price(span.get_text())
        if price:
            prices.append(price)
    return {"site": "Amazon", "prices": prices[:5]}

def fetch_ebay(product_name):
    url = f"https://www.ebay.com/sch/i.html?_nkw={product_name.replace(' ', '+')}"
    response = requests.get(get_scraperapi_url(url), headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    prices = []
    for span in soup.select("span.s-item__price"):
        price = extract_price(span.get_text())
        if price:
            prices.append(price)
    return {"site": "eBay", "prices": prices[:5]}

def fetch_walmart(product_name):
    url = f"https://www.walmart.com/search?q={product_name.replace(' ', '+')}"
    response = requests.get(get_scraperapi_url(url), headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    prices = []
    for div in soup.select("div[class*=price] span[aria-hidden='true']"):
        price = extract_price(div.get_text())
        if price:
            prices.append(price)
    return {"site": "Walmart", "prices": prices[:5]}

def fetch_etsy(product_name):
    url = f"https://www.etsy.com/search?q={product_name.replace(' ', '+')}"
    response = requests.get(get_scraperapi_url(url), headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    prices = []
    for span in soup.select("span.currency-value"):
        price = extract_price("$" + span.get_text())
        if price:
            prices.append(price)
    return {"site": "Etsy", "prices": prices[:5]}

def fetch_all_marketplace_data(product_name, product_url=None):
    data = []
    try:
        data.append(fetch_amazon(product_name))
    except Exception as e:
        data.append({"site": "Amazon", "error": str(e)})

    try:
        data.append(fetch_ebay(product_name))
    except Exception as e:
        data.append({"site": "eBay", "error": str(e)})

    try:
        data.append(fetch_walmart(product_name))
    except Exception as e:
        data.append({"site": "Walmart", "error": str(e)})

    try:
        data.append(fetch_etsy(product_name))
    except Exception as e:
        data.append({"site": "Etsy", "error": str(e)})

    return data
