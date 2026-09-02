import requests

API_URL = "http://127.0.0.1:5000/api/products/"

def create_product(payload):

    USER_URL = f"{API_URL}add/"

    response = requests.post(USER_URL, json=payload);
    r_json = response.json()
    print(r_json)


payload = {
    "title":"shoe",
    "description":"Air Force 1 sneaker, red on black",
    "price":10000,
    "category":1,
    "stockQTY":2,
    "type":"product"
  }


import requests

BASE_URL = "http://localhost:5000/api/products"


def search_products(query):
    response = requests.get(
        f"{BASE_URL}/search",
        params={"q": query}
    )
    print(response.json())
    response.raise_for_status()
  
    return response.json()


query = input("Search for a product: ")

results = search_products(query)

print(results)

