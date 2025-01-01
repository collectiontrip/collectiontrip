import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/store',
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    console.log('Access token:', accessToken);
    if (accessToken) {
      config.headers['Authorization'] = `JWT ${accessToken}`;
      console.log('Request headers:', config.headers);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;
