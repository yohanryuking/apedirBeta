import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = () => {
  return (
    <div className="loading-animation">
      {Array.from('APEDIR').map((letter, index) => (
        <span key={index} style={{ '--i': index }}>
          {letter}
        </span>
      ))}
    </div>
  );
};

export default LoadingAnimation;