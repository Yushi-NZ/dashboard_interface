import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        { /* home */ }
        <Route 
        path="/"
        element={<Home />}
        />

        { /* login */ }
        <Route 
        path="/login"
        element={<Login />}
        />

        { /* dashboard */ }
        <Route 
        path="/dashboard"
        element={<Dashboard />}
        />
      </Routes>
    </BrowserRouter>
  )
};

export default App;