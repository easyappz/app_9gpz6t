import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 20px;
  text-align: center;
  background-color: #ffffff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
  margin-top: 40px;
  color: #7f8c8d;
  font-size: 14px;
`;

function Footer() {
  return (
    <FooterContainer>
      <p>© {new Date().getFullYear()} ФотоРейтинг. Все права защищены.</p>
    </FooterContainer>
  );
}

export default Footer;
