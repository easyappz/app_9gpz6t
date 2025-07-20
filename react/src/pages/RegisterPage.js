import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Form from '../components/ui/Form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { instance } from '../api/axios';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const genderOptions = [
    { value: '', label: 'Выберите пол' },
    { value: 'male', label: 'Мужской' },
    { value: 'female', label: 'Женский' },
    { value: 'other', label: 'Другое' },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Имя пользователя обязательно';
    if (!email) newErrors.email = 'Email обязателен';
    if (!password) newErrors.password = 'Пароль обязателен';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    if (!gender) newErrors.gender = 'Пол обязателен';
    if (!age) newErrors.age = 'Возраст обязателен';
    else if (age < 18) newErrors.age = 'Возраст должен быть не менее 18 лет';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await instance.post('/api/register', {
        username,
        email,
        password,
        gender,
        age: parseInt(age, 10),
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/profile');
      } else {
        setErrors({ form: 'Регистрация прошла успешно, но токен не получен. Пожалуйста, войдите.' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ошибка регистрации. Пожалуйста, попробуйте снова.';
      setErrors({ form: errorMessage });
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Регистрация">
      <Form onSubmit={handleSubmit}>
        {errors.form && <div className="error-message" style={{ color: '#dc3545', marginBottom: '10px', fontSize: '14px' }}>{errors.form}</div>}
        <Input
          label="Имя пользователя"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          required
        />
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
        <Input
          label="Подтвердите пароль"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          required
        />
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Пол</label>
          <Select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            options={genderOptions}
          />
          {errors.gender && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{errors.gender}</div>}
        </div>
        <Input
          label="Возраст"
          name="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          error={errors.age}
          required
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </Form>
    </Card>
  );
};

export default RegisterPage;
