import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    };

    // Check authentication on mount
    checkAuth();

    // Listen for changes in local storage
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [setIsAuthenticated]);

  const handleLogout = () => {
    // Clear all relevant local storage items
    localStorage.removeItem("cartId");
    localStorage.removeItem("accessToken");  
    localStorage.removeItem("refreshToken"); 
    
    setIsAuthenticated(false);
    
    // Redirect to the product page
    navigate("/product");
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
      <Link to={`/carts/${localStorage.getItem('cartId') || 'default'}`} className="nav-link">
        Cart
      </Link> 
        {!isAuthenticated ? (
          <>
            <Link to="/user/signin" className="nav-link">Sign In</Link>
            <Link to="/user/signup" className="nav-link">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="nav-link">Profile</Link>
            <Link to="/user/address" className="nav-link">Address</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;