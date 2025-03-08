import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
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
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await AxiosInstance.get('store/customers/me');
        setCustomer(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };
    fetchCustomer();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!user || !customer) return <div>Loading user data...</div>;

  return (
    <div className="user-profile container">
      
      <div className="profile-img">
        {customer.image ? (
          <img src={customer.image} alt="Profile" />
        ) : (
          <img src="/media/icon/profile.png" alt="Profile" />
        )}
      </div>

      <h2>{user.username}</h2>
      
      <div className="profile-info grid-container">

        <div className="grid-item"><strong>Name:</strong> {user.first_name} {user.last_name}</div>
        <div className="grid-item"><strong>Email:</strong> {user.email}</div>
        <div className="grid-item"><strong>Phone:</strong> {customer.phone}</div>
        <div className="grid-item"><strong>Date of Birth:</strong> {customer.birth_date}</div>
        <div className="grid-item"><strong>Membership:</strong> {customer.membership}</div>
        <div className="profile-actions grid-item">
        <Link to="/user/update">
          <button>Edit Profile</button>
        </Link>
      </div>
      </div>
      
      
    </div>
  );
};

export default User;
