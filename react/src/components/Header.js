import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { instance } from '../api/axios';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: #34495e;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #3498db;
  }
`;

const PointsDisplay = styled.div`
  background-color: #3498db;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
`;

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const { data: user, isLoading, error } = useQuery(
    ['userProfile'],
    async () => {
      const response = await instance.get('/api/profile');
      return response.data;
    },
    {
      enabled: !!token,
      staleTime: 60000,
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isAuthenticated = !!token;

  return (
    <HeaderContainer>
      <Logo to="/">ФотоРейтинг</Logo>
      <Nav>
        {isAuthenticated ? (
          <>
            <NavLink to="/upload">Загрузить фото</NavLink>
            <NavLink to="/rate">Оценить фото</NavLink>
            <NavLink to="/statistics">Статистика</NavLink>
            <NavLink to="/profile">Профиль</NavLink>
            {user && <PointsDisplay>Баллы: {user.points || 0}</PointsDisplay>}
            <NavLink as="button" onClick={handleLogout} to="#">
              Выйти
            </NavLink>
          </>
        ) : (
          <>
            {location.pathname !== '/login' && <NavLink to="/login">Войти</NavLink>}
            {location.pathname !== '/register' && <NavLink to="/register">Регистрация</NavLink>}
          </>
        )}
      </Nav>
    </HeaderContainer>
  );
}

export default Header;
