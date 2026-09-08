import requests

class ProductTests:
    def __init__(self):
        self.API_URL = "http://localhost:5000/api/products"

    def get_all(self):
        response = requests.get(f"{self.API_URL}/all/")

        print(response.json())

    def get_one(self, id):
        params ={
            "id":id
        }
        response = requests.get(f"{self.API_URL}/", params=params)

        print(response.json())



class CartTests:
    def __init__(self):
        self.API_URL = "http://localhost:5000/api/cart"

    def get_cart(self):

        response = requests.get(f"{self.API_URL}/")

        print(response.json())

    def update_item(self, id, quantity):

        params={
            "itemId":id
        }
        body={
            "quantity":quantity
        }

        response = requests.patch(f"{self.API_URL}/items/{id}", json=body)

        print(response.json())

    def remove_cart(self):

        response = requests.delete(f"{self.API_URL}/")

        print(response.json())


    def remove_from_cart(self, id):

        response = requests.delete(f"{self.API_URL}/items/{id}")

        print(response.json())


    def add_to_cart(self):
        payload ={
            "productId":36,
            "quantity":1
        }

        response = requests.post(f"{self.API_URL}/items", json=payload)

        print(response.json())


products = ProductTests()
#products.get_all()

cart = CartTests()
#cart.get_cart()
#cart.update_item(1, 1)
#cart.remove_from_cart(1)
#cart.remove_cart()




