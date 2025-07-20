import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Title } from '../components/ui/Typography';
import { FormContainer, FormGroup, Label, ErrorMessage } from '../components/ui/Form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Layout';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({});

  const registerMutation = useMutation(
    async (userData) => {
      const response = await instance.post('/api/register', userData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        navigate('/');
      },
      onError: (error) => {
        setErrors({ form: error.response?.data?.message || 'Произошла ошибка при регистрации' });
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username) newErrors.username = 'Имя пользователя обязательно';
    if (!email) newErrors.email = 'Email обязателен';
    if (!password) newErrors.password = 'Пароль обязателен';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    if (!gender) newErrors.gender = 'Укажите ваш пол';
    if (!age) newErrors.age = 'Укажите ваш возраст';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    registerMutation.mutate({ username, email, password, gender, age });
  };

  return (
    <div className="container">
      <Card>
        <Title>Регистрация</Title>
        <FormContainer onSubmit={handleSubmit}>
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
            <Label htmlFor="password">Пароль</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Подтвердите пароль"
            />
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
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

          <Button type="submit" disabled={registerMutation.isLoading}>
            {registerMutation.isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </FormContainer>
      </Card>
    </div>
  );
}

export default RegisterPage;
