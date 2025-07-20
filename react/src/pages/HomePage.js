import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import '../App.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Добро пожаловать в ФотоРейтинг</h1>
      <p>Загружайте свои фотографии, оценивайте работы других и соревнуйтесь за лучшие оценки!</p>
      <div className="home-actions">
        <Card title="Присоединяйтесь к нам!">
          <Link to="/register">
            <Button variant="primary">Регистрация</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary">Вход</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
