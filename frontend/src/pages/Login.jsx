import LoginRegisterForm from '../components/LoginRegisterForm';
import loginImage from '../assets/Login.png';
import '../styles/Login.css';

function Login() {
    return <div className='login-container'>
        <h1 className='title'>PAHINgA</h1>
        <div className='login-form-container'>
            <div className='text-image-container'>
                <h1>Welcome Back</h1>
                <p>Take a moment. Your thoughts are safe here.</p>
                <img src={loginImage} alt="Login" />
            </div>
            <LoginRegisterForm method='login' />
        </div>
    </div>
        
}

export default Login;