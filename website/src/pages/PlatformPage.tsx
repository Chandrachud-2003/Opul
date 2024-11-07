import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, Check, ExternalLink, Award, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import { EmptyState } from '../components/EmptyState';
import { AlertCircle, Gift } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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
  referralType: 'code' | 'link';
  getReferralSteps?: string[];
  getReferralLink?: string;
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

// Add this hardcoded data near the top of your component
const hardcodedRelatedDeals = [
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
];

interface UserReferral {
  _id: string;
  code?: string;
  referralLink?: string;
  createdAt: Date;
}

export function PlatformPage() {
  const { id } = useParams<{ id: string }>();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCodes, setTotalCodes] = useState(0);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReferrals, setUserReferrals] = useState<UserReferral[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReferral, setEditingReferral] = useState<UserReferral | null>(null);

  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/platforms/slug/${id}`);
        console.log('Platform response:', response.data);
        
        if (response.data.platform) {
          setPlatform(response.data.platform);
          setReferralCodes(response.data.referralCodes || []);
          setHasMore(response.data.hasMore || false);
          setTotalCodes(response.data.total || 0);
        } else {
          setError('Platform not found');
        }
      } catch (err) {
        console.error('Error fetching platform:', err);
        setError('Failed to load platform details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlatformData();
    }
  }, [id]);

  useEffect(() => {
    const fetchUserReferrals = async () => {
      if (!user || !platform) return;
      
      try {
        const token = await user.getIdToken();
        const response = await api.get(`/api/referrals/user/${platform._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserReferrals(response.data.referrals);
      } catch (error) {
        console.error('Error fetching user referrals:', error);
      }
    };

    if (platform) {
      fetchUserReferrals();
    }
  }, [user, platform]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleReferralSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const referralValue = formData.get('referralValue')?.toString().trim() || '';

    if (!user) {
      navigate('/auth', { 
        state: { 
          message: 'Please create an account to share your referral code/link',
          returnPath: `/platform/${id}`
        } 
      });
      return;
    }

    // Check referral limit
    if (userReferrals.length >= 2 && !isEditing) {
      setSubmitError('You can only have 2 active referrals per platform');
      setIsSubmitting(false);
      return;
    }

    // Validate and submit logic...
    try {
      const endpoint = isEditing ? 
        `/api/referrals/${editingReferral?._id}` : 
        '/api/referrals';

      const method = isEditing ? 'PUT' : 'POST';

      const apiMethod = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
      if (!platform) return;
      
      // Get platform validation rules
      const platformResponse = await api.get(`/api/platforms/${platform._id}/validation`);
      const validationRules = platformResponse.data.validation;

      if (platform.referralType === 'link') {
        // Basic URL validation
        try {
          new URL(referralValue);
        } catch {
          setSubmitError('Please enter a valid URL');
          setIsSubmitting(false);
          return;
        }

        // Platform-specific link validation
        if (validationRules?.link?.pattern) {
          const regex = new RegExp(validationRules.link.pattern);
          if (!regex.test(referralValue)) {
            setSubmitError(validationRules.link.invalidMessage || 'Invalid referral link format');
            setIsSubmitting(false);
            return;
          }
        }
      }

      const response = await api[apiMethod](endpoint, {
        platformId: platform._id,
        userId: user.uid,
        referralValue,
        type: platform.referralType
      });

      if (response.data.success) {
        toast.success(isEditing ? 'Referral updated successfully!' : 'Referral submitted successfully!');
        // Refresh user referrals
        const updatedReferrals = await api.get(`/api/referrals/user/${platform._id}`);
        setUserReferrals(updatedReferrals.data.referrals);
        setIsEditing(false);
        setEditingReferral(null);
      }
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Failed to submit referral');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading platform details...</p>
        </div>
      </div>
    );
  }

  if (error || !platform) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center text-red-600">
          <p>{error || 'Platform not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Platform Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={platform.icon}
                  alt={platform.name}
                  className="w-24 h-24 rounded-xl shadow-sm"
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

            {/* Referral Codes Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Available Referral Codes</h2>
              {referralCodes.length === 0 ? (
                <EmptyState
                  icon={<Gift className="w-12 h-12 text-gray-400" />}
                  title="No Referral Codes Yet"
                  description="Be the first to share your referral code for this platform!"
                />
              ) : (
                <div className="space-y-4">
                  {referralCodes.map((code) => (
                    <div key={code._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={code.userId.profilePicture || '/default-avatar.png'}
                            alt={code.userId.displayName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{code.userId.displayName}</span>
                              {(code.userId.credibilityScore ?? 0) >= 80 && (
                                <Award className="w-4 h-4 text-indigo-600" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              Score: {code.userId.credibilityScore}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {code.clicks} clicks
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* How to Claim */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">How to Claim</h3>
              <ol className="space-y-3">
                {platform.claimSteps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Add Your Referral Code/Link */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {isEditing ? 'Edit Your Referral' : 'Add Your Referral'}
              </h3>

              {user && userReferrals.length > 0 && (
                <div className="mb-6 space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Your Active Referrals:</h4>
                  {userReferrals.map((referral) => (
                    <div key={referral._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        {referral.code || referral.referralLink}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditingReferral(referral);
                          }}
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await api.delete(`/api/referrals/${referral._id}`);
                              const updatedReferrals = userReferrals.filter(r => r._id !== referral._id);
                              setUserReferrals(updatedReferrals);
                              toast.success('Referral deleted successfully!');
                            } catch (error) {
                              toast.error('Failed to delete referral');
                            }
                          }}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(!user || userReferrals.length < 2 || isEditing) && (
                <form onSubmit={handleReferralSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      name="referralValue"
                      type={platform.referralType === 'code' ? 'text' : 'url'}
                      defaultValue={editingReferral?.code || editingReferral?.referralLink || ''}
                      placeholder={
                        platform.referralType === 'code'
                          ? 'Enter your referral code'
                          : 'Enter your referral link'
                      }
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    {submitError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <span className="inline-block w-4 h-4">⚠️</span>
                        {submitError}
                      </p>
                    )}
                    {submitSuccess && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                        <span className="inline-block w-4 h-4">✅</span>
                        Referral submitted successfully!
                      </p>
                    )}
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : isEditing ? 'Update Referral' : 'Submit Referral'}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditingReferral(null);
                        }}
                        className="mt-2 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              )}

              {user && userReferrals.length >= 2 && !isEditing && (
                <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                  You have reached the maximum number of referrals for this platform (2).
                  You can edit or delete existing referrals above.
                </div>
              )}
            </div>

            {/* Premium Banner */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
              <p className="text-sm text-white/90 mb-4">
                Get verified status and rank higher in search results
              </p>
              <Link
                to="/premium"
                className="block w-full bg-white text-indigo-600 text-center py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Related Deals */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Related Deals</h3>
              <div className="space-y-4">
                {hardcodedRelatedDeals.map((deal) => (
                  <Link
                    key={deal.id}
                    to={`/platform/${deal.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={deal.logo}
                      alt={deal.name}
                      className="w-12 h-12 rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium">{deal.name}</h4>
                      <p className="text-sm text-indigo-600">{deal.benefit}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
