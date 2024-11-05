export const LoadingPlaceholder: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Profile Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
            <div className="h-24 bg-gray-200 rounded mb-6" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 