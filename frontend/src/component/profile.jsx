import React, {useEffect, useState} from "react";
import { useNavigate, Link } from 'react-router-dom'; 
import AxiosInstance from "./auth/AxiosInstance";

import './profile.css'

const Profile = () => {

    const [isAuthenticated, setIsAuthenticated] = useState("");
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();


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

    const handleLogout = () => {
        // Clear all relevant local storage items
        localStorage.removeItem("cartId");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
    
        // Redirect to the product page
        navigate('/');
      };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;
    if (!customer) return <div>Loading user data...</div>;

    return (
        <>
            <div className="profile">
                    
                <div className="profile-img">
                    {customer.image ? (
                        <img src={customer.image} alt="Profile" />
                    ) : (
                        <img src="/media/icon/profile.png" alt="Profile" />
                    )}
                </div>


                <Link to="/user" className="profile-link">user</Link>
                <Link to="/user/addresses" className="profile-link">Address</Link>
                
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