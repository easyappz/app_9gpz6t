import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import Form from '../components/ui/Form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { instance } from '../api/axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/profile';

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email обязателен';
    if (!password) newErrors.password = 'Пароль обязателен';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await instance.post('/api/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/profile', { replace: true });
      } else {
        setErrors({ form: 'Токен не получен. Пожалуйста, попробуйте снова.' });
      }
    } catch (error) {
      setErrors({ form: error.response?.data?.message || 'Ошибка входа' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Вход">
      <Form onSubmit={handleSubmit}>
        {errors.form && <div className="error-message">{errors.form}</div>}
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        <Input
          label="Пароль"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </Button>
        <div className="form-footer">
          <a href="/reset-password">Забыли пароль?</a>
        </div>
      </Form>
    </Card>
  );
};

export default LoginPage;
