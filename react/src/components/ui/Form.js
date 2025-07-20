import React from 'react';
import './Form.css';

const Form = ({ children, onSubmit, className = '' }) => {
  return (
    <form className={`ui-form ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Form;
