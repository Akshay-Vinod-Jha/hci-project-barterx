import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    priceRange: '',
    location: ''
  });

  // Mock search results
  const mockSearchResults = [
    {
      id: 1,
      title: 'iPhone 12 Pro',
      description: 'Excellent condition iPhone 12 Pro, 128GB',
      category: 'Electronics',
      condition: 'Like New',
      value: 600,
      location: 'New York, NY',
      imageUrl: 'https://via.placeholder.com/300x200?text=iPhone+12+Pro',
      userName: 'John Doe',
      createdAt: '2024-01-20',
      relevanceScore: 95
    },
    {
      id: 3,
      title: 'Gaming Laptop',
      description: 'High-performance gaming laptop with RTX 3070',
      category: 'Electronics',
      condition: 'Good',
      value: 1200,
      location: 'Chicago, IL',
      imageUrl: 'https://via.placeholder.com/300x200?text=Gaming+Laptop',
      userName: 'Mike Johnson',
      createdAt: '2024-01-18',
      relevanceScore: 88
    },
    {
      id: 2,
      title: 'Vintage Guitar',
      description: 'Beautiful vintage acoustic guitar from the 1970s',
      category: 'Music Instruments',
      condition: 'Good',
      value: 400,
      location: 'Los Angeles, CA',
      imageUrl: 'https://via.placeholder.com/300x200?text=Vintage+Guitar',
      userName: 'Jane Smith',
      createdAt: '2024-01-19',
      relevanceScore: 75
    }
  ];

  const categories = [
    'Electronics',
    'Books',
    'Clothing',
    'Home & Garden',
    'Sports & Recreation',
    'Vehicles',
    'Collectibles',
    'Music Instruments',
    'Other'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      // Filter mock results based on search query
      const filtered = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filtered);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const applyFilters = () => {
    let filtered = searchResults;
    
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    if (filters.condition) {
      filtered = filtered.filter(item => item.condition === filters.condition);
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(item => {
        if (max) return item.value >= min && item.value <= max;
        return item.value >= min;
      });
    }
    if (filters.location) {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredResults = applyFilters();

  const popularSearches = [
    'iPhone', 'Laptop', 'Guitar', 'Books', 'Camera', 'Gaming', 'Furniture', 'Clothes'
  ];

  const recentSearches = [
    'MacBook Pro', 'Gaming Chair', 'Textbooks', 'Vintage Items'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Items</h1>
          <p className="text-gray-600">
            Find exactly what you're looking for
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for items, categories, or keywords..."
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg py-3 px-4"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Quick Search Suggestions */}
          {!hasSearched && (
            <div className="mt-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setTimeout(handleSearch, 100);
                      }}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setTimeout(handleSearch, 100);
                      }}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Refine Results</h3>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Condition Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <select
                      value={filters.condition}
                      onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Conditions</option>
                      {conditions.map(condition => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any Price</option>
                      <option value="0-50">$0 - $50</option>
                      <option value="50-100">$50 - $100</option>
                      <option value="100-250">$100 - $250</option>
                      <option value="250-500">$250 - $500</option>
                      <option value="500-1000">$500 - $1000</option>
                      <option value="1000">$1000+</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter city or state"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={() => setFilters({ category: '', condition: '', priceRange: '', location: '' })}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-300 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Searching...</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-gray-600">
                      {filteredResults.length} results for "{searchQuery}"
                    </p>
                  </div>

                  {filteredResults.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No items found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Try different keywords or adjust your filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setHasSearched(false);
                          setSearchResults([]);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
                      >
                        Start New Search
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredResults.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {item.category}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-green-600">
                                  ${item.value}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {item.relevanceScore}% match
                                </span>
                              </div>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {item.title}
                            </h3>
                            
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            
                            <div className="space-y-1 text-xs text-gray-500 mb-4">
                              <p>Condition: {item.condition}</p>
                              <p>Location: {item.location}</p>
                              <p>Listed by: {item.userName}</p>
                            </div>
                            
                            <Link
                              to={`/item/${item.id}`}
                              className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
