function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Promo of the Day */}
      <TopPromoSection />
      
      {/* Categories */}
      <CategoryBubbles />
      
      {/* Popular Platforms */}
      <PopularPlatforms />
    </div>
  );
} 