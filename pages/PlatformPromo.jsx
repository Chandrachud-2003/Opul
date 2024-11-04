function PlatformPromo() {
  const topPerformer = {
    name: "John Doe",
    isVerified: true,
    avatar: "/placeholder-avatar.jpg",
    promoType: "code",
    code: "SAVE50",
    link: "https://example.com"
  };

  const otherPerformers = Array(20).fill().map((_, i) => ({
    id: i,
    name: `User ${i + 1}`,
    isVerified: i % 3 === 0,
    avatar: "/placeholder-avatar.jpg",
    promoType: i % 2 === 0 ? "code" : "link",
    code: `CODE${i}`,
    link: "https://example.com"
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Performer */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <img 
            src={topPerformer.avatar} 
            className="w-12 h-12 rounded-full"
            alt={topPerformer.name}
          />
          <span className="ml-2 font-bold">{topPerformer.name}</span>
          {topPerformer.isVerified && (
            <svg className="w-5 h-5 ml-1 text-blue-500" /* Verified icon SVG *//>
          )}
        </div>
        <PromoButton promo={topPerformer} />
      </div>

      {/* Other Performers */}
      <div className="grid gap-4">
        {otherPerformers.map(performer => (
          <div key={performer.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={performer.avatar} 
                  className="w-10 h-10 rounded-full"
                  alt={performer.name}
                />
                <span className="ml-2">{performer.name}</span>
                {performer.isVerified && (
                  <svg className="w-4 h-4 ml-1 text-blue-500" /* Verified icon SVG *//>
                )}
              </div>
              <PromoButton promo={performer} />
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-8 w-full py-2 bg-gray-100 rounded-lg">
        Show More
      </button>
    </div>
  );
} 