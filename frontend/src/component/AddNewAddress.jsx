import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from './auth/AxiosInstance';
import './AddNewAddress.css';

const AddNewAddress = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    is_billing_address: false,
    is_shipping_address: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await AxiosInstance.post('store/addresses/', address);
      setSuccessMessage('Address successfully added!');
      setTimeout(() => navigate('/address'), 2000);
    } catch (err) {
      setError('Failed to add address.');
      console.error('Error adding address:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-form-container">
      <h2>Add New Address</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="address-form">
        <div className="input-container">
          <label htmlFor="street">Street:</label>
          <input type="text" id="street" name="street" value={address.street} onChange={handleChange} required />
        </div>
        <div className="input-container">
          <label htmlFor="city">City:</label>
          <input type="text" id="city" name="city" value={address.city} onChange={handleChange} required />
        </div>
        <div className="input-container">
          <label htmlFor="state">State:</label>
          <input type="text" id="state" name="state" value={address.state} onChange={handleChange} required />
        </div>
        <div className="input-container">
          <label htmlFor="postal_code">Postal Code:</label>
          <input type="text" id="postal_code" name="postal_code" value={address.postal_code} onChange={handleChange} required />
        </div>
        <div className="input-container">
          <label htmlFor="country">Country:</label>
          <input type="text" id="country" name="country" value={address.country} onChange={handleChange} required />
        </div>
        <div className="checkbox-container">
          <label>
            <input type="checkbox" name="is_billing_address" checked={address.is_billing_address} onChange={handleChange} />
            Billing Address
          </label>
          <label>
            <input type="checkbox" name="is_shipping_address" checked={address.is_shipping_address} onChange={handleChange} />
            Shipping Address
          </label>
        </div>
        <div className="button-container">
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Address'}</button>
        </div>
      </form>
    </div>
  );
};

export default AddNewAddress;
