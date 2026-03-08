import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AssistantPage from './pages/AssistantPage';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
