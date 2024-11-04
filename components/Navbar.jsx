function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Logo />
            <SearchBar className="ml-4 w-96" />
          </div>
          <div className="flex items-center space-x-4">
            <AuthButtons />
          </div>
        </div>
      </div>
    </nav>
  );
} 