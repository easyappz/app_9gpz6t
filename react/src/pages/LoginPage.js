import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Title } from '../components/ui/Typography';
import { FormContainer, FormGroup, Label, ErrorMessage } from '../components/ui/Form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Layout';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useMutation(
    async (credentials) => {
      const response = await instance.post('/api/login', credentials);
      return response.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        navigate(from, { replace: true });
      },
      onError: (error) => {
        setError(error.response?.data?.message || 'Ошибка входа. Проверьте данные.');
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Все поля обязательны для заполнения');
      return;
    }
    setError('');
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="container">
      <Card>
        <Title>Вход</Title>
        <FormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
            />
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
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={loginMutation.isLoading}>
            {loginMutation.isLoading ? 'Вход...' : 'Войти'}
          </Button>

          <Button type="button" variant="secondary" onClick={() => navigate('/reset-password')}>
            Забыли пароль?
          </Button>
        </FormContainer>
      </Card>
    </div>
  );
}

export default LoginPage;
