import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, Check, ExternalLink, Award, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import { EmptyState } from '../components/EmptyState';
import { AlertCircle, Gift } from 'lucide-react';

// Type Definitions
interface User {
  name: string;
  avatar: string;
  score: number;
  verified: boolean;
  type: 'code' | 'link';
}

interface TopCode {
  id: number;
  user: User;
  code: string;
  link: string;
  clicks: number;
  success: string;
  type: 'code' | 'link';
}

interface RelatedDeal {
  id: string;
  name: string;
  logo: string;
  benefit: string;
}

interface PlatformData {
  id: string;
  name: string;
  logo: string;
  category: string;
  benefit: string;
  description: string;
  steps: string[];
  topCodes: TopCode[];
  relatedDeals: RelatedDeal[];
}

// Update interfaces to match backend data
interface ReferralCode {
  _id: string;
  code?: string;
  referralLink?: string;
  clicks: number;
  status: string;
  userId: {
    displayName: string;
    profilePicture: string;
    credibilityScore?: number;
  };
}

interface Platform {
  _id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  benefitDescription: string;
  benefitLogline: string;
  claimSteps: string[];
  relatedDeals: { id: string; name: string; logo: string; benefit: string; }[];
}

// Initial Platform Data
const initialPlatformData: PlatformData = {
  id: 'chase-sapphire',
  name: 'Chase Sapphire Preferred',
  logo: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=128&h=128',
  category: 'Finance',
  benefit: '60,000 Points Bonus',
  description:
    'Earn 60,000 bonus points after you spend $4,000 on purchases in the first 3 months from account opening.',
  steps: [
    'Apply using the referral link',
    'Get approved for the card',
    'Spend $4,000 on purchases in first 3 months',
    'Receive 60,000 bonus points'
  ],
  topCodes: [
    {
      id: 1,
      user: {
        name: 'Sarah M.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
        score: 95,
        verified: true,
        type: 'code'
      },
      code: 'SARAHM2024',
      clicks: 234,
      success: '98%',
      type: 'code',
      link: 'https://www.example.com'
    },
    {
      id: 2,
      user: {
        name: 'John D.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
        score: 88,
        verified: true,
        type: 'code'
      },
      code: 'JOHND2024',
      clicks: 189,
      success: '95%',
      type: 'code',
      link: 'https://www.example.com'
    }
  ],
  relatedDeals: [
    {
      id: 'amex-platinum',
      name: 'Amex Platinum',
      logo: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=64&h=64',
      benefit: '150,000 Points Bonus'
    },
    {
      id: 'citi-premier',
      name: 'Citi Premier',
      logo: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=64&h=64',
      benefit: '60,000 Points Bonus'
    }
  ]
};

