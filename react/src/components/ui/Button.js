import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => props.variant === 'secondary' ? '#ecf0f1' : '#3498db'};
  color: ${props => props.variant === 'secondary' ? '#2c3e50' : '#ffffff'};
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#dcdfe1' : '#2980b9'};
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

export default Button;
