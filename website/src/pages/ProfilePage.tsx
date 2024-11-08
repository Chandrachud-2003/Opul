import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, TrendingUp, Users, DollarSign, ExternalLink, Copy, CheckCircle, LogOut } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import { PlusCircle } from 'lucide-react';
import { LoadingPlaceholder } from '../components/LoadingPlaceholder';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext'; // Adjust the import path as needed
import api from '../config/axios'; // Adjust the import path based on your project structure

// Type definitions
interface Platform {
  name: string;
  logo: string;
  category: string;
  benefitLogline: string;
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
        category: 'Finance',
        benefitLogline: 'Earn rewards for every referral'
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
        category: 'Finance',
        benefitLogline: 'Earn rewards for every referral'
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

  if (referralLink) {
    return (
      <a
        href={referralLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Claim Offer
      </a>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <code className="px-3 py-2 bg-gray-50 rounded-lg font-mono flex-1">
        {code}
      </code>
      <button
        onClick={() => handleCopy(code)}
        className="p-2 text-gray-600 hover:text-indigo-600 transition-colors relative group"
        aria-label={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <Copy className="w-5 h-5" />
        )}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {copied ? 'Copied!' : 'Copy code'}
        </span>
      </button>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add this handler for the "Add Referral Code" action
  const handleAddReferralCode = () => {
    navigate('/search'); // Changed from '/referrals/new' to '/search'
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Debug logs for profile ownership
        console.log('🔍 Profile Access Check:', {
          currentUser: {
            uid: user?.uid,
            email: user?.email,
          },
          requestedProfile: id,
          isSelfProfile: id === 'me' || id === user?.uid,
          timestamp: new Date().toISOString()
        });

        if (!user && id === 'me') {
          console.log('⚠️ Redirecting to auth: No user logged in');
          navigate('/auth');
          return;
        }

        const userId = id === 'me' ? user?.uid : id;
        
        const response = await api.get(`/api/users/${userId}`);
        setProfileData(response.data);

        // Log profile ownership after data is loaded
        console.log('👤 Profile Ownership Status:', {
          isOwnProfile: user?.uid === response.data.uid,
          profileData: {
            uid: response.data.uid,
            displayName: response.data.displayName,
          },
          currentUser: {
            uid: user?.uid,
            displayName: user?.displayName,
          }
        });

      } catch (err: any) {
        console.error('❌ Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <LoadingPlaceholder />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 text-center">
        <div className="container mx-auto px-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  // Add near the top of the component
  const isOwnProfile = user?.uid === profileData?.uid;
  console.log('Profile ownership check:', {
    currentUserUid: user?.uid,
    profileUid: profileData?.uid,
    isOwnProfile,
    isPremium: user?.isPremium
  });

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <img
                src={profileData.profilePicture || '/default-avatar.png'}
                alt={profileData.displayName}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <div className="flex items-center justify-center gap-2 mb-1">
                <h1 className="text-xl font-bold">{profileData.displayName}</h1>
                {profileData.isPremium && <VerifiedBadge />}
              </div>
              <div className="text-gray-600 mb-4">
                Member since {new Date(profileData.createdAt).toLocaleDateString()}
              </div>
              <div className="mb-6">
                <CredibilityScore score={profileData.credibilityScore} />
              </div>
              {user?.uid === profileData.uid && (
                <div className="space-y-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {isOwnProfile ? (
                profileData.stats ? (
                  <>
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                      <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-800">
                        <AnimatedNumber value={profileData.stats.totalReferrals || 0} />
                      </div>
                      <div className="text-sm text-gray-600">Total Referrals</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                      <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-800">
                        <AnimatedNumber value={profileData.stats.totalEarnings} prefix="$" />
                      </div>
                      <div className="text-sm text-gray-600">Total Earnings</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                      <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-800">
                        <AnimatedNumber value={profileData.stats.activeReferrals} />
                      </div>
                      <div className="text-sm text-gray-600">Active Referrals</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                      <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-800">
                        <AnimatedNumber value={profileData.stats.successRate} suffix="%" />
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2">
                    <EmptyState
                      icon={<TrendingUp />}
                      title="No Stats Yet"
                      description="Start sharing your referral codes to see your performance metrics."
                    />
                  </div>
                )
              ) : (
                // Premium Promo for non-owners
                <div className="col-span-2">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-xl text-white">
                    <h3 className="text-lg font-semibold mb-2">Unlock Premium Features</h3>
                    <p className="text-sm text-white/90 mb-4">
                      Get access to detailed statistics, performance metrics, and advanced features.
                    </p>
                    <button
                      onClick={() => navigate('/premium')}
                      className="w-full bg-white text-indigo-600 py-2 px-4 rounded-lg font-medium hover:bg-white/90 transition-colors"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Referral Codes */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Active Referral Codes</h2>
                {user?.uid === profileData.uid && (
                  <button
                    onClick={handleAddReferralCode}
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Code
                  </button>
                )}
              </div>
              
              {profileData.referralCodes?.length > 0 ? (
                <div className="space-y-4">
                  {profileData.referralCodes.map((item: any) => {
                    console.log('Rendering referral code:', {
                      id: item.id,
                      platform: item.platform.name,
                      isOwnProfile,
                      clicks: item.clicks
                    });
                    
                    return (
                      <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.platform.logo}
                              alt={item.platform.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-medium">{item.platform.name}</h3>
                              <p className="text-sm text-gray-600">{item.platform.benefitLogline}</p>
                            </div>
                          </div>
                          {/* Only show clicks for own profile */}
                          {isOwnProfile && (
                            <div className="text-right text-sm text-gray-600">
                              {item.clicks} clicks
                            </div>
                          )}
                        </div>
                        <ReferralCode code={item.code} referralLink={item.referralLink} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={<PlusCircle />}
                  title="No Referral Codes Yet"
                  description={
                    isOwnProfile
                      ? "You haven't added any referral codes yet. Add your first code to start earning rewards!"
                      : "This user hasn't shared any referral codes yet. Check back later!"
                  }
                  actionLabel={isOwnProfile ? "Add Your First Code" : undefined}
                  onAction={isOwnProfile ? handleAddReferralCode : undefined}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;