export function PlatformPage() {
  const { id } = useParams<{ id: string }>();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCodes, setTotalCodes] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'code' | 'link'>('code');
  const [inputValue, setInputValue] = useState('');
  const [flagged, setFlagged] = useState(false);

  // Fetch platform and referral codes data
  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        setLoading(true);
        console.log('Fetching platform with slug:', id);
        const response = await api.get(`/api/platforms/slug/${id}`);
        console.log('Platform response:', response.data);
        setPlatform(response.data.platform);
        setReferralCodes(response.data.referralCodes);
        setHasMore(response.data.hasMore);
        setTotalCodes(response.data.total);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching platform:', err.response || err);
        setError(err.response?.data?.message || 'Failed to load platform details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlatformData();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Error state
  if (error || !platform) {
    return (
      <div className="pt-24 pb-16">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-red-400" />}
          title="Error Loading Platform"
          description={error || 'Platform not found'}
          action={
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Return Home
            </Link>
          }
        />
      </div>
    );
  }

  // Render referral codes list
  const renderReferralCodes = () => {
    if (referralCodes.length === 0) {
      return (
        <EmptyState
          icon={<Gift className="w-12 h-12 text-gray-400" />}
          title="No Referral Codes Yet"
          description="Be the first to share your referral code for this platform!"
        />
      );
    }

    return (
      <div className="space-y-4">
        {referralCodes.map((item) => (
          <div key={item._id} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.userId.profilePicture || '/default-avatar.png'}
                  alt={item.userId.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.userId.displayName}</span>
                    {(item.userId.credibilityScore ?? 0) >= 80 && (
                      <Award className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Score: {item.userId.credibilityScore || 0}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {item.clicks} clicks
              </div>
            </div>
            
            {/* Code or Link display */}
            <div className="flex items-center gap-4">
              {item.code ? (
                <code className="flex-1 bg-gray-50 p-3 rounded-lg font-mono">
                  {item.code}
                </code>
              ) : (
                <a
                  href={item.referralLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-50 p-3 rounded-lg font-mono text-indigo-600 hover:underline"
                >
                  {item.referralLink}
                </a>
              )}
              <button
                onClick={() => copyCode(item.code || item.referralLink || '', item._id)}
                className="p-3 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {copiedId === item._id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              {item.code && (
                <a
                  href={item.referralLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Show More Button */}
        {hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={() => {/* Implement load more logic */}}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Show More ({totalCodes - referralCodes.length} remaining)
            </button>
          </div>
        )}
      </div>
    );
  };

  const copyCode = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(e.target.value as 'code' | 'link');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Platform Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={platform.icon}
                  alt={platform.name}
                  className="w-24 h-24 rounded-xl"
                />
                <div>
                  <div className="text-sm text-indigo-600 font-medium mb-1">
                    {platform.category}
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{platform.name}</h1>
                  <p className="text-gray-600">{platform.description}</p>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-indigo-600 font-medium mb-2">
                  <Info className="w-5 h-5" />
                  Current Offer
                </div>
                <p className="text-lg font-semibold">{platform.benefitDescription}</p>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">How to Claim</h2>
              <div className="space-y-4">
                {platform.claimSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-medium">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Referral Codes */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-6">Top Referral Codes</h2>
              {renderReferralCodes()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Add Your Referral Code/Link */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-6">Add Your Referral Code or Link</h2>
              <form onSubmit={handleSubmit}>
                {/* Selection for Code or Link */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="code"
                      checked={selectedType === 'code'}
                      onChange={handleTypeChange}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Code</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="link"
                      checked={selectedType === 'link'}
                      onChange={handleTypeChange}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Link</span>
                  </label>
                </div>
                {/* Input Field */}
                <div className="mb-4">
                  <input
                    type={selectedType === 'code' ? 'text' : 'url'}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={selectedType === 'code' ? 'Enter your referral code' : 'Enter your referral link'}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                {/* Error Message */}
                {error && <p className="text-red-600 mb-4">{error}</p>}
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Add Referral'}
                </button>
                {/* Flagged Message */}
                {flagged && (
                  <p className="text-yellow-600 mt-4">
                    Your profile has been flagged due to invalid referral link/code.
                  </p>
                )}
              </form>
            </div>

            {/* Premium Banner */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-xl text-white">
              <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
              <p className="mb-4 text-white/90">
                Get verified status and rank higher in search results.
              </p>
              <a
                href="/premium"
                className="block w-full bg-white text-indigo-600 text-center py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Learn More
              </a>
            </div>

            {/* Related Deals */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-6">Related Deals</h2>
              <div className="space-y-4">
                {platform.relatedDeals.slice(0, 2).map((deal) => (
                  <Link
                    key={deal.id}
                    to={`/platform/${deal.id}`}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={deal.logo}
                      alt={deal.name}
                      className="w-12 h-12 rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium">{deal.name}</h3>
                      <p className="text-sm text-indigo-600">{deal.benefit}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Premium Banner */}
            {/* Note: This section has been moved above Related Deals */}
          </div>
        </div>
      </div>
    </div>
  );
}
