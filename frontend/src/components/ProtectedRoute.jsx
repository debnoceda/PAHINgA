import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useState, useEffect } from 'react';

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        auth().catch((error) => {
            console.error('Authentication error:', error);
            setIsAuthenticated(false);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        try {
            const response = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });
            
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthenticated(true);
                return true;
            }
            throw new Error('Failed to refresh token');
        } catch (error) {
            console.error('Token refresh error:', error);
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            setIsAuthenticated(false);
            return false;
        }
    };

    const auth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const decodedToken = jwtDecode(accessToken);
            const tokenExpiry = decodedToken.exp;
            const currentTime = Date.now() / 1000;

            if (tokenExpiry < currentTime) {
                const refreshSuccess = await refreshToken();
                if (!refreshSuccess) {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Token validation error:', error);
            setIsAuthenticated(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;