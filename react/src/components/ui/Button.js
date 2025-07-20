import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', onClick, disabled, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      className={`ui-button ui-button-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
