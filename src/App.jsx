import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wrapper from './pages/Wrapper';

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
        element={
        <Wrapper><Dashboard /></Wrapper>
      
      }
        />

        { /* register */ }
        <Route 
        path="/register"
        element={<Register />}
        />
      </Routes>
    </BrowserRouter>
  )
};

export default App;