import React, { useState } from 'react';

function TopPromoSection() {
  const [showCopyBanner, setShowCopyBanner] = useState(false);
  const [showFeedbackBanner, setShowFeedbackBanner] = useState(false);
  
  const promoData = {
    type: 'code', // or 'link'
    code: 'SAVE50',
    link: 'https://example.com',
    website: 'Example Store',
    description: 'Save 50% on your first purchase'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promoData.code);
    setShowCopyBanner(true);
    setTimeout(() => setShowCopyBanner(false), 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Top Promo of the Day</h2>
      
      {promoData.type === 'code' ? (
        <div className="flex items-center space-x-4">
          <code className="bg-gray-100 p-2 rounded">{promoData.code}</code>
          <button 
            onClick={handleCopy}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Copy Code
          </button>
        </div>
      ) : (
        <a 
          href={promoData.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
        >
          Use {promoData.website} Link
        </a>
      )}

      {/* Copy Success Banner */}
      {showCopyBanner && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
          <p>Code copied!</p>
          <a 
            href={promoData.link}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Visit {promoData.website}
          </a>
        </div>
      )}
    </div>
  );
} 