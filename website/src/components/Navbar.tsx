import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Search, Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Define SearchForm as a separate component outside of Navbar
interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  className?: string;
}

const SearchForm: React.FC<SearchFormProps> = React.memo(({ searchQuery, setSearchQuery, onSearch, className = "" }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch();
  };

  const handleIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search platforms..."
        className="flex-grow pl-4 pr-2 py-2 rounded-l-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-r-full hover:bg-indigo-700 transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
});

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // useCallback to memoize handleSearch
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [navigate, searchQuery]);

  const AuthButton = () => {
    if (user) {
      return (
        <Link
          to={`/profile/${user.uid}`}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'Profile'} 
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <User className="w-6 h-6" />
          )}
          <span className="truncate max-w-[120px]">
            {user.displayName?.split('@')[0] || 'Profile'}
          </span>
        </Link>
      );
    }

    return (
      <Link
        to="/auth"
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Sign In
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl">ReferralHub</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
            <SearchForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              className="max-w-2xl w-full mx-8"
            />
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <SearchForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={() => {
                handleSearch();
                setIsMenuOpen(false);
              }}
              className="w-full"
            />
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
