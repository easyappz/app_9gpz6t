import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { instance } from '../api/axios';

const RatePhotosPage = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: ''
  });

  const fetchPhotoForRating = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/api/photos/rate', {
        params: {
          gender: filters.gender || undefined,
          minAge: filters.minAge || undefined,
          maxAge: filters.maxAge || undefined
        }
      });
      setPhoto(response.data);
    } catch (err) {
      setError('Не удалось загрузить фотографию для оценки.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotoForRating();
  }, [filters]);

  const handleRating = async (rating) => {
    if (!photo) return;

    setLoading(true);
    try {
      await instance.post('/api/ratings', {
        photoId: photo._id,
        rating,
      });
      fetchPhotoForRating();
    } catch (err) {
      setError('Не удалось оценить фотографию.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return (
      <Card title="Ошибка">
        <div className="error-message">{error}</div>
        <Button variant="primary" onClick={() => fetchPhotoForRating()}>
          Попробовать снова
        </Button>
      </Card>
    );
  }

  if (!photo) {
    return (
      <Card title="Оценка фотографий">
        <p>Фотографии для оценки закончились.</p>
      </Card>
    );
  }

  return (
    <div className="rate-photos-container">
      <Card title="Фильтры">
        <div className="filters">
          <div className="filter-group">
            <label>Пол:</label>
            <Select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              options={[
                { value: '', label: 'Все' },
                { value: 'male', label: 'Мужской' },
                { value: 'female', label: 'Женский' },
                { value: 'other', label: 'Другой' }
              ]}
            />
          </div>
          <div className="filter-group">
            <label>Возраст от:</label>
            <Select
              name="minAge"
              value={filters.minAge}
              onChange={handleFilterChange}
              options={[
                { value: '', label: 'Любой' },
                { value: '18', label: '18' },
                { value: '25', label: '25' },
                { value: '30', label: '30' },
                { value: '40', label: '40' }
              ]}
            />
          </div>
          <div className="filter-group">
            <label>Возраст до:</label>
            <Select
              name="maxAge"
              value={filters.maxAge}
              onChange={handleFilterChange}
              options={[
                { value: '', label: 'Любой' },
                { value: '25', label: '25' },
                { value: '30', label: '30' },
                { value: '40', label: '40' },
                { value: '50', label: '50+' }
              ]}
            />
          </div>
        </div>
      </Card>
      <Card title="Оцените эту фотографию">
        <img src={`/uploads/${photo.filename}`} alt="Фото для оценки" className="rating-photo" />
        <div className="rating-buttons">
          {[1, 2, 3, 4, 5].map(rating => (
            <Button
              key={rating}
              variant="primary"
              onClick={() => handleRating(rating)}
              disabled={loading}
            >
              {rating}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RatePhotosPage;
