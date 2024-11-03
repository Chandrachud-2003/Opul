import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { PlatformPage } from './pages/PlatformPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { PremiumPage } from './pages/PremiumPage';
import { SearchPage } from './pages/SearchPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/platform/:slug" element={<PlatformPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;