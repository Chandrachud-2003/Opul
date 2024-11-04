function CategoryBubbles() {
  const categories = [
    'Fashion', 'Electronics', 'Food', 'Travel', 
    'Entertainment', 'Software', 'Health', 'Beauty'
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map(category => (
          <button
            key={category}
            className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
} 