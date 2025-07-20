import React from 'react';
import './Input.css';

const Input = ({ type = 'text', value, onChange, placeholder, label, name, error, required = false }) => {
  return (
    <div className="ui-input-container">
      {label && (
        <label htmlFor={name} className="ui-input-label">
          {label}
          {required && <span className="ui-input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`ui-input ${error ? 'ui-input-error' : ''}`}
        required={required}
      />
      {error && <span className="ui-input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
