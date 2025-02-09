from locust import HttpUser, task, between
from random import randint
import requests


class WebsiteUser(HttpUser):
    wait_time = between(1, 5)

    @task(2)
    def view_products(self):
        print('View products')
        collection_id = randint(1, 23)
        self.client.get(
            f'/store/products/?collection_id={collection_id}',
            name='/store/products'
        )

    @task(4)
    def view_product(self):
        print('View product details')
        product_id = randint(1, 35)
        self.client.get(
            f'/store/products/{product_id}/',
            name='/store/products/:id/'
        )

    @task(1)
    def add_to_cart(self):
        print('Add to cart')
        product_id = randint(1, 10)
        
        if not hasattr(self, "cart_id"):
            print("Error: cart_id is not set, skipping add_to_cart task.")
            return
        
        self.client.post(
            f'/store/carts/{self.cart_id}/items/',
            name='/store/carts/items/',
            json={'product_id': product_id, 'quantity': 1}
        )

    def on_start(self):
        response = self.client.post('/store/carts/')
        
        # Check for request failure
        if response.status_code != 201:  # Expecting HTTP 201 Created
            print(f"Failed to create cart. Status: {response.status_code}, Response: {response.text}")
            return

        # Ensure response is not empty
        if not response.text.strip():
            print("Error: Received empty response when creating cart.")
            return

        # Attempt to parse JSON response
        try:
            result = response.json()
            self.cart_id = result.get('id')  # Use .get() to avoid KeyError
            if not self.cart_id:
                print("Error: 'id' not found in response JSON")
        except requests.exceptions.JSONDecodeError:
            print(f"Error: Failed to parse JSON. Response: {response.text}")
