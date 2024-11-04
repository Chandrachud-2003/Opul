function FeedbackBanner({ onClose }) {
  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Did this promo work for you?</h3>
      <div className="flex space-x-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          👍 Yes
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          👎 No
        </button>
        <button className="bg-gray-200 px-4 py-2 rounded">
          I'll use it later
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Your feedback helps maintain community credibility scores
      </p>
    </div>
  );
} 