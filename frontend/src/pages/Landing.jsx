import React, { useEffect } from 'react';
import '../styles/Landing.css';

function LandingPage() {
    useEffect(() => {
        document.title = 'Welcome to Our Application';
    }, []);
    
    return (
        <div className="landing-container">
        <h1>Welcome to Our Application</h1>
        <p>This is the landing page of our application.</p>
        <p>Explore the features and functionalities we offer.</p>
        </div>
    );
}

export default LandingPage;