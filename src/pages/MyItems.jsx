import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';

const MyItems = () => {
  const { currentUser } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadUserItems();
    }
  }, [currentUser]);

  const loadUserItems = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading user items for user:', currentUser.uid);
      const userItems = await firebaseService.getUserItems(currentUser.uid);
      console.log('User items loaded:', userItems);
      setMyItems(userItems);
    } catch (error) {
      console.error('Error loading user items:', error);
      setError('Failed to load your items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setDeleting(itemId);
      await firebaseService.deleteItem(itemId);
      // Remove item from local state
      setMyItems(myItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'traded':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your items.</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your items...</p>
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
            onClick={loadUserItems}
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Items</h1>
            <p className="text-gray-600">
              Manage your items available for trading
            </p>
          </div>
          <Link
            to="/add-item"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Item
          </Link>
        </div>

        {myItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No items yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start trading by adding your first item!
              </p>
              <Link
                to="/add-item"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Your First Item
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusBadgeColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Condition: {item.condition}</span>
                    {item.value && <span>${item.value}</span>}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link
                        to={`/item/${item.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit-item/${item.id}`}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={deleting === item.id}
                      className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                    >
                      {deleting === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItems;
