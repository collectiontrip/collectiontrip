import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Orders.css'; // Assuming you are using the same Orders CSS file

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handlePayNow = (orderId) => {
    // Handle the payment logic here
    alert(`Redirecting to payment gateway for Order ID: ${orderId}`);

    // You can navigate to a payment page if you have one
    navigate(`/payment/${orderId}`);
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Your Orders</h1>
      <div className="orders-items">
        {orders.length === 0 ? (
          <p className="orders-empty-message">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              {order.items.map((item) => (
                <div key={item.id} className="order-item-details">
                  {/* Fetch product image */}
                  <div className="order-item-image-container">
                    {item.product.image ? (
                      <img
                        src={`http://127.0.0.1:8000/media/${item.product.image}`}
                        alt={item.product.title}
                        className="order-item-img" // Custom CSS class
                      />
                    ) : (
                      <img
                        src="path/to/default-image.jpg" // Default placeholder image
                        alt="Default Image"
                        className="order-item-img" // Custom CSS class
                      />
                    )}
                  </div>
                  <div className="order-item-info">
                    <h3 className="order-item-title">{item.product.title}</h3>
                    <p className="order-item-price">Price: ${item.product.price}</p>
                    <p className="order-item-quantity">Quantity: {item.quantity}</p>
                    <p className="order-item-total">Total: ${item.total_price}</p>
                  </div>
                </div>
              ))}
              {/* Pay Now Button */}
              <div className="order-pay-now">
                <button
                  onClick={() => handlePayNow(order.id)}
                  className="pay-now-button"
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
