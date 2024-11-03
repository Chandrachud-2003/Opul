import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Search, Menu, X, User } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = false; // Replace with actual auth state

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl">ReferralHub</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/search" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </Link>
            {isLoggedIn ? (
              <Link to="/profile/me" className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32&h=32"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">Sarah</span>
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/search"
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="w-4 h-4" />
              Search
            </Link>
            {isLoggedIn ? (
              <Link
                to="/profile/me"
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32&h=32"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">Sarah</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}