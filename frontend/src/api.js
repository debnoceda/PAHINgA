import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const API_URL = import.meta.env.VITE_API_URL || 'https://pahinga-backend.onrender.com/api/';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call the refresh token endpoint
                const response = await axios.post(`${API_URL}token/refresh/`, {
                    refresh: refreshToken
                });

                const { access } = response.data;
                
                // Store the new access token
                localStorage.setItem(ACCESS_TOKEN, access);
                
                // Update the original request's authorization header
                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                
                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh token fails, clear tokens and reject
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
