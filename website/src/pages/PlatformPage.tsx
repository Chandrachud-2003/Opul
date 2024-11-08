import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, Check, ExternalLink, Award, Info, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import { EmptyState } from '../components/EmptyState';
import { AlertCircle, Gift } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ReferralFeedbackModal } from '../components/ReferralFeedbackModal';

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
    uid: string;
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
  websiteUrl: string;
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

// Add URL validation helper
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      // Prevent IP addresses in URLs
      !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/.test(parsed.hostname) &&
      // Prevent unicode lookalikes
      !/[\u0080-\uffff]/.test(url)
    );
  } catch {
    return false;
  }
};

interface FormValues {
  referralValue: string;
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
  const [userReferrals, setUserReferrals] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReferral, setEditingReferral] = useState<any>(null);
  const [validationError, setValidationError] = useState<string>('');
  const [validationRules, setValidationRules] = useState<any>(null);
  const [referralValue, setReferralValue] = useState('');
  const [availableReferrals, setAvailableReferrals] = useState<any[]>([]);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  // Add state for copy modal
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<any>(null);

  // Add state for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [referralToDelete, setReferralToDelete] = useState<ReferralCode | null>(null);

  // Add these state variables
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Add edit modal handler
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState('');

  // Add new state for success
  const [editSuccess, setEditSuccess] = useState(false);

  // Add this state for related platforms
  const [relatedPlatforms, setRelatedPlatforms] = useState<Array<{
    slug: string;
    name: string;
    icon: string;
    benefitLogline: string;
  }>>([]);

  // Inside your component, add this state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Add these states to your component
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [lastClickedReferral, setLastClickedReferral] = useState<ReferralCode | null>(null);

  // Function to handle copy and modal
  const handleCopyCode = (code: any) => {
    navigator.clipboard.writeText(code.code || code.referralLink);
    setSelectedCode(code);
    setShowCopyModal(true);
  };

  // Add handler for delete button click
  const handleDeleteClick = (referral: ReferralCode) => {
    setReferralToDelete(referral);
    setDeleteModalOpen(true);
  };

  // Add delete handler
  const handleConfirmDelete = async () => {
    if (!referralToDelete) return;

    setIsDeleting(true);
    try {
      const response = await api.delete(`/api/referrals/${referralToDelete._id}`);
      
      if (response.data.success) {
        setDeleteSuccess(true);
        toast.success('Referral code deleted successfully');
        
        // Remove the deleted code from the local state
        setUserReferrals(prevReferrals => 
          prevReferrals.filter(r => r._id !== referralToDelete._id)
        );

        // Close modal after short delay
        setTimeout(() => {
          setDeleteModalOpen(false);
          setReferralToDelete(null);
          setDeleteSuccess(false);
          
          // Reload the platform data to ensure everything is in sync
          fetchPlatformData();
        }, 1500);
      }
    } catch (error) {
      console.error('Error deleting referral:', error);
      toast.error('Failed to delete referral code');
    } finally {
      setIsDeleting(false);
    }
  };

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

  useEffect(() => {
    if (id) {
      fetchPlatformData();
      fetchRelatedPlatforms();
    }
  }, [id]);

  useEffect(() => {
    const fetchUserReferrals = async () => {
      if (!user || !id) return;
      
      try {
        const response = await api.get(`/api/referrals/user/${id}`);
        setUserReferrals(response.data.referrals);
      } catch (error) {
        console.error('Error fetching user referrals:', error);
      }
    };

    fetchUserReferrals();
  }, [user, id]);

  useEffect(() => {
    const fetchValidationRules = async () => {
      if (!platform?._id) return;
      try {
        const response = await api.get(`/api/platforms/${platform._id}/validation`);
        setValidationRules(response.data.validation);
      } catch (error) {
        console.error('Error fetching validation rules:', error);
      }
    };

    fetchValidationRules();
  }, [platform?._id]);

  useEffect(() => {
    const fetchAvailableReferrals = async () => {
      if (!id) return;
      
      try {
        setIsLoadingReferrals(true);
        const response = await api.get(`/api/referrals/platform/${id}`, {
          params: { page: 1, limit: LIMIT }
        });
        setAvailableReferrals(response.data.referralCodes);
        setHasMore(response.data.total > response.data.referralCodes.length);
      } catch (error) {
        console.error('Error fetching available referrals:', error);
      } finally {
        setIsLoadingReferrals(false);
      }
    };

    fetchAvailableReferrals();
  }, [id]);

  useEffect(() => {
    const fetchReferralCodes = async () => {
      if (!id) return;
      
      try {
        setIsLoadingReferrals(true);
        const response = await api.get(`/api/referrals/platform/${id}`, {
          params: { page: 1, limit: LIMIT }
        });
        setReferralCodes(response.data.referralCodes);
        setHasMore(response.data.total > response.data.referralCodes.length);
      } catch (error) {
        console.error('Error fetching referral codes:', error);
      } finally {
        setIsLoadingReferrals(false);
      }
    };

    fetchReferralCodes();
  }, [id]);

  const validateReferralValue = (value: string): boolean => {
    if (!platform || !validationRules) return true;
    
    if (platform.referralType === 'link') {
      const linkRules = validationRules.link;
      if (!linkRules) return true;

      // Check pattern if exists
      if (linkRules.pattern) {
        const regex = new RegExp(linkRules.pattern);
        if (!regex.test(value)) {
          setValidationError(linkRules.invalidMessage);
          return false;
        }
      }
    }
    
    setValidationError('');
    return true;
  };

  const handleReferralSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      if (!id) {
        throw new Error('Platform slug not found');
      }

      const response = await api.post('/api/referrals', {
        platformSlug: id,
        referralValue,
        type: platform?.referralType
      });

      setSubmitSuccess(true);
      setReferralValue('');
      
      // Refresh user referrals
      const updatedReferrals = [...userReferrals, response.data.referral];
      setUserReferrals(updatedReferrals);
      
      toast.success('Referral submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting referral:', error);
      setSubmitError(error.response?.data?.message || 'Failed to submit referral');
      toast.error('Failed to submit referral');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to load more referrals
  const loadMoreReferrals = async () => {
    try {
      const nextPage = page + 1;
      const response = await api.get(`/api/referrals/platform/${id}`, {
        params: { page: nextPage, limit: LIMIT }
      });
      
      setReferralCodes(prev => [...prev, ...response.data.referralCodes]);
      setHasMore(response.data.total > referralCodes.length + response.data.referralCodes.length);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more referrals:', error);
      toast.error('Failed to load more referrals');
    }
  };

  // Add edit modal handler
  const handleEditClick = (referral: ReferralCode) => {
    setEditValue(referral.code || referral.referralLink || '');
    setEditingReferral(referral);
    setIsEditModalOpen(true);
  };

  // Add save handler
  const handleSaveEdit = async () => {
    if (!editingReferral) return;
    
    setIsEditing(true);
    setEditError('');
    setEditSuccess(false);

    try {
      if (platform?.referralType === 'link' && !isValidUrl(editValue)) {
        setEditError('Please enter a valid URL');
        return;
      }

      const response = await api.put(`/api/referrals/${editingReferral._id}`, {
        referralValue: editValue,
        type: platform?.referralType
      });

      if (response.data.success) {
        setEditSuccess(true);
        toast.success('Referral updated successfully');
        
        // Close modal and reload data after short delay
        setTimeout(() => {
          setIsEditModalOpen(false);
          fetchPlatformData();
          setEditSuccess(false);
        }, 1500);
      }
    } catch (error: any) {
      setEditError(error.response?.data?.message || 'Failed to update referral');
      toast.error('Failed to update referral');
    } finally {
      setIsEditing(false);
    }
  };

  // Add this function to fetch related platforms
  const fetchRelatedPlatforms = async () => {
    try {
      const response = await api.get(`/api/platforms/${id}/related`);
      setRelatedPlatforms(response.data.relatedPlatforms);
    } catch (error) {
      console.error('Error fetching related platforms:', error);
    }
  };

  // Replace the RelatedDeals component with this updated version
  const RelatedDeals = () => {
    // If no related platforms, don't render anything
    if (!relatedPlatforms.length) {
      return null;
    }

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Related Deals</h3>
        <div className="space-y-4">
          {relatedPlatforms.map((platform) => (
            <Link
              key={platform.slug}
              to={`/platform/${platform.slug}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <img
                src={platform.icon}
                alt={platform.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                  {platform.name}
                </h4>
                <p className="text-sm text-indigo-600 truncate">
                  {platform.benefitLogline}
                </p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg] group-hover:text-indigo-600 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // Add this function to handle external navigation
  const handleExternalNavigation = (code: ReferralCode, url: string) => {
    setLastClickedReferral(code);
    window.open(url, '_blank');
    // Show feedback modal after a short delay to ensure the new tab has opened
    setTimeout(() => setShowFeedbackModal(true), 500);
  };

  // Add this function to handle feedback
  const handleFeedback = (feedback: 'success' | 'failure' | 'pending') => {
    // Future implementation of feedback handling will go here
    setShowFeedbackModal(false);
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
              {isLoadingReferrals ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : referralCodes.length === 0 ? (
                <EmptyState
                  icon={<Gift className="w-12 h-12 text-gray-400" />}
                  title="No Referral Codes Yet"
                  description="Be the first to share your referral code for this platform!"
                />
              ) : (
                <div className="space-y-4">
                  {referralCodes.map((code) => (
                    <div key={code._id} className="border rounded-lg p-4 hover:border-indigo-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/profile/${code.userId?.uid || ''}`}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                            onClick={(e) => {
                              if (!code.userId?.uid) {
                                e.preventDefault();
                                console.error('User ID is undefined:', {
                                  codeId: code._id,
                                  userId: code.userId,
                                  fullCode: code
                                });
                              }
                            }}
                          >
                            <img
                              src={code.userId.profilePicture || '/default-avatar.png'}
                              alt={code.userId.displayName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {code.userId.displayName}
                              </div>
                              {/* Only show score for own profile or if premium */}
                              {(user?.uid === code.userId.uid || user?.isPremium) && (
                                <div className="text-sm text-gray-500">
                                  {code.userId.credibilityScore}% Credibility
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                        
                        {/* Hide clicks unless own profile */}
                        {user?.uid === code.userId.uid && (
                          <div className="text-sm text-gray-500">
                            {code.clicks} clicks
                          </div>
                        )}
                        
                        {platform?.referralType === 'link' ? (
                          <a
                            href={code.referralLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.preventDefault();
                              const targetUrl = code.referralLink || platform?.websiteUrl;
                              if (targetUrl) {
                                handleExternalNavigation(code, targetUrl);
                              }
                            }}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Claim
                          </a>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 bg-gray-100 rounded font-mono text-sm">
                              {code.code}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyCode(code)}
                                className="p-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                                title="Copy Code"
                              >
                                <Copy className="w-5 h-5" />
                              </button>
                              <a
                                href={platform.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleExternalNavigation(code, platform.websiteUrl);
                                }}
                                className="p-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                                title="Go to Website"
                              >
                                <ExternalLink className="w-5 h-5" />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Copy Success Modal */}
          {showCopyModal && selectedCode && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
                <button
                  onClick={() => setShowCopyModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="text-center">
                  <img
                    src={platform?.icon}
                    alt={platform?.name}
                    className="w-16 h-16 rounded-lg mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{platform?.benefitLogline}</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg my-4">
                    <p className="text-sm text-gray-600 mb-2">Your promo code:</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-lg">{selectedCode.code}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedCode.code || selectedCode.referralLink);
                          setCopiedCode(selectedCode.code || selectedCode.referralLink);
                          setTimeout(() => setCopiedCode(null), 2000); // Reset after 2 seconds
                          toast.success('Copied to clipboard!');
                        }}
                        className="p-1.5 text-indigo-600 hover:text-indigo-700 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedCode === (selectedCode.code || selectedCode.referralLink) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <a
                    href={platform?.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleExternalNavigation(selectedCode, platform.websiteUrl);
                      setShowCopyModal(false); // Close the copy modal after navigation
                    }}
                    className="block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
                  >
                    Go to Website
                  </a>
                </div>
              </div>
            </div>
          )}

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
                {userReferrals.length > 0 ? 'Your Referrals' : 'Add Your Referral'}
              </h3>

              {user && userReferrals.length > 0 ? (
                <div className="space-y-4">
                  {userReferrals.map((referral) => (
                    <div key={referral._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        {referral.code || referral.referralLink}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(referral)}
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(referral)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleReferralSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      name="referralValue"
                      type={platform?.referralType === 'code' ? 'text' : 'url'}
                      placeholder={
                        platform?.referralType === 'code'
                          ? 'Enter your referral code'
                          : 'Enter your referral link'
                      }
                      onChange={(e) => {
                        setReferralValue(e.target.value);
                        validateReferralValue(e.target.value);
                      }}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    {validationError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <span className="inline-block w-4 h-4">⚠️</span>
                        {validationError}
                      </p>
                    )}
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
                      disabled={isSubmitting || (platform?.referralType === 'link' && !isValidUrl(referralValue))}
                      className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Referral'}
                    </button>
                  </div>
                </form>
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
            <RelatedDeals />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && referralToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative animate-fade-in">
            {deleteSuccess ? (
              // Success state
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-600">Successfully Deleted!</h3>
                <p className="text-sm text-gray-600 mt-2">The referral code has been removed.</p>
              </div>
            ) : (
              // Confirmation state
              <>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  disabled={isDeleting}
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">Delete Referral Code?</h3>
                  
                  <div className="text-sm text-gray-600 mb-6 space-y-2">
                    <p>Are you sure you want to delete this referral?</p>
                    <p className="font-mono bg-gray-50 p-2 rounded">
                      {referralToDelete.code || referralToDelete.referralLink}
                    </p>
                    <p className="text-red-600">
                      This action cannot be undone. All associated analytics and tracking data will be permanently removed.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeleteModalOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </span>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingReferral && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            {editSuccess ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Successfully Updated!</h3>
                <p className="text-gray-600">Your referral has been updated.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Referral</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {platform?.referralType === 'link' ? 'Referral Link' : 'Referral Code'}
                    </label>
                    <input
                      type={platform?.referralType === 'link' ? 'url' : 'text'}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={platform?.referralType === 'link' ? 'Enter referral link' : 'Enter referral code'}
                    />
                    {editError && (
                      <p className="mt-1 text-sm text-red-600">{editError}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isEditing || !editValue.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                      {isEditing ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <ReferralFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onFeedback={handleFeedback}
      />
    </div>
  );
}
