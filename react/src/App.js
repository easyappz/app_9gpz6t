import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UploadPhotoPage from './pages/UploadPhotoPage';
import RatePhotosPage from './pages/RatePhotosPage';
import StatisticsPage from './pages/StatisticsPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route
              path="upload"
              element={
                <PrivateRoute>
                  <UploadPhotoPage />
                </PrivateRoute>
              }
            />
            <Route
              path="rate"
              element={
                <PrivateRoute>
                  <RatePhotosPage />
                </PrivateRoute>
              }
            />
            <Route
              path="statistics"
              element={
                <PrivateRoute>
                  <StatisticsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
