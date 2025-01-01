import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from './auth/AxiosInstance';
import './Address.css';

const AddressForm = ({ addressId, onSubmitSuccess }) => {
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

  const navigate = useNavigate();

  useEffect(() => {
    if (addressId) {
      const fetchAddress = async () => {
        try {
          const response = await AxiosInstance.get(`/addresses/${addressId}/`);
          setAddress(response.data);
        } catch (err) {
          setError('Failed to fetch address data.');
          console.error('Error fetching address:', err);
        }
      };
      fetchAddress();
    }
  }, [addressId]);

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
      if (addressId) {
        await AxiosInstance.put(`/addresses/${addressId}/`, address);
      } else {
        await AxiosInstance.post('/addresses/', address);
      }

      setSuccessMessage('Address successfully saved!');
      setTimeout(() => navigate('/product'), 2000);
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setError('Failed to save address.');
      console.error('Error saving address:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-form-container">
      <h2>{addressId ? 'Edit Address' : 'Add Address'}</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="address-form">
        <div className="input-container">
          <label htmlFor="street">Street:</label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            name="state"
            value={address.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="postal_code">Postal Code:</label>
          <input
            type="text"
            id="postal_code"
            name="postal_code"
            value={address.postal_code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            value={address.country}
            onChange={handleChange}
            required
          />
        </div>
        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              name="is_billing_address"
              checked={address.is_billing_address}
              onChange={handleChange}
            />
            Billing Address
          </label>
          <label>
            <input
              type="checkbox"
              name="is_shipping_address"
              checked={address.is_shipping_address}
              onChange={handleChange}
            />
            Shipping Address
          </label>
        </div>
        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
