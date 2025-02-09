import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductDetails.css';
import { useParams } from 'react-router-dom';
import AddToCart from './AddToCart';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [globalMessage, setGlobalMessage] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/store/products/${productId}/`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching product details');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCartSuccess = (message) => {
    setGlobalMessage(message);
    setTimeout(() => setGlobalMessage(''), 3000);
  };

  const handleImageClick = () => {
    setIsFullScreen(true);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : product.images.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex < product.images.length - 1 ? prevIndex + 1 : 0));
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-details-container">
      {globalMessage && <div className="global-message">{globalMessage}</div>}

      <div className="product-content">
        <div className="product-images">
          <div className="large-image-container" onClick={handleImageClick}>
            <img src={product.images[selectedImageIndex]?.image} alt="Product" />
          </div>
          <div className="image-controls">
            <button onClick={handlePrevImage}>&lt;</button>
            <div className="small-images">
              {product.images.map((image, index) => (
                <img
                  key={image.id}
                  src={image.image}
                  alt={`Product ${image.id}`}
                  onClick={() => setSelectedImageIndex(index)}
                  className={index === selectedImageIndex ? 'active' : ''}
                />
              ))}
            </div>
            <button onClick={handleNextImage}>&gt;</button>
          </div>
        </div>

        <div className="product-info">
          <h1>{product.title}</h1>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Price with Tax:</strong> ${product.price_with_tax.toFixed(2)}</p>

          <div className="product-buttons">
            <AddToCart productId={product.id} onAddSuccess={handleAddToCartSuccess} />
          </div>
        </div>
      </div>

      <div className="product-reviews">
        <h2>Reviews</h2>
        {product.reviews.length > 0 ? (
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

      {isFullScreen && (
        <div className="fullscreen-overlay">
          <button className="close-button" onClick={handleCloseFullScreen}>×</button>
          <button className="prev-button" onClick={handlePrevImage}>&lt;</button>
          <img src={product.images[selectedImageIndex]?.image} alt="Fullscreen Product" />
          <button className="next-button" onClick={handleNextImage}>&gt;</button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
