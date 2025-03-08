
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"
import AxiosInstance from './auth/AxiosInstance';
import './NavBar.css';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await AxiosInstance.get('store/customers/me');
        setCustomer(response.data);
        console.log('Customer fetch successfully' )
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };
    fetchCustomer();
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    };
    checkAuth();
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!customer) return <div>Loading user data...</div>;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-links">
          <Link to="/" className="nav-link">Product</Link>
          <Link to={`/carts/${localStorage.getItem('cartId') || 'default'}`} className="nav-link"> Cart </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/user/signin" className="nav-link">Sign In</Link>
              <Link to="/user/signup" className="nav-link">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/user/profile">
                <div className="profile-img">
                  {customer.image ? (
                    <img src={customer.image} alt="Profile" />
                  ) : (
                    <img src="/media/icon/profile.png" alt="Profile" />
                  )}
                </div>

              </Link>
            </>
          )}
          {/* Chat Button */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
