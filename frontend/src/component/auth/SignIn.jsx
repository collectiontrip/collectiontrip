import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Importing useNavigate and Link
import './SignIn.css'; // Importing the CSS file

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(''); // Added success message state

    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!username || !password) {
            setError('Please fill in both username and password.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(''); // Reset success message on every submit

        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/jwt/create', {
                username,
                password,
            });

            // Check if the response contains tokens before saving them
            if (response.data.access && response.data.refresh) {
                // Save token to localStorage if login is successful
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh); // Store the JWT token

                setSuccessMessage('Logged in successfully!'); // Set the success message
                console.log("Logged in successfully!", response.data);

                // Redirect the user to the desired URL after a short delay to show success message
                setTimeout(() => {
                    navigate('/product'); // Redirect to the provided URL
                }, 1500); // Redirect after 1.5 seconds
            } else {
                setError('Failed to retrieve tokens.');
            }
        } catch (err) {
            // Error handling to display a meaningful message
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

            {/* Show success message */}
            {successMessage && <p className="success">{successMessage}</p>}

            {/* Show error message */}
            {error && <p className="error">{error}</p>}

            {/* Sign Up Link */}
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
