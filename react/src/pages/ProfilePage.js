import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { instance } from '../api/axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ username: '', email: '', points: 0 });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileAndPhotos = async () => {
      try {
        const profileResponse = await instance.get('/api/profile');
        setProfile(profileResponse.data);

        const photosResponse = await instance.get('/api/photos');
        setPhotos(photosResponse.data);
      } catch (err) {
        setError('Не удалось загрузить данные профиля или фотографии.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPhotos();
  }, []);

  const handleToggleActive = async (photoId, currentActiveState) => {
    if (profile.points <= 0 && !currentActiveState) {
      setError('У вас недостаточно баллов для активации фотографии.');
      return;
    }

    try {
      await instance.put(`/api/photos/${photoId}/toggle-active`);
      setPhotos(photos.map(photo => 
        photo._id === photoId ? { ...photo, active: !photo.active } : photo
      ));
      if (!currentActiveState) {
        setProfile({ ...profile, points: profile.points - 1 });
      }
    } catch (err) {
      setError('Не удалось изменить статус фотографии.');
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="profile-page">
      <Card title="Профиль пользователя">
        {error && <div className="error-message">{error}</div>}
        <p><strong>Имя пользователя:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Баллы:</strong> {profile.points}</p>
      </Card>
      <Card title="Ваши фотографии">
        {photos.length === 0 ? (
          <p>У вас пока нет загруженных фотографий.</p>
        ) : (
          <div className="photo-list">
            {photos.map(photo => (
              <div key={photo._id} className="photo-item">
                <img src={`/uploads/${photo.filename}`} alt="Фото" className="photo-image" />
                <p>Статус: {photo.active ? 'Активна (оценивается)' : 'Неактивна'}</p>
                <Button
                  variant={photo.active ? 'danger' : 'primary'}
                  onClick={() => handleToggleActive(photo._id, photo.active)}
                  disabled={profile.points <= 0 && !photo.active}
                >
                  {photo.active ? 'Деактивировать' : 'Активировать (1 балл)'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
