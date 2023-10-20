// App.js
import React from 'react';
import { useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Users from './components/Users';
import SideNavbar from './components/SideNavBar';
import TopNavbar from './components/TopNavBar';
import Currency from './components/Currency';
import ProgressBar from './components/overlayComponents/goalBar';
import StartingSoon from './components/overlayComponents/startingSoon';
import Quotes from './components/Quotes'
import Streamathon from './components/Streamathon';
import Prediction from './components/overlayComponents/Prediction';
import Update from './components/Update';
import Goals from './components/Goals';
import Commands from './components/Commands';
import Dashboard from './components/Dashboard';
import Games from './components/Games';
import CamOverlay from './components/overlayComponents/CamOverlay';


function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/overlay')) {
      document.body.style.backgroundColor = 'transparent';
    } else {
      document.body.style.backgroundColor = '#11111';
      document.body.style.fontFamily = 'Cabin, sans-serif'
    }
  }, [location]);

  return (
    <Routes>
      {/* Overlay Routes */}
      <Route path="/overlay" element={<OverlayLayout />}>
        <Route path="progressbar" element={<ProgressBar />} />
        <Route path="startingsoon" element={<StartingSoon />} />
        <Route path="camoverlay" element={<CamOverlay />} />
        <Route path="prediction" element={<Prediction />} />
      </Route>

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
        <Route path="streamathon" element={<Streamathon />} />
      </Route>
    </Routes>
  );
}


function MainLayout() {
  useEffect(() => {
    document.body.style.backgroundColor = '#111111';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
  }, []);

  return (
    <div className="main-layout">
      <TopNavbar />
      <SideNavbar />

      <Outlet />

    </div>
  );
}

function OverlayLayout() {

  useEffect(() => {
    document.body.style = ''; // reset styles
  }, []);

  return createPortal(
    <div className="overlay">
      <Outlet />
    </div>,
    document.body
  );
}

export default App;