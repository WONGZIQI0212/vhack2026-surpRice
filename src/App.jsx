import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:mId/*" element={<MainLayout />} />
        <Route path="*" element={<Navigate to="/overall/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}