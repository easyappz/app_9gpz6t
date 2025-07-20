import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Container } from './ui/Layout';

function Layout() {
  return (
    <Container>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </Container>
  );
}

export default Layout;
