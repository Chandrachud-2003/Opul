import React from 'react';
import { useParams } from 'react-router-dom';
import { Award, TrendingUp, Users, DollarSign, ExternalLink, Copy } from 'lucide-react';

// Placeholder data
const userData = {
  id: '123',
  name: 'Sarah Mitchell',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128',
  credibilityScore: 95,
  verified: true,
  joinedDate: 'January 2024',
  stats: {
    totalReferrals: 234,
    totalEarnings: '$4,320',
    activeReferrals: 12,
    successRate: '98%'
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
      success: '98%'
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
      success: '95%'
    }
  ]
};

export function ProfilePage() {
  const { id } = useParams();
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
                {userData.verified && (
                  <Award className="w-5 h-5 text-indigo-600" />
                )}
              </div>
              <div className="text-gray-600 mb-4">
                Member since {userData.joinedDate}
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg mb-6">
                <div className="text-sm text-indigo-600 mb-1">Credibility Score</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {userData.credibilityScore}
                </div>
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
                  {userData.stats.totalReferrals}
                </div>
                <div className="text-sm text-gray-600">Total Referrals</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {userData.stats.totalEarnings}
                </div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {userData.stats.activeReferrals}
                </div>
                <div className="text-sm text-gray-600">Active Referrals</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                src/pages/ProfilePage.tsx
                              <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {userData.stats.successRate}
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
                    <div className="flex items-center gap-4">
                      <code className="flex-1 bg-gray-50 p-3 rounded-lg font-mono">
                        {item.code}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(item.code)}
                        className="p-3 text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <a
                        href="#"
                        className="p-3 text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}