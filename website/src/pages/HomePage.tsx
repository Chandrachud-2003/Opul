import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, CreditCard, ShoppingBag, Wallet, Gift, Award, TrendingUp, CheckCircle, Copy } from 'lucide-react';

const categories = [
  { id: 'finance', name: 'Finance', icon: CreditCard },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag },
  { id: 'crypto', name: 'Crypto', icon: Wallet },
  { id: 'rewards', name: 'Rewards', icon: Gift },
];

const platforms = [
  {
    id: 'chase-sapphire',
    name: 'Chase Sapphire',
    category: 'finance',
    logo: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=64&h=64',
    deal: '60,000 Points Bonus',
    clicks: 1234,
    topUser: {
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32&h=32',
      score: 95
    }
  },
  {
    id: 'amex-platinum',
    name: 'Amex Platinum',
    category: 'finance',
    logo: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=64&h=64',
    deal: '150,000 Points Bonus',
    clicks: 987,
    topUser: {
      name: 'John D.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=32&h=32',
      score: 88
    }
  },
  // Add more platforms...
];

const topPerformers = [
  {
    id: 1,
    name: 'Sarah M.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
    score: 95,
    referrals: 234,
    earnings: '$4,320',
    verified: true
  },
  {
    id: 2,
    name: 'John D.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
    score: 88,
    referrals: 189,
    earnings: '$3,150',
    verified: true
  },
  // Add more performers...
];

export function HomePage() {
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText('PROMO2024');
    setCopied(true);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setCopied(false);
    }, 3000); // Automatically close the popup after 3 seconds
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-12 pb-24 text-center">
        <div className="animate-pulse inline-block p-2 px-4 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-8">
          🎉 Limited Time: Earn double credibility points on your first 3 referrals
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Share & Earn Together
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Join our community of smart referrers. Share your codes, help others save, and earn rewards.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Copy className="w-5 h-5" />
            {copied ? 'Copied!' : 'Copy Promo Code'}
          </button>
        </div>
        {showPopup && (
          <div className="mt-4 text-green-600">
            Promo code copied to clipboard!
          </div>
        )}
      </header>

      {/* Top Code of the Day */}
      <section className="container mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Top Code of the Day</h2>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=64&h=64"
                alt="Chase"
                className="w-16 h-16 rounded-lg"
              />
              <div>
                <h3 className="text-xl font-semibold">Chase Sapphire Preferred</h3>
                <p className="text-white/80">60,000 Points Bonus</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32&h=32"
                  alt="Sarah M."
                  className="w-8 h-8 rounded-full"
                />
                <span>Sarah M.</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>95 Score</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map(({ id, name, icon: Icon }) => (
            <Link
              key={id}
              to={`/search?category=${id}`}
              className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium hover:bg-indigo-200 transition-colors"
            >
              <Icon className="w-5 h-5" />
              {name}
            </Link>
          ))}
        </div>
      </section>

      {/* Available Platforms */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold mb-8">Popular Platforms</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => (
            <Link
              key={platform.id}
              to={`/platform/${platform.id}`}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={platform.logo}
                  alt={platform.name}
                  className="w-16 h-16 rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{platform.name}</h3>
                  <p className="text-indigo-600 font-medium">{platform.deal}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Performers */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Top Performers This Month</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {topPerformers.map((performer) => (
              <div key={performer.id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={performer.avatar}
                    alt={performer.name}
                    className="w-16 h-16 rounded-full"
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