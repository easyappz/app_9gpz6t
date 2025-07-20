import React from 'react';
import './Card.css';

const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`ui-card ${className}`}>
      {title && <h2 className="ui-card-title">{title}</h2>}
      <div className="ui-card-content">{children}</div>
    </div>
  );
};

export default Card;
