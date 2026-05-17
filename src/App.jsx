import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import SetupPage from './pages/SetupPage';
import WorldPage from './pages/WorldPage';
import ProfilePage from './pages/ProfilePage';
import OnlinePage from './pages/OnlinePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/world" element={<WorldPage />} />
        <Route path="/online" element={<OnlinePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
