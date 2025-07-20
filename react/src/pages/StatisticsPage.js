import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Title, Subtitle, Text } from '../components/ui/Typography';
import { Card, Section } from '../components/ui/Layout';
import PhotoGrid, { PhotoItem } from '../components/ui/PhotoGrid';

function StatisticsPage() {
  const { data: userPhotos, isLoading: photosLoading, error: photosError } = useQuery(
    ['userPhotos'],
    async () => {
      const response = await instance.get('/api/photos');
      return response.data;
    },
    {
      staleTime: 60000,
    }
  );

  const { data: userProfile, isLoading: profileLoading, error: profileError } = useQuery(
    ['userProfile'],
    async () => {
      const response = await instance.get('/api/profile');
      return response.data;
    },
    {
      staleTime: 60000,
    }
  );

  if (photosLoading || profileLoading) return <div className="container"><Title>Загрузка...</Title></div>;
  if (photosError || profileError) return <div className="container"><Title>Ошибка: {(photosError || profileError).message}</Title></div>;

  return (
    <div className="container">
      <Section>
        <Card>
          <Title>Ваши баллы: {userProfile.points || 0}</Title>
          <Text>Это сумма всех оценок ваших фотографий.</Text>
        </Card>
      </Section>

      <Section>
        <Subtitle>Ваши фотографии</Subtitle>
        {userPhotos && userPhotos.length > 0 ? (
          <PhotoGrid>
            {userPhotos.map((photo) => (
              <PhotoItem key={photo._id}>
                <img src={`/uploads/${photo.filePath.split('/').pop()}`} alt="Ваше фото" />
                <div className="photo-info">
                  <Text>Средняя оценка: {photo.averageRating.toFixed(2)} ({photo.ratingCount} голосов)</Text>
                  <Text>Статус: {photo.isActive ? 'Активно' : 'Неактивно'}</Text>
                </div>
              </PhotoItem>
            ))}
          </PhotoGrid>
        ) : (
          <Card>
            <Text>У вас пока нет загруженных фотографий.</Text>
          </Card>
        )}
      </Section>
    </div>
  );
}

export default StatisticsPage;
