import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Form from '../components/ui/Form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { instance } from '../api/axios';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email обязателен';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await instance.post('/api/request-password-reset', { email });
      setSuccess(true);
    } catch (error) {
      setErrors({ form: error.response?.data?.message || 'Ошибка при сбросе пароля' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Сброс пароля">
      {success ? (
        <div className="success-message">
          <p>Письмо с инструкциями по сбросу пароля отправлено на ваш email.</p>
          <Button variant="primary" onClick={() => setSuccess(false)}>
            Вернуться
          </Button>
        </div>
      ) : (
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
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Отправка...' : 'Сбросить пароль'}
          </Button>
        </Form>
      )}
    </Card>
  );
};

export default ResetPasswordPage;
