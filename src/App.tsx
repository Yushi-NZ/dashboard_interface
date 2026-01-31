//import React from 'react'

import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

import { BrowserRouter, Routes, Route } from 'react-router'

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
}

export default App
