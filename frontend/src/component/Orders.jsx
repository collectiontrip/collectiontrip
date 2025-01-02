import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './Orders.css'; // Assuming you are using the same Orders CSS file

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders from the backend API
    axios
      .get("http://127.0.0.1:8000/store/orders/")
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="orders-empty-message">No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-container">
            <h2 className="order-title">Order ID: {order.id}</h2>
            <div className="order-items">
              {order.items.map((item) => (
                <Link to={`/product/${item.product.id}`} key={item.id} className="order-item"> 
                  <div className="order-item-image-container">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0].image}
                        alt={item.product.title}
                        className="order-item-img"
                      />
                    ) : (
                      <img
                        src="path/to/default-image.jpg" // Default placeholder image
                        alt="Default Image"
                        className="order-item-img"
                      />
                    )}
                  </div>
                  <div className="order-item-info">
                    <h3 className="order-item-title">{item.product.title}</h3>
                    <p className="order-item-description">{item.product.description}</p>
                    <p className="order-item-price">Price: ${item.product.price}</p>
                    <p className="order-item-quantity">Quantity: {item.quantity}</p>
                    <p className="order-item-total">Total: ${item.total_price}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="order-pay-now">
              <div className="order-total-price">
                <p>Total Price: ${order.total_price}</p>
              </div>
              <div className="pay-now-button-container">
                <button className="pay-now-button">Pay Now</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
