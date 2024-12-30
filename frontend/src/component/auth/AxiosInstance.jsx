import axios from 'axios';

// Create Axios instance
const AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // Your backend base URL
  timeout: 5000, // Optional: Set a timeout for requests
});

// Add a request interceptor to include the JWT token dynamically
AxiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage on each request
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;
