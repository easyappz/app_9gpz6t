import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
`;

export const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
`;
