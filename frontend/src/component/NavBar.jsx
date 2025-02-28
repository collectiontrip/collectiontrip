import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"
import './Navbar.css';z

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
    navigate("/");
  };

 

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-links">
          <Link to="/" className="nav-link">Product</Link>
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
              <Link to="/user/profile">profile</Link>

              
            </>
          )}
          {/* Chat Button */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




