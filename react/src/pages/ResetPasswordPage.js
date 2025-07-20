import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Title } from '../components/ui/Typography';
import { FormContainer, FormGroup, Label, ErrorMessage } from '../components/ui/Form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Layout';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const resetPasswordMutation = useMutation(
    async (data) => {
      const response = await instance.post('/api/request-password-reset', data);
      return response.data;
    },
    {
      onSuccess: () => {
        setMessage('Инструкции по восстановлению пароля отправлены на ваш email.');
        setError('');
      },
      onError: (error) => {
        setError(error.response?.data?.message || 'Произошла ошибка. Попробуйте снова.');
        setMessage('');
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Введите email');
      return;
    }
    resetPasswordMutation.mutate({ email });
  };

  return (
    <div className="container">
      <Card>
        <Title>Восстановление пароля</Title>
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

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {message && <div style={{ color: 'green', fontSize: '14px', marginTop: '10px' }}>{message}</div>}

          <Button type="submit" disabled={resetPasswordMutation.isLoading || message !== ''}>
            {resetPasswordMutation.isLoading ? 'Отправка...' : 'Отправить инструкции'}
          </Button>

          <Button type="button" variant="secondary" onClick={() => navigate('/login')}>
            Назад ко входу
          </Button>
        </FormContainer>
      </Card>
    </div>
  );
}

export default ResetPasswordPage;
