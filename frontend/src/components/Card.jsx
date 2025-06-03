import React from 'react';
import '../styles/Card.css';

// NOTE: You need to specify the background color using a class, e.g. 'statCard' { background-color: ... }
// The size of the card will depend on the container (such as grid or flex) that wraps the Card component.

function Card({ children, className }) {
  return (
    <div className={`card ${className || ''}`} >
      {children}
    </div>
  );
}

export default Card;