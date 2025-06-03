import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import InputField from './InputField';
import Button from './Button';
import '../styles/LoginRegisterForm.css';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function LoginRegisterForm({ method = 'login' }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    const name = method === 'register' ? 'Sign Up' : 'Login';
    const notify = () => toast.success('Successfully registered');

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

    const validateField = (field, value) => {
        const newErrors = { ...fieldErrors };
        
        switch (field) {
            case 'username':
                newErrors.username = value.trim() === '' ? 'Username is required' : '';
                break;
            case 'email':
                if (method === 'register') {
                    if (value.trim() === '') {
                        newErrors.email = 'Email is required';
                    } else if (!validateEmail(value)) {
                        newErrors.email = 'Please enter a valid email address';
                    } else {
                        newErrors.email = '';
                    }
                }
                break;
            case 'password':
                if (value.trim() === '') {
                    newErrors.password = 'Password is required';
                } else if (method === 'register') {
                    const passwordValidation = validatePassword(value);
                    if (!passwordValidation.isValid) {
                        newErrors.password = passwordValidation.errors[0];
                    } else {
                        newErrors.password = '';
                    }
                } else {
                    newErrors.password = '';
                }
                break;
            case 'confirmPassword':
                if (method === 'register') {
                    if (value.trim() === '') {
                        newErrors.confirmPassword = 'Please confirm your password';
                    } else if (value !== password) {
                        newErrors.confirmPassword = 'Passwords do not match';
                    } else {
                        newErrors.confirmPassword = '';
                    }
                }
                break;
            default:
                break;
        }
        
        setFieldErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const validateAllFields = () => {
        // Validate all fields at once
        const newErrors = {
            username: username.trim() === '' ? 'Username is required' : '',
            email: method === 'register' ? (email.trim() === '' ? 'Email is required' : (!validateEmail(email) ? 'Please enter a valid email address' : '')) : '',
            password: password.trim() === '' ? 'Password is required' : (method === 'register' ? (validatePassword(password).isValid ? '' : validatePassword(password).errors[0]) : ''),
            confirmPassword: method === 'register' ? (confirmPassword.trim() === '' ? 'Please confirm your password' : (confirmPassword !== password ? 'Passwords do not match' : '')) : ''
        };

        setFieldErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate all fields at once
        const isValid = validateAllFields();
        if (!isValid) {
            setLoading(false);
            return;
        }

        try {
            if (method === 'register') {
                try {
                    await api.post('/users/', { username, email, password });
                    notify();
                    navigate('/login');
                } catch (error) {
                    if (error.response?.status === 400) {
                        const errorData = error.response.data;
                        if (errorData.username) {
                            setFieldErrors(prev => ({ ...prev, username: 'Username is already taken' }));
                        } else if (errorData.email) {
                            setFieldErrors(prev => ({ ...prev, email: 'Email is already registered' }));
                        } else {
                            toast.error('Registration failed. Please try again.');
                        }
                    } else {
                        toast.error('Registration failed. Please try again.');
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
                setFieldErrors(prev => ({
                    ...prev,
                    username: 'Invalid username or password',
                    password: 'Invalid username or password'
                }));
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='form-container'>
            <p className='form-title'>{name}</p>
            {error && <div className="error-message">{error}</div>}

            <InputField 
                type="text" 
                placeholder='Username' 
                value={username} 
                onChange={(e) => {
                    setUsername(e.target.value);
                    validateField('username', e.target.value);
                }}
                onBlur={(e) => validateField('username', e.target.value)}
                hasError={!!fieldErrors.username}
                errorMessage={fieldErrors.username}
            />
            
            {method === 'register' && (
                <InputField 
                    type="email" 
                    placeholder='Email Address' 
                    value={email} 
                    onChange={(e) => {
                        setEmail(e.target.value);
                        validateField('email', e.target.value);
                    }}
                    onBlur={(e) => validateField('email', e.target.value)}
                    hasError={!!fieldErrors.email}
                    errorMessage={fieldErrors.email}
                />
            )}
            
            <InputField 
                type="password" 
                placeholder='Password' 
                value={password} 
                onChange={(e) => {
                    setPassword(e.target.value);
                    validateField('password', e.target.value);
                    if (method === 'register' && confirmPassword) {
                        validateField('confirmPassword', confirmPassword);
                    }
                }}
                onBlur={(e) => validateField('password', e.target.value)}
                hasError={!!fieldErrors.password}
                errorMessage={fieldErrors.password}
            />
            
            {method === 'register' && (
                <InputField 
                    type="password" 
                    placeholder='Confirm Password' 
                    value={confirmPassword} 
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        validateField('confirmPassword', e.target.value);
                    }}
                    onBlur={(e) => validateField('confirmPassword', e.target.value)}
                    hasError={!!fieldErrors.confirmPassword}
                    errorMessage={fieldErrors.confirmPassword}
                />
            )}

            <Button className='form-button' 
                type="medium-compact"
                disabled={loading}
            >
                {loading ? 'Loading...' : name}
            </Button>

            <p className='form-text'>
                {method === 'register' ? 'Already have an account? ' : 'New here? '}
                <Link to={method === 'register' ? '/login' : '/register'} className='form-link'>
                    {method === 'register' ? 'Login' : 'Sign Up'}
                </Link>
            </p>
        </form>
    );
}

export default LoginRegisterForm;
