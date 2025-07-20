import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { instance } from '../api/axios';

const StatisticsPage = () => {
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalRatings: 0,
    averageRating: 0,
    byGender: {
      male: { count: 0, average: 0 },
      female: { count: 0, average: 0 },
      other: { count: 0, average: 0 }
    },
    byAgeGroup: {
      under20: { count: 0, average: 0 },
      '20-30': { count: 0, average: 0 },
      '30-40': { count: 0, average: 0 },
      over40: { count: 0, average: 0 }
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const response = await instance.get('/api/photos');
        const photos = response.data;
        if (photos.length > 0) {
          let totalRatings = 0;
          let sumRatings = 0;
          const genderStats = {
            male: { count: 0, sum: 0 },
            female: { count: 0, sum: 0 },
            other: { count: 0, sum: 0 }
          };
          const ageStats = {
            under20: { count: 0, sum: 0 },
            '20-30': { count: 0, sum: 0 },
            '30-40': { count: 0, sum: 0 },
            over40: { count: 0, sum: 0 }
          };

          for (const photo of photos) {
            const statsResponse = await instance.get(`/api/photos/${photo._id}/stats`);
            const photoStats = statsResponse.data;
            totalRatings += photoStats.totalRatings;
            sumRatings += photoStats.averageScore * photoStats.totalRatings;

            genderStats.male.count += photoStats.byGender.male.count;
            genderStats.male.sum += photoStats.byGender.male.sum;
            genderStats.female.count += photoStats.byGender.female.count;
            genderStats.female.sum += photoStats.byGender.female.sum;
            genderStats.other.count += photoStats.byGender.other.count;
            genderStats.other.sum += photoStats.byGender.other.sum;

            ageStats.under20.count += photoStats.byAgeGroup.under20.count;
            ageStats.under20.sum += photoStats.byAgeGroup.under20.sum;
            ageStats['20-30'].count += photoStats.byAgeGroup['20-30'].count;
            ageStats['20-30'].sum += photoStats.byAgeGroup['20-30'].sum;
            ageStats['30-40'].count += photoStats.byAgeGroup['30-40'].count;
            ageStats['30-40'].sum += photoStats.byAgeGroup['30-40'].sum;
            ageStats.over40.count += photoStats.byAgeGroup.over40.count;
            ageStats.over40.sum += photoStats.byAgeGroup.over40.sum;
          }

          setStats({
            totalPhotos: photos.length,
            totalRatings,
            averageRating: totalRatings > 0 ? sumRatings / totalRatings : 0,
            byGender: {
              male: {
                count: genderStats.male.count,
                average: genderStats.male.count > 0 ? genderStats.male.sum / genderStats.male.count : 0
              },
              female: {
                count: genderStats.female.count,
                average: genderStats.female.count > 0 ? genderStats.female.sum / genderStats.female.count : 0
              },
              other: {
                count: genderStats.other.count,
                average: genderStats.other.count > 0 ? genderStats.other.sum / genderStats.other.count : 0
              }
            },
            byAgeGroup: {
              under20: {
                count: ageStats.under20.count,
                average: ageStats.under20.count > 0 ? ageStats.under20.sum / ageStats.under20.count : 0
              },
              '20-30': {
                count: ageStats['20-30'].count,
                average: ageStats['20-30'].count > 0 ? ageStats['20-30'].sum / ageStats['20-30'].count : 0
              },
              '30-40': {
                count: ageStats['30-40'].count,
                average: ageStats['30-40'].count > 0 ? ageStats['30-40'].sum / ageStats['30-40'].count : 0
              },
              over40: {
                count: ageStats.over40.count,
                average: ageStats.over40.count > 0 ? ageStats.over40.sum / ageStats.over40.count : 0
              }
            }
          });
        } else {
          setStats({
            totalPhotos: 0,
            totalRatings: 0,
            averageRating: 0,
            byGender: {
              male: { count: 0, average: 0 },
              female: { count: 0, average: 0 },
              other: { count: 0, average: 0 }
            },
            byAgeGroup: {
              under20: { count: 0, average: 0 },
              '20-30': { count: 0, average: 0 },
              '30-40': { count: 0, average: 0 },
              over40: { count: 0, average: 0 }
            }
          });
        }
      } catch (err) {
        setError('Не удалось загрузить статистику.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return (
      <Card title="Ошибка">
        <div className="error-message">{error}</div>
      </Card>
    );
  }

  return (
    <div className="statistics-container">
      <Card title="Общая статистика по вашим фотографиям">
        <p><strong>Всего фотографий:</strong> {stats.totalPhotos}</p>
        <p><strong>Всего оценок:</strong> {stats.totalRatings}</p>
        <p><strong>Средняя оценка:</strong> {stats.averageRating.toFixed(2)}</p>
      </Card>
      <Card title="Статистика по полу">
        <p><strong>Мужчины:</strong> {stats.byGender.male.count} оценок, Средняя: {stats.byGender.male.average.toFixed(2)}</p>
        <p><strong>Женщины:</strong> {stats.byGender.female.count} оценок, Средняя: {stats.byGender.female.average.toFixed(2)}</p>
        <p><strong>Другие:</strong> {stats.byGender.other.count} оценок, Средняя: {stats.byGender.other.average.toFixed(2)}</p>
      </Card>
      <Card title="Статистика по возрастным группам">
        <p><strong>До 20 лет:</strong> {stats.byAgeGroup.under20.count} оценок, Средняя: {stats.byAgeGroup.under20.average.toFixed(2)}</p>
        <p><strong>20-30 лет:</strong> {stats.byAgeGroup['20-30'].count} оценок, Средняя: {stats.byAgeGroup['20-30'].average.toFixed(2)}</p>
        <p><strong>30-40 лет:</strong> {stats.byAgeGroup['30-40'].count} оценок, Средняя: {stats.byAgeGroup['30-40'].average.toFixed(2)}</p>
        <p><strong>Старше 40 лет:</strong> {stats.byAgeGroup.over40.count} оценок, Средняя: {stats.byAgeGroup.over40.average.toFixed(2)}</p>
      </Card>
    </div>
  );
};

export default StatisticsPage;
