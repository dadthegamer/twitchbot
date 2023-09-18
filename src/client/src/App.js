// App.js
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Users from './components/Users';
import SideNavbar from './components/SideNavBar';
import TopNavbar from './components/TopNavBar';
import Currency from './components/Currency';
import Goal from './components/overlayComponents/goalBar';

function App() {
  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route path="users" element={<Users />} />
        <Route path="currency" element={<Currency />} />
      </Route>

      {/* Overlay Routes */}
      <Route path="/overlay" element={<OverlayLayout />}>
        <Route path="progressbar" element={<Goal />} />
      </Route>
    </Routes>
  );
}


function MainLayout() {
  return (
    <div className="main-layout">
      <TopNavbar />
      <SideNavbar />

      <Outlet />

    </div>
  );
}

function OverlayLayout() {
  return (
    <Outlet />
  );
}

export default App;