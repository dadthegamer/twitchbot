// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Users from './components/Users';
import SideNavbar from './components/SideNavBar';
import TopNavbar from './components/TopNavBar';

function App() {
  return (
    // Wrap the Routes component in a div with the class name "container"
    <div className="main-container">
      <SideNavbar />
      <TopNavbar />
      <Routes>
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
}

export default App;