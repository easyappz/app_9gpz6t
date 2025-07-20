import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { instance } from '../api/axios';

const RatePhotosPage = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPhotoForRating = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/api/photos/rate');
      setPhoto(response.data);
    } catch (err) {
      setError('Не удалось загрузить фотографию для оценки.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotoForRating();
  }, []);

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

  if (loading) {
    return <div>Загрузка...</div>;
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
  );
};

export default RatePhotosPage;
