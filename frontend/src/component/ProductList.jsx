import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ProductList.css";
import AddToCart from './AddToCart';

// ImageSlider component to display images with next and previous buttons
const ImageSlider = ({ images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Loop to the first image
    };

    const previousImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length // Loop to the last image
        );
    };

    return (
        <div className="image-slider-container">
            <img 
                src={images[currentIndex]?.image} 
                alt={`Product Image ${currentIndex + 1}`} 
            />
            <div className="slider-controls">
                <button className="prev" onClick={previousImage}>&lt;</button>
                <button className="next" onClick={nextImage}>&gt;</button>
            </div>
            <button className="close-btn" onClick={onClose}>Close</button>
        </div>
    );
};

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // For full-screen image

    // Fetch products on load
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/store/products/");
                const data = response.data;

                if (data && Array.isArray(data.results)) {
                    setProducts(data.results);
                } else {
                    setProducts([]);
                }

                setLoading(false);
                setError(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError(true);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        console.log(`Added to cart: ${product.title}`);
        // You can implement the actual "Add to Cart" functionality here
    };

    const handleBuyNow = (product) => {
        console.log(`Buy Now: ${product.title}`);
        // You can implement the actual "Buy Now" functionality here
    };

    const openFullScreenImage = (image) => {
        setSelectedImage(image); // Set the selected image to be shown in full-screen
    };

    const closeFullScreenImage = () => {
        setSelectedImage(null); // Close the full-screen view
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Error occurred while fetching products. Please try again later.</h2>;
    }

    return (
        <div className="product-list-parent-container">
            <div className="product-list-container">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div className="product-item" key={product.id}>
                            <div className="product-image">
                                {product.images && product.images.length > 0 && (
                                    <img
                                        src={product.images[0].image}
                                        alt="Product Thumbnail"
                                        onClick={() => openFullScreenImage(product.images)}
                                    />
                                )}
                            </div>

                            <div className="product-detail">
                                <Link to={`/product/${product.id}`}>
                                    <h3>{product.title}</h3>
                                </Link>
                                <p>{product.description}</p>
                                <h4>{product.price}$</h4>
                                <div className="product-actions">
                                    <AddToCart 
                                        productId={product.id} 
                                        onAddSuccess={() => console.log("Added successfully!")} 
                                        onError={(err) => console.error(err)} 
                                    />
                                    <button 
                                        className="buy-now-btn" 
                                        onClick={() => handleBuyNow(product)}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>

            {/* Modal for Full-Screen Image */}
            {selectedImage && (
                <div className="full-screen-modal">
                    <ImageSlider images={selectedImage} onClose={closeFullScreenImage} />
                </div>
            )}
        </div>
    );
};

export default ProductList;
