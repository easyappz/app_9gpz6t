import React from 'react';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>ФотоРейтинг</h1>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <p>© 2023 ФотоРейтинг. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default Layout;
