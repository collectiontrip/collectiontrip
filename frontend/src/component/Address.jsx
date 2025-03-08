
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from './auth/AxiosInstance';
import './Address.css';

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await AxiosInstance.get('store/addresses/');
        setAddresses(response.data);
      } catch (err) {
        setError('Failed to fetch addresses.');
        console.error('Error fetching addresses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    const defaultAddressId = localStorage.getItem('defaultAddressId');
    if (defaultAddressId) {
      setAddresses((prevAddresses) => prevAddresses.map((address) => ({
        ...address,
        default_address: address.id === parseInt(defaultAddressId),
      })));
    }
  }, [addresses]);

  const handleSetDefaultAddress = async (id) => {
    try {
      await AxiosInstance.patch(`store/addresses/${id}/`, { default_address: true });
      localStorage.setItem('defaultAddressId', id);
      setAddresses((prevAddresses) => prevAddresses.map((address) => ({
        ...address,
        default_address: address.id === id,
      })));
    } catch (err) {
      console.error('Error setting default address:', err);
      setError('Failed to set default address.');
    }
  };

  return (
    <div className="address-list-container">
      <h2 className="address-list-title">My Addresses</h2>
      <button className="add-new-address" onClick={() => navigate('/user/address/new')}>
        + Add New Address
      </button>

      {loading && <p className="loading">Loading addresses...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && addresses.length === 0 && <p className="no-address">No addresses found.</p>}

      <div className="address-grid">
        {addresses.map((address) => (
          <div key={address.id} className="address-card">
            <div className="address-details">
              <p><strong>Street:</strong> {address.street}</p>
              <div className="grid-container">
                <p><strong>City:</strong> {address.city}</p>
                <p><strong>State:</strong> {address.state}</p>
                <p><strong>Postal Code:</strong> {address.postal_code}</p>
                <p><strong>Country:</strong> {address.country}</p>
              </div>
            <div className="address-actions">
                <div className="address-status">
                    <p><strong>Billing Address:</strong> {address.is_billing_address ? 'Yes' : 'No'}</p>
                </div>
                <div className="address-status">
                    <p><strong>Billing Address:</strong> {address.is_billing_address ? 'Yes' : 'No'}</p>
                </div>
                <div className="default-checkbox-container">
                    <label className="default-checkbox">
                    <input type="checkbox" checked={address.default_address} onChange={() => handleSetDefaultAddress(address.id)} />
                    Set as Default
                    </label>
                </div>
            </div>

            </div>
            <div className="button-container">
              <button className="edit-button" onClick={() => navigate('/user/address/update')}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressList;

