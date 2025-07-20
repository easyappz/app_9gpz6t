import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main {
    flex: 1;
    padding: 20px 0;
  }
`;

export const Card = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

export const Section = styled.section`
  margin-bottom: 40px;
`;
