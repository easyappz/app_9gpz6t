import styled from 'styled-components';

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
`;

export const PhotoItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }

  .photo-info {
    padding: 10px;
    text-align: center;
  }

  .photo-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    padding: 10px;
  }
`;

export default PhotoGrid;
