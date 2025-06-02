import LoginRegisterForm from '../components/LoginRegisterForm';
import registerImage from '../assets/Signup.png';
import "../styles/Register.css";


function Register() {
    return <div className='register-container'>
        <h1 className='title'>PAHINgA</h1>
        <div className='register-form-container'>
            <div className='register-form'>
                <LoginRegisterForm method='register' />
            </div>
            <div className='text-image-container'>
                <h1>Open a New Page</h1>
                <p>You deserve a safe space.</p>
                <img src={registerImage} alt="Register" />
            </div>
        </div>
    </div>
}
    
export default Register;