import React from 'react';
import axios from 'axios';
import './AddToCart.css'; // Ensure the CSS file is being imported

const AddToCart = ({ productId, onAddSuccess, onError, buttonText = "Add to Cart" }) => {
  const handleAddToCart = async () => {
    try {
      let cartId = localStorage.getItem("cartId");

      if (!cartId) {
        console.log("No cart found, creating a new one...");
        const createCartResponse = await axios.post("http://127.0.0.1:8000/store/carts/", {});
        cartId = createCartResponse.data.id;
        localStorage.setItem("cartId", cartId);
      }

      console.log("Fetching cart items...");
      const cartItemsResponse = await axios.get(`http://127.0.0.1:8000/store/carts/${cartId}/items/`);
      const items = cartItemsResponse.data;

      const existingItem = items.find((item) => item.product_id === productId);

      if (existingItem) {
        console.log("Item exists in cart, updating quantity...");
        await axios.patch(
          `http://127.0.0.1:8000/store/carts/${cartId}/items/${existingItem.id}/`,
          { quantity: existingItem.quantity + 1 }
        );
      } else {
        console.log("Item not in cart, adding to cart...");
        await axios.post(`http://127.0.0.1:8000/store/carts/${cartId}/items/`, {
          product_id: productId,
          quantity: 1,
        });
      }

      if (onAddSuccess) onAddSuccess();
      alert("Item added to cart successfully.");
    } catch (error) {
      console.error(error);
      if (onError) onError(error);
      alert("Failed to add item to cart.");
    }
  };

  return (
    <button onClick={handleAddToCart} className="add-to-cart">
      {buttonText}
    </button>
  );
};

export default AddToCart;