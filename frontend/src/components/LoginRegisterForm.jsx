import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import '../styles/LoginRegisterForm.css';

function LoginRegisterForm({ method = 'login' }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const name = method === 'register' ? 'Register' : 'Login';

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const hasMinLength = password.length >= 8;
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const errors = [];
        if (!hasMinLength) errors.push("Password must be at least 8 characters long");
        if (!hasLowerCase) errors.push("Password must contain at least one lowercase letter");
        if (!hasUpperCase) errors.push("Password must contain at least one uppercase letter");
        if (!hasNumber) errors.push("Password must contain at least one number");
        if (!hasSymbol) errors.push("Password must contain at least one special character");

        return {
            isValid: errors.length === 0,
            errors
        };
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (method === 'register') {
                // Validate email format
                if (!validateEmail(email)) {
                    setError('Please enter a valid email address');
                    setLoading(false);
                    return;
                }

                // Validate password strength
                const passwordValidation = validatePassword(password);
                if (!passwordValidation.isValid) {
                    setError(passwordValidation.errors.join('\n'));
                    setLoading(false);
                    return;
                }

                // Check if passwords match
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }

                // Check if username or email is already taken
                try {
                    await api.post('/users/', { username, email, password });
                    navigate('/login');
                } catch (error) {
                    if (error.response?.status === 400) {
                        const errorData = error.response.data;
                        if (errorData.username) {
                            setError('Username is already taken');
                        } else if (errorData.email) {
                            setError('Email is already registered');
                        } else {
                            setError('Registration failed. Please try again.');
                        }
                    } else {
                        setError('Registration failed. Please try again.');
                    }
                }
            } else {
                const response = await api.post('/token/', { username, password });
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate('/');
            }
        } catch (error) {
            console.error(`Error ${method}ing:`, error);
            if (method === 'login') {
                setError('Invalid username or password');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='form-container'>
            <h1>{name}</h1>
            {error && <div className="error-message">{error}</div>}

            <input 
                className='form-input' 
                type="text" 
                placeholder='Username' 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required 
            />
            
            {method === 'register' && (
                <input 
                    className='form-input' 
                    type="email" 
                    placeholder='Email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
            )}
            
            <input 
                className='form-input' 
                type="password" 
                placeholder='Password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
            />
            
            {method === 'register' && (
                <input 
                    className='form-input' 
                    type="password" 
                    placeholder='Confirm Password' 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                />
            )}

            <button 
                className='form-button' 
                type='submit' 
                disabled={loading}
            >
                {loading ? 'Loading...' : name}
            </button>
        </form>
    );
}

export default LoginRegisterForm;
