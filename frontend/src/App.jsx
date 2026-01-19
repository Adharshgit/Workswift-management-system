import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
// import Navbar from './components/Navbar'; // Replaced by Layout
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ShiftList from './pages/ShiftList';
import SwapRequests from './pages/SwapRequests';
import ManageEmployees from './pages/ManageEmployees';
import ManageShifts from './pages/ManageShifts';
import CreateShift from './pages/CreateShift';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shifts" element={<ShiftList />} />
              <Route path="/swaps" element={<SwapRequests />} />
              <Route path="/manage-employees" element={<ManageEmployees />} />
              <Route path="/manage" element={<ManageShifts />} />
              <Route path="/create-shift" element={<CreateShift />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
