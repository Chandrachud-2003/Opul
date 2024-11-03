import React, { useState } from 'react';
import { ArrowRight, Copy, Check } from 'lucide-react';

export function ReferralBox() {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const referralCode = 'REF123XYZ';

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto mb-16">
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
        <span className="font-mono text-lg">{referralCode}</span>
        <button
          onClick={copyReferralCode}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Copy referral code"
        >
          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter friend's email"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          Send Invitation <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}