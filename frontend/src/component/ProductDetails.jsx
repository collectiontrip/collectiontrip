import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductDetails.css';
import { useParams } from 'react-router-dom'; // Import useParams hook
import AddToCart from './AddToCart';

const ProductDetails = () => {
  const { productId } = useParams(); // Get productId from URL params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State to track the selected image
  const [globalMessage, setGlobalMessage] = useState(''); // State for the global success message
  const apiUrl = `http://127.0.0.1:8000/store/products/${productId}/`;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(apiUrl);
        setProduct(response.data);
        setLoading(false);
        setSelectedImage(response.data.images[0]?.image || null); // Set the default selected image to the first image
      } catch (err) {
        setError('Error fetching product details');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [apiUrl]);

  const handleAddToCartSuccess = (message) => {
    setGlobalMessage(message);
    setTimeout(() => setGlobalMessage(''), 3000); // Clear the message after 3 seconds
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleImageClick = (image) => {
    setSelectedImage(image); // Update the selected image when a small image is clicked
  };

  return (
    <div className="product-details-container">
      {globalMessage && <div className="global-message">{globalMessage}</div>}
      <div className="product-images">
        <div className="large-image">
          <img src={selectedImage} alt="Product" />
        </div>
        <div className="small-images">
          {product.images.map((image) => (
            <img
              key={image.id}
              src={image.image}
              alt={`Product ${image.id}`}
              onClick={() => handleImageClick(image.image)}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h1>{product.title}</h1>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Price with Tax:</strong> ${product.price_with_tax.toFixed(2)}</p>

        <div className="product-buttons">
          <AddToCart
            productId={product.id} 
            onAddSuccess={handleAddToCartSuccess} 
            onError={(err) => console.error(err)} 
          />
          <button className="buy-now">Buy Now</button>
        </div>
      </div>

      <div className="product-reviews">
        <h2>Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <ul>
            {product.reviews.map((review, index) => (
              <li key={index}>
                <p><strong>Reviewer:</strong> {review.name}</p>
                <p><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {review.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;