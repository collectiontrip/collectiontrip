import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Importing the CSS file

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/users/', formData);

            setSuccessMessage('Account created successfully! Please log in.');
            console.log('Sign up successful:', response.data);

            // Redirect the user to the login page after successful signup
            navigate('/user/signin');
        } catch (err) {
            setError('Failed to create account. Please check your inputs or try again later.');
            console.error('Sign up failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const navigateToSignIn = () => {
        navigate('/user/signin'); // Navigate to the Sign In page
    };

    return (
        <div className="sign-up-container">
            <div className="sign-up-header">
                <h2>Sign Up</h2>
            </div>

            <form onSubmit={handleSubmit} className="sign-up-form">
                <div className="input-container">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="first_name">First Name:</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="last_name">Last Name:</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="button-container">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>
            </form>

            {successMessage && <p className="success">{successMessage}</p>}
            {error && <p className="error">{error}</p>}

            <div className="already-registered">
                <p>Already have an account?</p>
                <div className="already-registered">
                    <p>Already registered? <a href="/user/signin">Sign In here</a></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
