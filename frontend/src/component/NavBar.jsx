import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartId, setCartId] = useState(localStorage.getItem("cartId") || "");
  const navigate = useNavigate();

  useEffect(() => {
    // This effect will run every time the component renders
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // true if token exists, false otherwise
  }, [localStorage.getItem("token")]); // Dependency on token from localStorage

  const handleLogout = () => {
    // Clear localStorage or any other stored data
    localStorage.removeItem("cartId");
    localStorage.removeItem("token");  // Clear token
    localStorage.removeItem("refreshToken"); // Clear refresh token (optional)
    // Update state to trigger re-render
    setIsAuthenticated(false);
    setCartId(""); // Optionally, clear cart ID from state as well
    // Navigate to the sign-in page
    navigate("/user/signin");
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        {cartId && <Link to={`/carts/${cartId}`} className="nav-link">Cart</Link>}
        {!isAuthenticated ? (
          <>
            <Link to="/user/signin" className="nav-link">Sign In</Link>
            <Link to="/user/signup" className="nav-link">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
