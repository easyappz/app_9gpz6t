import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { instance } from '../api/axios';

const StatisticsPage = () => {
  const [stats, setStats] = useState({ totalPhotos: 0, totalRatings: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Здесь должен быть запрос к API для получения статистики
        // Это заглушка, замените на реальный запрос
        const response = await instance.get('/api/statistics');
        setStats(response.data);
      } catch (err) {
        setError('Не удалось загрузить статистику.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return (
      <Card title="Ошибка">
        <div className="error-message">{error}</div>
      </Card>
    );
  }

  return (
    <Card title="Статистика">
      <p><strong>Всего фотографий:</strong> {stats.totalPhotos}</p>
      <p><strong>Всего оценок:</strong> {stats.totalRatings}</p>
      <p><strong>Средняя оценка:</strong> {stats.averageRating.toFixed(2)}</p>
    </Card>
  );
};

export default StatisticsPage;
