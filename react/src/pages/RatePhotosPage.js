import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Title, Text } from '../components/ui/Typography';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Layout';

function RatePhotosPage() {
  const [rating, setRating] = useState(0);
  const [filters, setFilters] = useState({ gender: '', ageMin: '', ageMax: '' });
  const queryClient = useQueryClient();

  const { data: photo, isLoading, error, refetch } = useQuery(
    ['photoForRating', filters],
    async () => {
      const params = new URLSearchParams();
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.ageMin) params.append('ageMin', filters.ageMin);
      if (filters.ageMax) params.append('ageMax', filters.ageMax);

      const response = await instance.get(`/api/photos/rate?${params.toString()}`);
      return response.data;
    },
    {
      staleTime: 30000,
    }
  );

  const rateMutation = useMutation(
    async ({ photoId, score }) => {
      const response = await instance.post('/api/ratings', { photoId, score });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['photoForRating']);
        refetch();
        setRating(0);
      },
      onError: (error) => {
        alert(error.response?.data?.message || 'Ошибка при оценке фотографии');
      },
    }
  );

  const handleRating = () => {
    if (rating < 1 || rating > 10) {
      alert('Пожалуйста, выберите оценку от 1 до 10');
      return;
    }
    rateMutation.mutate({ photoId: photo._id, score: rating });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    refetch();
  };

  if (isLoading) return <div className="container"><Title>Загрузка...</Title></div>;
  if (error) return <div className="container"><Title>Ошибка: {error.message}</Title></div>;
  if (!photo) return <div className="container"><Title>Фотографии для оценки не найдены</Title></div>;

  return (
    <div className="container">
      <Card>
        <Title>Оценить фотографию</Title>
        <Text>Оцените эту фотографию от 1 до 10.</Text>

        <div style={{ marginBottom: '20px', textAlign: 'center', marginTop: '20px' }}>
          <img
            src={`/uploads/${photo.filePath.split('/').pop()}`}
            alt="Фото для оценки"
            style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }}
          />
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#7f8c8d' }}>
            Автор: {photo.userId.username} | Возраст: {photo.userId.age} | Пол: {photo.userId.gender === 'male' ? 'Мужской' : photo.userId.gender === 'female' ? 'Женский' : 'Другое'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <div>
            <label htmlFor="rating" style={{ marginRight: '10px' }}>Оценка:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="0">Выберите оценку</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleRating} disabled={rateMutation.isLoading || rating === 0}>
            {rateMutation.isLoading ? 'Оцениваем...' : 'Отправить оценку'}
          </Button>
        </div>
      </Card>

      <Card>
        <Title>Фильтры</Title>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          <div>
            <label htmlFor="gender" style={{ display: 'block', marginBottom: '5px' }}>Пол:</label>
            <select
              id="gender"
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '200px' }}
            >
              <option value="">Все</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="other">Другое</option>
            </select>
          </div>
          <div>
            <label htmlFor="ageMin" style={{ display: 'block', marginBottom: '5px' }}>Возраст от:</label>
            <input
              type="number"
              id="ageMin"
              name="ageMin"
              value={filters.ageMin}
              onChange={handleFilterChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '200px' }}
              placeholder="Любой"
            />
          </div>
          <div>
            <label htmlFor="ageMax" style={{ display: 'block', marginBottom: '5px' }}>Возраст до:</label>
            <input
              type="number"
              id="ageMax"
              name="ageMax"
              value={filters.ageMax}
              onChange={handleFilterChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '200px' }}
              placeholder="Любой"
            />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button onClick={applyFilters}>Применить фильтры</Button>
        </div>
      </Card>
    </div>
  );
}

export default RatePhotosPage;
