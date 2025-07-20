import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Title, Text } from '../components/ui/Typography';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Layout';

function UploadPhotoPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const uploadMutation = useMutation(
    async (formData) => {
      const response = await instance.post('/api/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userPhotos']);
        setFile(null);
        setPreview(null);
        setError('');
        alert('Фотография успешно загружена!');
      },
      onError: (error) => {
        setError(error.response?.data?.message || 'Ошибка при загрузке фотографии');
      },
    }
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="container">
      <Card>
        <Title>Загрузить фотографию</Title>
        <Text>Выберите изображение для загрузки и оценки другими пользователями.</Text>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'block', margin: '0 auto' }}
            />
          </div>

          {preview && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <img
                src={preview}
                alt="Предпросмотр"
                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
              />
            </div>
          )}

          {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" disabled={uploadMutation.isLoading || !file}>
              {uploadMutation.isLoading ? 'Загрузка...' : 'Загрузить'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default UploadPhotoPage;
