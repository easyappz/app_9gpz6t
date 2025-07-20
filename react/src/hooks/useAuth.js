import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Здесь должна быть проверка токена или сессии
    // Например, запрос к API для проверки авторизации
    const checkAuth = async () => {
      try {
        // Заглушка: предполагаем, что пользователь авторизован, если есть токен в localStorage
        const token = localStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
};
