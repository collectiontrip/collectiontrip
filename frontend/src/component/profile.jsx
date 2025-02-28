import React, {useEffect, useState} from "react";
import { useNavigate, Link } from 'react-router-dom'; 
import './profile.css'

const Profile = () => {

    const [isAuthenticated, setIsAuthenticated] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear all relevant local storage items
        localStorage.removeItem("cartId");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
    
        // Redirect to the product page
        navigate('/');
      };

    return (
        <>
            <div className="profile">
                    
                <div className="profile-img">
                    <img src="/media/icon/profile.png" alt="Profile" />


                </div>

                <Link to="/user" className="profile-link">user</Link>
                <Link to="/user/address" className="profile-link">Address</Link>
                
                <Link to="/user/orders" className="profile-link">My Orders</Link>
                <Link to="/chatroom" className="profile-link">Support</Link>

                <div className="logout">
                    <h4 onClick={handleLogout}>LogOut</h4>
                </div>

                
                
            </div>
            
        </>
    );
};

export default Profile;