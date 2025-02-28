import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./ProductList.css";
import AddToCart from "./AddToCart";
import CollectionList from "./CollectionList";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showCollections, setShowCollections] = useState(false);
    const [globalMessage, setGlobalMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const getQueryParams = () => new URLSearchParams(location.search);

    useEffect(() => {
        const fetchProducts = async () => {
            const queryParams = getQueryParams();
            try {
                const response = await axios.get("http://127.0.0.1:8000/store/products/", {
                    params: Object.fromEntries(queryParams.entries()),
                });

                const data = response.data;
                setProducts(data?.results || []);
                setTotalPages(data?.total_pages || 1);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(true);
                setLoading(false);
            }
        };

        

        
        fetchProducts();
    }, [location.search]);

    const updateQueryParams = (newParams, resetParams = []) => {
        const queryParams = getQueryParams();
        resetParams.forEach((param) => queryParams.delete(param));
        Object.entries(newParams).forEach(([key, value]) => {
            value ? queryParams.set(key, value) : queryParams.delete(key);
        });
        navigate(`?${queryParams.toString()}`);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        updateQueryParams({ search: searchTerm }, ["collection_id", "price__gt", "price__lt", "ordering", "category"]);
    };

    const handleAddToCartSuccess = (message) => {
        setGlobalMessage('Product successfully added to cart');
        setTimeout(() => setGlobalMessage(''), 3000);
      };

    const handleFilterByPrice = () => {
        setCurrentPage(1);
        updateQueryParams({ price__gt: minPrice, price__lt: maxPrice }, ["search", "collection_id", "ordering", "category"]);
    };

    const handleCollectionSelect = (collectionId) => {
        setCurrentPage(1);
        updateQueryParams({ collection_id: collectionId }, ["search", "price__gt", "price__lt", "ordering", "category"]);
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
        updateQueryParams({ category: categoryId }, ["search", "price__gt", "price__lt", "ordering", "collection_id"]);
    };

    const handlePageChange = (direction) => {
        const newPage = currentPage + direction;
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
            updateQueryParams({ page: newPage });
        }
    };

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>Error occurred while fetching products. Please try again later.</h2>;

    return (
        <div className="product-list-main-container">

                <header className="product-list-header">
                    
                    <div className="collection">
                        <button className="toggle-collections-btn" onClick={() => setShowCollections(!showCollections)}>
                            {showCollections ? "Hide Collections" : "Show Collections"}
                        </button>
                        {showCollections && <CollectionList onCollectionSelect={handleCollectionSelect} />}

                        <div className="search-container">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products..."
                            />
                        <button onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                    <div className="filter-sort-section">
                        <aside className="product-list-left-container">
                            <section className="filter-container">
                                
                                    <div className="filter-sort">
                                        <div className="price-filter">
                                            <input
                                                type="number"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                                placeholder="Min Price"
                                            />
                                            <input
                                                type="number"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                                placeholder="Max Price"
                                            />
                                            <button onClick={handleFilterByPrice}>Filter by Price</button>

                                            
                                        </div>

                                    <div className="sort-by">
                                        <select value={sortOrder} onChange={(e) => updateQueryParams({ ordering: e.target.value })}>
                                            <option value="">Sort By</option>
                                            <option value="price">Price: Low to High</option>
                                            <option value="-price">Price: High to Low</option>
                                        </select>
                                    </div>
                                </div>
                                
                                
                                
                            </section>
                        </aside>
                    </div>
                    
                    
                    
                </header>
            
            

            <main className="product-list-body-container">
            

                
                <section className="product-list-right-container">
                    <div>
                        {globalMessage && (
                            <p className="global-message">{globalMessage}</p>
                        )}
                    </div>
                    <div className="product-list-container">
                    
                        
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div className="product-item" key={product.id}>
                                    <div className="product-image">
                                        {product.images?.[0] && (
                                            <Link to={`/product/${product.id}`}>
                                                
                                            <img src={product.images[0].image} alt="Product Thumbnail" />
                                            </Link>
                                        )}
                                    </div>
                                    <div className="product-detail">
                                        <Link to={`/product/${product.id}`}>
                                            <h3>{product.title}</h3>
                                        </Link>
                                        <p>{product.description}</p>
                                        <h4>{product.price}$</h4>
                                        
                                        <div className="add-to-cart">
                                            <AddToCart productId={product.id} onAddSuccess={handleAddToCartSuccess} />
                                        </div>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No products found.</p>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="pagination-controls">
                        <button disabled={currentPage === 1} onClick={() => handlePageChange(-1)}>Previous</button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(1)}>Next</button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProductList;