import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Title, Subtitle } from '../components/ui/Typography';
import { FormContainer, FormGroup, Label, ErrorMessage } from '../components/ui/Form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Layout';

function ProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery(
    ['userProfile'],
    async () => {
      const response = await instance.get('/api/profile');
      return response.data;
    },
    {
      onSuccess: (data) => {
        setUsername(data.username);
        setEmail(data.email);
        setGender(data.gender);
        setAge(data.age);
      },
      staleTime: 60000,
    }
  );

  const updateProfileMutation = useMutation(
    async (userData) => {
      const response = await instance.put('/api/profile', userData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userProfile']);
        alert('Профиль успешно обновлен');
      },
      onError: (error) => {
        setErrors({ form: error.response?.data?.message || 'Ошибка при обновлении профиля' });
      },
    }
  );

  const updatePasswordMutation = useMutation(
    async (passwordData) => {
      const response = await instance.put('/api/profile/password', passwordData);
      return response.data;
    },
    {
      onSuccess: () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setErrors({});
        alert('Пароль успешно изменен');
      },
      onError: (error) => {
        setErrors({ passwordForm: error.response?.data?.message || 'Ошибка при смене пароля' });
      },
    }
  );

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username) newErrors.username = 'Имя пользователя обязательно';
    if (!email) newErrors.email = 'Email обязателен';
    if (!gender) newErrors.gender = 'Укажите ваш пол';
    if (!age) newErrors.age = 'Укажите ваш возраст';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    updateProfileMutation.mutate({ username, email, gender, age });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!currentPassword) newErrors.currentPassword = 'Введите текущий пароль';
    if (!newPassword) newErrors.newPassword = 'Введите новый пароль';
    if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = 'Пароли не совпадают';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updatePasswordMutation.mutate({ currentPassword, newPassword });
  };

  if (isLoading) return <div className="container"><Title>Загрузка...</Title></div>;
  if (error) return <div className="container"><Title>Ошибка: {error.message}</Title></div>;

  return (
    <div className="container">
      <Card>
        <Title>Профиль</Title>
        <Subtitle>Обновить данные профиля</Subtitle>
        <FormContainer onSubmit={handleProfileSubmit}>
          <FormGroup>
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
            />
            {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="gender">Пол</Label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' }}
            >
              <option value="">Выберите пол</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="other">Другое</option>
            </select>
            {errors.gender && <ErrorMessage>{errors.gender}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="age">Возраст</Label>
            <Input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Введите возраст"
            />
            {errors.age && <ErrorMessage>{errors.age}</ErrorMessage>}
          </FormGroup>

          {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}

          <Button type="submit" disabled={updateProfileMutation.isLoading}>
            {updateProfileMutation.isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </FormContainer>
      </Card>

      <Card>
        <Subtitle>Изменить пароль</Subtitle>
        <FormContainer onSubmit={handlePasswordSubmit}>
          <FormGroup>
            <Label htmlFor="currentPassword">Текущий пароль</Label>
            <Input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Введите текущий пароль"
            />
            {errors.currentPassword && <ErrorMessage>{errors.currentPassword}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="newPassword">Новый пароль</Label>
            <Input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Введите новый пароль"
            />
            {errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmNewPassword">Подтвердите новый пароль</Label>
            <Input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Подтвердите новый пароль"
            />
            {errors.confirmNewPassword && <ErrorMessage>{errors.confirmNewPassword}</ErrorMessage>}
          </FormGroup>

          {errors.passwordForm && <ErrorMessage>{errors.passwordForm}</ErrorMessage>}

          <Button type="submit" disabled={updatePasswordMutation.isLoading}>
            {updatePasswordMutation.isLoading ? 'Изменение...' : 'Изменить пароль'}
          </Button>
        </FormContainer>
      </Card>
    </div>
  );
}

export default ProfilePage;
