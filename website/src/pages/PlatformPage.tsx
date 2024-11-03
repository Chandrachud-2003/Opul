import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, Check, ExternalLink, Award, Info } from 'lucide-react';

// Placeholder data
const platformData = {
  id: 'chase-sapphire',
  name: 'Chase Sapphire Preferred',
  logo: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=128&h=128',
  category: 'Finance',
  benefit: '60,000 Points Bonus',
  description: 'Earn 60,000 bonus points after you spend $4,000 on purchases in the first 3 months from account opening.',
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
        verified: true
      },
      code: 'SARAHM2024',
      clicks: 234,
      success: '98%'
    },
    {
      id: 2,
      user: {
        name: 'John D.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
        score: 88,
        verified: true
      },
      code: 'JOHND2024',
      clicks: 189,
      success: '95%'
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
  const { slug } = useParams();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
                  src={platformData.logo}
                  alt={platformData.name}
                  className="w-24 h-24 rounded-xl"
                />
                <div>
                  <div className="text-sm text-indigo-600 font-medium mb-1">
                    {platformData.category}
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{platformData.name}</h1>
                  <p className="text-gray-600">{platformData.description}</p>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-indigo-600 font-medium mb-2">
                  <Info className="w-5 h-5" />
                  Current Offer
                </div>
                <p className="text-lg font-semibold">{platformData.benefit}</p>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">How to Claim</h2>
              <div className="space-y-4">
                {platformData.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-medium">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Codes */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-6">Top Referral Codes</h2>
              <div className="space-y-4">
                {platformData.topCodes.map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.user.avatar}
                          alt={item.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.user.name}</span>
                            {item.user.verified && (
                              <Award className="w-4 h-4 text-indigo-600" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Score: {item.user.score}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.clicks} uses • {item.success} success
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <code className="flex-1 bg-gray-50 p-3 rounded-lg font-mono">
                        {item.code}
                      </code>
                      <button
                        onClick={() => copyCode(item.code, item.id)}
                        className="p-3 text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
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

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Related Deals */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-6">Related Deals</h2>
              <div className="space-y-4">
                {platformData.relatedDeals.map((deal) => (
                  <a
                    key={deal.id}
                    href={`/platform/${deal.id}`}
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
                  </a>
                ))}
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}