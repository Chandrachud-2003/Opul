import React from 'react';
import { Shield, Award, Gift, TrendingUp, Check } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verified Badge',
    description: 'Stand out with a verified badge on your profile and listings'
  },
  {
    icon: TrendingUp,
    title: 'Priority Ranking',
    description: 'Your referral codes appear higher in search results'
  },
  {
    icon: Gift,
    title: 'Early Access',
    description: 'Be the first to list codes for new platforms and offers'
  }
];

const testimonials = [
  {
    name: 'Sarah M.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
    role: 'Premium Member',
    content: 'Since upgrading to premium, my referral earnings have increased by 3x. The verified badge really helps build trust.',
    earnings: '$4,320/month'
  },
  {
    name: 'John D.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
    role: 'Premium Member',
    content: 'The priority ranking feature has been a game-changer. My codes get more visibility and clicks.',
    earnings: '$3,150/month'
  }
];

export function PremiumPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Boost your referral earnings with premium features designed for serious referrers.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors">
            Get Started
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((Feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{Feature.title}</h3>
              <p className="text-gray-600">{Feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Premium Membership</h2>
            <div className="text-4xl font-bold mb-2">$19.99<span className="text-lg">/month</span></div>
            <p className="text-white/90">Cancel anytime</p>
          </div>
          <div className="p-8">
            <ul className="space-y-4">
              {[
                'Verified badge on your profile',
                'Priority ranking in search results',
                'Early access to new platforms',
                'Ad-free experience',
                'Premium support',
                'Monthly analytics reports'
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-indigo-600 text-white mt-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Premium Members Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{testimonial.content}</p>
              <div className="text-indigo-600 font-semibold">
                Earning {testimonial.earnings}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}