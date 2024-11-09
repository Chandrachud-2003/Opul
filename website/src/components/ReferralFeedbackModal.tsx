import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, X, AlertCircle } from "lucide-react";

interface ReferralFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedback: (feedback: "success" | "failure" | "pending") => void;
}

export function ReferralFeedbackModal({
  isOpen,
  onClose,
  onFeedback,
}: ReferralFeedbackModalProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<
    "success" | "failure" | "pending" | null
  >(null);

  if (!isOpen) return null;

  const handleFeedbackClick = (feedback: "success" | "failure" | "pending") => {
    setSelectedFeedback(feedback);
    onFeedback(feedback);

    // Changed delay to 500ms (0.5 seconds)
    setTimeout(() => {
      onClose();
      // Reset selected feedback after modal closes
      setTimeout(() => setSelectedFeedback(null), 200);
    }, 500); // Changed from 1000 to 500
  };

  const getButtonStyles = (type: "success" | "failure" | "pending") => {
    if (selectedFeedback === type) {
      switch (type) {
        case "success":
          return "bg-green-600 text-white";
        case "failure":
          return "bg-red-600 text-white";
        case "pending":
          return "bg-gray-600 text-white";
      }
    }

    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "failure":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      case "pending":
        return "bg-gray-100 text-gray-600 hover:bg-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={selectedFeedback !== null}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">
            Did this referral work for you?
          </h3>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2 text-amber-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-left">
                Your response will affect your credibility score. Please ensure
                you provide accurate feedback only after you've confirmed
                whether the referral worked or not.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => handleFeedbackClick("success")}
              disabled={selectedFeedback !== null}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${getButtonStyles(
                "success"
              )}`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span>It Worked!</span>
            </button>

            <button
              onClick={() => handleFeedbackClick("failure")}
              disabled={selectedFeedback !== null}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${getButtonStyles(
                "failure"
              )}`}
            >
              <ThumbsDown className="w-5 h-5" />
              <span>Didn't Work</span>
            </button>
          </div>

          <button
            onClick={() => handleFeedbackClick("pending")}
            disabled={selectedFeedback !== null}
            className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ${getButtonStyles(
              "pending"
            )}`}
          >
            I haven't used it yet
          </button>
        </div>
      </div>
    </div>
  );
}
