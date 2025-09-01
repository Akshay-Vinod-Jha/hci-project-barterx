import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getItemById } from '../services/firebaseService';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeMessage, setTradeMessage] = useState('');

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      setError('');
      const itemData = await getItemById(id);
      if (itemData) {
        setItem(itemData);
      } else {
        setError('Item not found');
      }
    } catch (error) {
      console.error('Error loading item:', error);
      setError('Failed to load item details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTradeRequest = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setShowTradeModal(true);
  };

  const submitTradeRequest = () => {
    // Simulate sending trade request
    console.log('Trade request sent:', {
      itemId: item.id,
      fromUser: currentUser.uid,
      toUser: item.userId,
      message: tradeMessage
    });
    
    setShowTradeModal(false);
    setTradeMessage('');
    alert('Trade request sent successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Item Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error ? 'There was an error loading the item.' : "The item you're looking for doesn't exist."}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Go Back
            </button>
            {error && (
              <button
                onClick={loadItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isOwnItem = currentUser && currentUser.uid === item.userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div>
              <img
                src={item.images && item.images.length > 0 ? item.images[0].url : 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={item.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              {item.images && item.images.length > 1 && (
                <div className="flex space-x-2 mt-4">
                  {item.images.slice(1).map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`Additional view ${index + 1}`}
                      className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                  {item.category}
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ${item.value}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {item.title}
              </h1>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-medium text-gray-700">Condition: </span>
                  <span className="text-gray-600">{item.condition}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location: </span>
                  <span className="text-gray-600">{item.location || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Listed by: </span>
                  <span className="text-gray-600">{item.ownerName || 'User'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Posted: </span>
                  <span className="text-gray-600">
                    {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {!isOwnItem && (
                <div className="space-y-3">
                  <button
                    onClick={handleTradeRequest}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Request Trade
                  </button>
                  <button className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                    Add to Wishlist
                  </button>
                </div>
              )}

              {isOwnItem && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    This is your item. You can edit or remove it from your items page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trade Request Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Request Trade for {item.title}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to {item.userName}
              </label>
              <textarea
                value={tradeMessage}
                onChange={(e) => setTradeMessage(e.target.value)}
                rows={4}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what you'd like to trade for this item..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={submitTradeRequest}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700"
              >
                Send Request
              </button>
              <button
                onClick={() => setShowTradeModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
