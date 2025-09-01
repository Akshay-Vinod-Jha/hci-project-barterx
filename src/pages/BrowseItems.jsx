import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebaseService from '../services/firebaseService';

const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const categories = [
    'all',
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

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading items from Firebase...');
      const fetchedItems = await firebaseService.getAllItems();
      console.log('Items fetched from Firebase:', fetchedItems);
      // Only show available items
      const availableItems = fetchedItems.filter(item => item.status === 'available');
      console.log('Available items:', availableItems);
      setItems(availableItems);
    } catch (error) {
      console.error('Error loading items:', error);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
            {error}
          </div>
          <button
            onClick={loadItems}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
          <p className="text-gray-600">
            Discover amazing items available for trade
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={item.images && item.images.length > 0 ? item.images[0].url : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {item.category}
                  </span>
                  {item.value && (
                    <span className="text-sm text-gray-500">
                      ${item.value}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Condition: {item.condition}</span>
                  {item.location && <span>{item.location}</span>}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    by {item.userDisplayName || 'Anonymous'}
                  </span>
                  <Link
                    to={`/item/${item.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {filter === 'all' ? 'No items available for trading yet.' : `No items found in ${filter} category.`}
            </p>
            <Link
              to="/add-item"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Add Your First Item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseItems;
