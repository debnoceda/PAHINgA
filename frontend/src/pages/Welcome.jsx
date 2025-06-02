import welcomeImage from '../assets/WelcomePic2.PNG'; // adjust path as needed
import '../styles/Welcome.css'; // optional CSS
import Button from '../components/Button';

const Welcome = ({ username, onGetStarted }) => {
  return (
    <div className="welcome-container">
      <img src={welcomeImage} alt="Welcome" className="welcome-image" />  
      <h1 className="welcome-title">Welcome to Our App!</h1>
      <Button type='medium-compact' className="get-started-button" onClick={onGetStarted}>
        Get Started
      </Button>
    </div>
  );
};

export default Welcome;