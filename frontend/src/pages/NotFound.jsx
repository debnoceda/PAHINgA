import mascot from '../assets/404.png';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <img src={mascot} alt="Cute mascot" className="mascott-img" />
      <h1>Oops! Page Not Found</h1>
      <p className="medium-text">Looks like you've taken a wrong turn.</p>
      <a href="/" className="custom-button medium-compact notfound-button">Go Home</a>
    </div>
  );
};

export default NotFound;