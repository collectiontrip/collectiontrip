import React, { useState, useEffect } from 'react';
import AxiosInstance from './auth/AxiosInstance';
import './user.css';

const User = () => {

    const [user, setUser] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {

            try {
                const response = await AxiosInstance.get('auth/users/me');
                console.log(response.data);
                setUser(response.data);
                setLoading(false);
                
            } catch (error) {
                console.error(error);
            }

        };
        fetchUser();
    }, []); 

    useEffect(() => {
        const fetchCustomer = async () => {
            

            try {
                const response = await AxiosInstance.get('store/customers/me');
                console.log(response.data);
                setCustomer(response.data);
                setLoading(false);
                
            } catch (error) {
                console.error(error);
            }

        };
        fetchCustomer();
    }, []); 

    if (loading) return <div>loading</div>;
    if (error) return <div>{error}</div>;
    
    
    return (
        <div className="user-profile">
          <div className="profile-picture">
            <img src={customer.image} alt="" />
          </div>
          <div className="profile-info">
            <h2>{user.username}</h2>
            <p>
              Name - {user.first_name} {user.last_name}
            </p>
            <p>Email - {user.email}</p>
            <p>Phone - {customer.phone}</p>
            <p>DOB - {customer.birth_date}</p>
            <p>Membership - {customer.membership}</p>
          </div>
          <div className="profile-stats">
            <p>Orders: 10</p>
            <p>Reviews: 5</p>
            <p>Points: 100</p>
          </div>
          <div className="profile-actions">
            <button>Edit Profile</button>
            <button>View Orders</button>
          </div>
        </div>
    );
    

};


export default User;