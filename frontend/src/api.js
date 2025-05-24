import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';


const api = axios.create({
    baseURL: 'http://localhost:8000/api',
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
        if (error.response.status === 401 && !originalRequest) {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            
        }
        return Promise.reject(error);
    }
);

export default api;
