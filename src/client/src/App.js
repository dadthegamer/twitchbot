// App.js
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Users from './components/Users';
import SideNavbar from './components/SideNavBar';
import TopNavbar from './components/TopNavBar';
import Currency from './components/Currency';
import ProgressBar from './components/overlayComponents/goalBar';
import StartingSoon from './components/overlayComponents/startingSoon';
import Quotes from './components/Quotes'
import Update from './components/Update';
import Goals from './components/Goals';

function App() {
  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route path="users" element={<Users />} />
        <Route path="currency" element={<Currency />} />
        <Route path="quotes" element={<Quotes />} />
        <Route path="update" element={<Update />} />
        <Route path="goals" element={<Goals />} />
      </Route>

      {/* Overlay Routes */}
      <Route path="/overlay" element={<OverlayLayout />}>
        <Route path="progressbar" element={<ProgressBar />} />
        <Route path="startingsoon" element={<StartingSoon />} />
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