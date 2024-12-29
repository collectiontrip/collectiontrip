import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartId = localStorage.getItem("cartId");
        if (cartId) {
          const response = await axios.get(`http://127.0.0.1:8000/store/carts/${cartId}/`);
          setCart(response.data);
        } else {
          console.log("Cart ID not found.");
        }
      } catch (error) {
        console.error("Failed to fetch cart data", error);
      }
    };

    fetchCart();
  }, []);

  if (!cart) {
    return <div className="cart-loading">Loading cart...</div>;
  }

  const handleCheckout = () => {
    const cartId = localStorage.getItem("cartId");
    if (cartId) {
      navigate(`/checkout/${cartId}`);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    const updatedCart = { ...cart };
    const itemIndex = updatedCart.items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      const item = updatedCart.items[itemIndex];
      item.quantity = quantity;
      item.total_price = item.product.price * quantity;

      updatedCart.total_price = updatedCart.items.reduce((total, item) => total + item.total_price, 0);
      setCart(updatedCart);
    }

    try {
      const cartId = localStorage.getItem("cartId");
      if (cartId) {
        await axios.put(`http://127.0.0.1:8000/store/carts/${cartId}/items/${itemId}/`, { quantity });
      }
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const removeItem = async (itemId) => {
    const updatedCart = { ...cart };
    const newItems = updatedCart.items.filter(item => item.id !== itemId);
    updatedCart.items = newItems;
    updatedCart.total_price = newItems.reduce((total, item) => total + item.total_price, 0);

    setCart(updatedCart);

    try {
      const cartId = localStorage.getItem("cartId");
      if (cartId) {
        await axios.delete(`http://127.0.0.1:8000/store/carts/${cartId}/items/${itemId}/`);
      }
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-items">
        {cart.items.length === 0 ? (
          <p className="cart-empty-message">Your cart is empty</p>
        ) : (
          cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image-container">
                <img src={item.product.images[0].image} alt={item.product.title} className="cart-item-img" />
              </div>
              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.product.title}</h3>
                <p className="cart-item-description">{item.product.description}</p>
                <p className="cart-item-price">Price: ${item.product.price}</p>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-button"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>

                <p className="cart-item-total">Total: ${item.total_price}</p>
                <button onClick={() => removeItem(item.id)} className="remove-item-button">Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
      {cart.items.length > 0 && (
        <div className="cart-total">
          <h3 className="cart-total-price">Total Price: ${cart.total_price}</h3>
          <button onClick={handleCheckout} className="checkout-button">Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Cart;