import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Award, TrendingUp, Users, DollarSign, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

// Type definitions
interface Platform {
  name: string;
  logo: string;
  category: string;
}

interface ReferralCodeData {
  id: number;
  platform: Platform;
  code: string;
  clicks: number;
  earnings: string;
  success: string;
  referralLink: string;
}

interface VerifiedBadgeProps {
  className?: string;
}

interface UserStats {
  totalReferrals: number;
  totalEarnings: number;
  activeReferrals: number;
  successRate: number;
}

interface UserData {
  id: string;
  name: string;
  avatar: string;
  credibilityScore: number;
  verified: boolean;
  joinedDate: string;
  stats: UserStats;
  referralCodes: ReferralCodeData[];
}

// Animation component props
interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

interface CredibilityScoreProps {
  score: number;
}

interface ReferralCodeProps {
  code: string;
  referralLink: string;
}

const userData: UserData = {
  id: '123',
  name: 'Sarah Mitchell',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128',
  credibilityScore: 95,
  verified: true,
  joinedDate: 'January 2024',
  stats: {
    totalReferrals: 234,
    totalEarnings: 4320,
    activeReferrals: 12,
    successRate: 98
  },
  referralCodes: [
    {
      id: 1,
      platform: {
        name: 'Chase Sapphire Preferred',
        logo: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=64&h=64',
        category: 'Finance'
      },
      code: 'SARAHM2024',
      clicks: 156,
      earnings: '$890',
      success: '98%',
      referralLink: 'https://example.com/ref/SARAHM2024'
    },
    {
      id: 2,
      platform: {
        name: 'Amex Platinum',
        logo: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=64&h=64',
        category: 'Finance'
      },
      code: 'SARAHM-AMEX',
      clicks: 98,
      earnings: '$650',
      success: '95%',
      referralLink: 'https://example.com/ref/SARAHM-AMEX'
    }
  ]
};

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, prefix = '', suffix = '' }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 100, // Reduced from 200
    config: { 
      mass: 1, 
      tension: 180, // Increased from 20
      friction: 12  // Slightly increased from 10 for smoother end
    }
  });

  return (
    <animated.div>
      {prefix}
      <animated.span>
        {number.to(n => Math.floor(n).toLocaleString())}
      </animated.span>
      {suffix}
    </animated.div>
  );
};


const CredibilityScore: React.FC<CredibilityScoreProps> = ({ score }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    if (score >= 70) return 'bg-gradient-to-r from-green-500 to-teal-500';
    if (score >= 50) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  return (
    <div className={`relative overflow-hidden rounded-lg p-4 text-white ${getScoreColor(score)}`}>
      {/* Shimmer effect */}
      <div 
        className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" 
        style={{ 
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite linear'
        }} 
      />
      
      <div className="relative z-10">
        <div className="text-lg font-medium mb-1">Credibility Score</div>
        <div className="text-3xl font-bold">
          <AnimatedNumber 
            value={score} 
            suffix="%" 
          />
        </div>
      </div>
    </div>
  );
};

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="relative w-5 h-5">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-400 rounded-full" />
        
        {/* Custom checkmark */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10 w-full h-full p-1"
        >
          <path
            d="M8.5 12.5L10.5 14.5L15.5 9.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

const ReferralCode: React.FC<ReferralCodeProps> = ({ code, referralLink }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-4">
      <code className="flex-1 bg-gray-50 p-3 rounded-lg font-mono">
        {code}
      </code>
      <button
        onClick={() => handleCopy(code)}
        className="p-3 text-gray-600 hover:text-indigo-600 transition-colors relative group"
      >
        {copied ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <Copy className="w-5 h-5" />
        )}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? 'Copied!' : 'Copy code'}
        </span>
      </button>
      <a
        href={referralLink}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 text-gray-600 hover:text-indigo-600 transition-colors relative group"
      >
        <ExternalLink className="w-5 h-5" />
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Open link
        </span>
      </a>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isOwnProfile = id === 'me';

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <div className="flex items-center justify-center gap-2 mb-1">
                <h1 className="text-xl font-bold">{userData.name}</h1>
                {userData.verified && <VerifiedBadge />}
              </div>
              <div className="text-gray-600 mb-4">
                Member since {userData.joinedDate}
              </div>
              <div className="mb-6">
                <CredibilityScore score={userData.credibilityScore} />
              </div>
              {isOwnProfile && (
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Edit Profile
                </button>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  <AnimatedNumber value={userData.stats.totalReferrals} />
                </div>
                <div className="text-sm text-gray-600">Total Referrals</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  <AnimatedNumber value={userData.stats.totalEarnings} prefix="$" />
                </div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  <AnimatedNumber value={userData.stats.activeReferrals} />
                </div>
                <div className="text-sm text-gray-600">Active Referrals</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  <AnimatedNumber value={userData.stats.successRate} suffix="%" />
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Referral Codes */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-6">Active Referral Codes</h2>
              <div className="space-y-4">
                {userData.referralCodes.map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.platform.logo}
                          alt={item.platform.name}
                          className="w-12 h-12 rounded-lg"
                        />
                        <div>
                          <h3 className="font-medium">{item.platform.name}</h3>
                          <div className="text-sm text-gray-600">
                            {item.platform.category}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-medium">
                          {item.earnings}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.clicks} clicks • {item.success} success
                        </div>
                      </div>
                    </div>
                    <ReferralCode code={item.code} referralLink={item.referralLink} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;