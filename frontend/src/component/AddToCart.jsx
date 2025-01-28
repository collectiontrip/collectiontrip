import React, { useState } from 'react';
import axios from 'axios';

const AddToCart = ({ productId, quantity = 1, onAddSuccess }) => {
  const handleAddToCart = async () => {
    try {
      let cartId = localStorage.getItem('cartId');

      if (!cartId) {
        const createCartResponse = await axios.post('http://127.0.0.1:8000/store/carts/', {});
        cartId = createCartResponse.data.id;
        localStorage.setItem('cartId', cartId);
      }

      const cartItemsResponse = await axios.get(`http://127.0.0.1:8000/store/carts/${cartId}/items/`);
      const items = cartItemsResponse.data;

      const existingItem = items.find((item) => item.product_id === productId);

      if (existingItem) {
        await axios.patch(
          `http://127.0.0.1:8000/store/carts/${cartId}/items/${existingItem.id}/`,
          { quantity: existingItem.quantity + quantity }
        );
        onAddSuccess('Product quantity increased in the cart.');
      } else {
        await axios.post(`http://127.0.0.1:8000/store/carts/${cartId}/items/`, {
          product_id: productId,
          quantity,
        });
        onAddSuccess('Product added to the cart.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default AddToCart;
