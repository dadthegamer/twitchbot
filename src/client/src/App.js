// App.js
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { createPortal } from 'react-dom';
import CamOverlay from './components/overlayComponents/CamOverlay';
import Users from './components/Users';
import SideNavbar from './components/SideNavBar';
import TopNavbar from './components/TopNavBar';
import Currency from './components/Currency';
import ProgressBar from './components/overlayComponents/goalBar';
import StartingSoon from './components/overlayComponents/startingSoon';
import Quotes from './components/Quotes'
import Update from './components/Update';
import Goals from './components/Goals';
import Commands from './components/Commands';
import Dashboard from './components/Dashboard';
import Games from './components/Games';

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
        <Route path="commands" element={<Commands />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="games" element={<Games />} />
      </Route>

      {/* Overlay Routes */}
      <Route path="/overlay" element={<OverlayLayout />}>
        <Route path="progressbar" element={<ProgressBar />} />
        <Route path="startingsoon" element={<StartingSoon />} />
        <Route path="camoverlay" element={<CamOverlay />} />
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

  return createPortal(
    <div className="overlay">
      <Outlet />
    </div>,
    document.body
  );

}

export default App;