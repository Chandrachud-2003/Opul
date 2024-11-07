import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  CreditCard, 
  ShoppingBag, 
  Wallet, 
  Gift, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Copy, 
  ExternalLink 
} from 'lucide-react';
import api from '../config/axios';

const categories = [
  { id: 'finance', name: 'Finance', icon: CreditCard },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag },
  { id: 'crypto', name: 'Crypto', icon: Wallet },
  { id: 'rewards', name: 'Rewards', icon: Gift },
];

interface Platform {
  _id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  benefitDescription: string;
  benefitLogline: string;
  slug: string;
}

interface Performer {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  referrals: number;
  earnings: string;
}

const topPerformers: Performer[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=32&h=32',
    verified: true,
    referrals: 156,
    earnings: '$2,450'
  },
  // Add 2 more performers for the grid
];

export function HomePage() {
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [usesToday, setUsesToday] = useState(0);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const LIMIT = 30;
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText('PROMO2024');
    setCopied(true);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setCopied(false);
    }, 3000); // Automatically close the popup after 3 seconds
  }, []);

  // Simulate fetching the number of uses today
  useEffect(() => {
    let count = 0;
    const target = 500; // Example target number
    const increment = Math.ceil(target / 100); // Increment step
    const interval = setInterval(() => {
      setUsesToday(prev => {
        if (prev + increment >= target) {
          clearInterval(interval);
          return target;
        }
        return prev + increment;
      });
    }, 50); // Adjust the speed as needed

    return () => clearInterval(interval);
  }, []);

  // Fetch platforms
  const fetchPlatforms = async (pageNum: number) => {
    try {
      const response = await api.get(`/api/platforms?page=${pageNum}&limit=${LIMIT}`);
      const newPlatforms = response.data.platforms;
      
      setPlatforms(prev => pageNum === 1 ? newPlatforms : [...prev, ...newPlatforms]);
      setHasMore(newPlatforms.length === LIMIT);
      setError(null);
    } catch (err) {
      setError('Failed to load platforms');
      console.error('Error fetching platforms:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPlatforms(1);
  }, []);

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPlatforms(nextPage);
    }
  };

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?category=${categoryId}`);
  };

  // Filter platforms by category if selected
  const filteredPlatforms = selectedCategory
    ? platforms.filter(p => p.category === selectedCategory)
    : platforms;

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-12 pb-24 text-center">
        {/* Promo Banner */}
        <div className="animate-pulse inline-block p-2 px-4 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-6">
          🎉 Limited Time: Earn double credibility points on your first 3 referrals
        </div>

        {/* Main Title */}
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Share & Earn Together
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our community of smart referrers. Share your codes, help others save, and earn rewards.
        </p>
      </header>

      {/* Top Code of the Day */}
      <section className="container mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white animate-fadeIn">
          <div className="flex items-center gap-4 mb-6">
            <TrendingUp className="w-8 h-8 animate-bounce" />
            <h2 className="text-2xl font-bold">Top Code of the Day</h2>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 animate-slideIn">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=64&h=64"
                  alt="Chase"
                  className="w-16 h-16 rounded-lg shadow-lg"
                />
                <div>
                  <h3 className="text-xl font-semibold">Chase Sapphire Preferred</h3>
                  <p className="text-white/80">60,000 Points Bonus</p>
                </div>
              </div>

              {/* Promo Code Section Inside Top Promo Card */}
              <div className="w-full md:w-auto flex flex-col items-center mt-4 md:mt-0">
                <div className="flex justify-center items-center gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      value="PROMO2024"
                      readOnly
                      className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg text-lg focus:outline-none border border-gray-200"
                    />
                    <button
                      onClick={handleCopyCode}
                      className="absolute right-2 top-2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                      aria-label="Copy Promo Code"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  {copied && (
                    <span className="text-green-600 font-medium">Copied!</span>
                  )}
                </div>

                {/* Use Now Button */}
                <Link 
                  to="https://www.example.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Use Now <ExternalLink className="w-4 h-4 ml-2" />
                </Link>

                {/* Popup Notification */}
                {showPopup && (
                  <div className="mt-2 text-green-600">
                    Promo code copied to clipboard!
                  </div>
                )}
              </div>
            </div>

            {/* User and Score */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32&h=32"
                  alt="Sarah M."
                  className="w-8 h-8 rounded-full shadow-md"
                />
                <span>Sarah M.</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>95 Score</span>
              </div>
            </div>

            {/* Uses Today Spinner */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-sm text-white/80">Uses Today:</span>
              <span className="text-lg font-bold text-yellow-300">
                {usesToday}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleCategoryClick(id)}
              className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium hover:bg-indigo-200 transition-colors"
            >
              <Icon className="w-5 h-5" />
              {name}
            </button>
          ))}
        </div>
      </section>

      {/* Available Platforms Section */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold mb-8">Popular Platforms</h2>
        
        {error && (
          <div className="text-red-600 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading platforms...</p>
          </div>
        ) : !filteredPlatforms.length ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {selectedCategory ? 'No Platforms in This Category' : 'No Platforms Available Yet'}
            </h3>
            <p className="text-gray-500">
              {selectedCategory 
                ? 'Try selecting a different category or check back later.'
                : 'Check back soon for exciting new platforms and offers!'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlatforms.map((platform) => (
              <Link
                key={platform._id}
                to={`/platform/${platform.slug}`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow transform hover:scale-105"
                onClick={() => console.log('Clicked platform:', platform.slug)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={platform.icon}
                    alt={platform.name}
                    className="w-16 h-16 rounded-lg shadow-md"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{platform.name}</h3>
                    <p className="text-indigo-600 font-medium">{platform.benefitLogline}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </section>

      {/* Top Performers */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Top Performers This Month</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {topPerformers.map((performer) => (
              <div key={performer.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow transform hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={performer.avatar}
                    alt={performer.name}
                    className="w-16 h-16 rounded-full shadow-md"
                  />
                  <div className="flex items-center gap-2">
                    <span>{performer.name}</span>
                    {performer.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{performer.referrals}</div>
                    <div className="text-sm text-gray-600">Referrals</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{performer.earnings}</div>
                    <div className="text-sm text-gray-600">Earned</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
