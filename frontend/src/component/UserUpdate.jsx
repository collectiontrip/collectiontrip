
import React, { useState, useEffect } from 'react';
import AxiosInstance from './auth/AxiosInstance';
import './UserUpdate.css';
import { useNavigate, Link } from 'react-router-dom'; 

const UserUpdate = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  const [customerData, setCustomerData] = useState({
    phone: '',
    birth_date: '',
    membership: '',
    image: null,
  });

  


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AxiosInstance.get('auth/users/me/');
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCustomerData = async () => {
      try {
        const response = await AxiosInstance.get('store/customers/me/');
        setCustomerData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    


    fetchUserData();
    fetchCustomerData();
    

  }, []);

  const handleUpdate = async () => {
    try {
      // Update user data
      const userResponse = await AxiosInstance.patch('auth/users/me/', userData);
      console.log('User Updated:', userResponse.data);

      // Update customer data
      const formData = new FormData();
      Object.keys(customerData).forEach((key) => {
        formData.append(key, customerData[key]);
      });
      const customerResponse = await AxiosInstance.patch('store/customers/me/', formData);
      console.log('Customer Updated:', customerResponse.data);
      const addressResponse = await AxiosInstance.put('store/addresses/', address);
      console.log('Address Updated:', addressResponse.data);

      navigate('/user');
    } catch (error) {
      console.error('Update failed:', error.response ? error.response.data : error.message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (event) => {
    const { name } = event.target;
    if (name === 'image') {
      setCustomerData((prev) => ({ ...prev, [name]: event.target.files[0] }));
    } else {
      setCustomerData((prev) => ({ ...prev, [name]: event.target.value }));
    }
  };

  const handleAddressChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: type === 'checkbox' ? checked : value }));
  };


  
    
  return (
    <div className="update-container">
      <h2>Update User Data</h2>
      <div className="update-form">
        <div className="form-section">
          <label>First Name:</label>
          <input type="text" name="first_name" value={userData.first_name} onChange={handleInputChange} />
        </div>
        <div className="form-section">
          <label>Last Name:</label>
          <input type="text" name="last_name" value={userData.last_name} onChange={handleInputChange} />
        </div>
        <div className="form-section">
          <label>Email:</label>
          <input type="email" name="email" value={userData.email} onChange={handleInputChange} />
        </div>
      </div>
      <h2>Update Customer Data</h2>
      <div className="update-form">
        <div className="form-section">
          <label>Phone:</label>
          <input type="text" name="phone" value={customerData.phone} onChange={handleCustomerChange} />
        </div>
        <div className="form-section">
          <label>Birth Date:</label>
          <input type="date" name="birth_date" value={customerData.birth_date} onChange={handleCustomerChange} />
        </div>
        <div className="form-section">
          <label>Membership:</label>
          <select name="membership" value={customerData.membership} onChange={handleCustomerChange}>
            <option value="B">Bronze</option>
            <option value="S">Silver</option>
            <option value="G">Gold</option>
          </select>
        </div>
        <div className="form-section">
                    {customerData.image && (
            <img src={customerData.image} alt="Customer Image" />

          )}
          <input type="file" name="image" onChange={handleCustomerChange} />

        </div>
       
        
        

      </div>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
  
};

export default UserUpdate;

