import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./ProductList.css";
import AddToCart from './AddToCart';
import CollectionList from './CollectionList'; // Import CollectionList

const ImageSlider = ({ images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); 
    };

    const previousImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
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
    const [selectedImage, setSelectedImage] = useState(null); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch products on load
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/store/products/");
                const data = response.data;

                if (data && Array.isArray(data.results)) {
                    setProducts(data.results);
                    setFilteredProducts(data.results); // Set full list initially
                } else {
                    setProducts([]);
                    setFilteredProducts([]);
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

    // Handle search
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
        // Update URL with the search term
        navigate(`?search=${searchTerm}`);
    };

    // Update the search term when URL changes (for deep linking)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search") || "";
        setSearchTerm(searchQuery);
        if (searchQuery) {
            const filtered = products.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [location.search, products]);

    const handleAddToCart = (product) => {
        console.log(`Added to cart: ${product.title}`);
    };

    const handleBuyNow = (product) => {
        console.log(`Buy Now: ${product.title}`);
    };

    const openFullScreenImage = (image) => {
        setSelectedImage(image); 
    };

    const closeFullScreenImage = () => {
        setSelectedImage(null);
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Error occurred while fetching products. Please try again later.</h2>;
    }

    return (
        <div className="product-list-parent-container">
            <div className="main-container">
                {/* Left Section: Collection List */}
                <div className="left-section">
                    <CollectionList />
                </div>

                {/* Right Section: Product List */}
                <div className="right-section">
                    {/* Search Container */}
                    <div className="search-container">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search products..."
                        />
                        <button onClick={handleSearch}>Search</button>
                    </div>

                    {/* Product List Container */}
                    <div className="product-list-container">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
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
                </div>
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
