import React from 'react';
import { ThumbsUp, ThumbsDown, X, AlertCircle } from 'lucide-react';

interface ReferralFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedback: (feedback: 'success' | 'failure' | 'pending') => void;
}

export function ReferralFeedbackModal({ isOpen, onClose, onFeedback }: ReferralFeedbackModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Did this referral work for you?</h3>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2 text-amber-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-left">
                Your response will affect your credibility score. Please ensure you provide accurate feedback 
                only after you've confirmed whether the referral worked or not.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => onFeedback('success')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>It Worked!</span>
            </button>
            
            <button
              onClick={() => onFeedback('failure')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <ThumbsDown className="w-5 h-5" />
              <span>Didn't Work</span>
            </button>
          </div>

          <button
            onClick={() => onFeedback('pending')}
            className="w-full px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            I haven't used it yet
          </button>
        </div>
      </div>
    </div>
  );
} 