import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { instance } from '../api/axios';

const UploadPhotoPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Пожалуйста, выберите файл для загрузки.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      await instance.post('/api/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      setFile(null);
      document.getElementById('fileInput').value = '';
    } catch (err) {
      setError('Не удалось загрузить фотографию. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Загрузка фотографии">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Фотография успешно загружена!</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: '15px' }}
        />
        <Button type="submit" variant="primary" disabled={loading || !file}>
          {loading ? 'Загрузка...' : 'Загрузить'}
        </Button>
      </form>
    </Card>
  );
};

export default UploadPhotoPage;
