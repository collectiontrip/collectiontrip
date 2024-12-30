import React, { useState } from 'react';
import axiosInstance from './AxiosInstance'; // Importing AxiosInstance
import { useNavigate, Link } from 'react-router-dom'; 
import './SignIn.css'; 

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please fill in both username and password.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await axiosInstance.post('auth/jwt/create', {
                username,
                password,
            });

            if (response.data.access && response.data.refresh) {
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);

                setSuccessMessage('Logged in successfully!');
                console.log("Logged in successfully!", response.data);

                setTimeout(() => {
                    navigate('/product');
                }, 1500);
            } else {
                setError('Failed to retrieve tokens.');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid credentials or an error occurred');
            console.error('Login failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sign-in-container">
            <div className="sign-in-header">
                <h2>Sign In</h2>
            </div>

            <form onSubmit={handleSubmit} className="sign-in-form">
                <div className="input-container">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="button-container">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>
            </form>

            {successMessage && <p className="success">{successMessage}</p>}
            {error && <p className="error">{error}</p>}

            <div className="sign-up-link">
                <p>
                    Not a user?{' '}
                    <Link to="/user/signup" className="register-link">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
