import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Text } from '../components/ui/Typography';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Layout';

function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <div className="container">
      <Card>
        <Title>Добро пожаловать в ФотоРейтинг</Title>
        <Text>
          Загружайте свои фотографии, оценивайте работы других пользователей и соревнуйтесь за лучшие баллы!
        </Text>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
          {token ? (
            <>
              <Button onClick={() => navigate('/upload')}>Загрузить фото</Button>
              <Button onClick={() => navigate('/rate')} variant="secondary">
                Оценить фото
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/login')}>Войти</Button>
              <Button onClick={() => navigate('/register')} variant="secondary">
                Регистрация
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default HomePage;
