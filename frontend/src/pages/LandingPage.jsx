import React, { useEffect } from 'react';
import '../styles/Landing.css';

function LandingPage() {
  useEffect(() => {
    const originalPadding = document.body.style.padding;
    document.body.style.padding = '0';

    return () => {
      document.body.style.padding = originalPadding;
    };
  }, []);

  return (
    <div className="landing-page">
      <header className="header">
        <nav className="landing-navbar">
          <a href="/login">Log In</a>
          <div className="logo">PAHINgA</div>
          <a href="/register">Sign Up</a>
        </nav>
      </header>

      <main className="landing-hero">
        <h1 className="landing-title">tEST</h1>
        <a href="/register" className="main-button">Get Started</a>
      </main>
    </div>
  );
}

export default LandingPage;