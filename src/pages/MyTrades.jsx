import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';

const MyTrades = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadTrades();
    }
  }, [currentUser]);

  const loadTrades = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading trades for user:', currentUser.uid);
      const userTrades = await firebaseService.getTrades(currentUser.uid);
      console.log('Loaded trades:', userTrades);
      
      setTrades(userTrades || []);
    } catch (error) {
      console.error('Error loading trades:', error);
      setError('Failed to load trades. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTrade = async (tradeId) => {
    try {
      await firebaseService.updateTrade(tradeId, { status: 'accepted' });
      loadTrades(); // Reload trades after accepting
    } catch (error) {
      console.error('Error accepting trade:', error);
      setError('Failed to accept trade. Please try again.');
    }
  };

  const handleDeclineTrade = async (tradeId) => {
    try {
      await firebaseService.updateTrade(tradeId, { status: 'declined' });
      loadTrades(); // Reload trades after declining
    } catch (error) {
      console.error('Error declining trade:', error);
      setError('Failed to decline trade. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'accepted': { bg: 'bg-green-100', text: 'text-green-800', label: 'Accepted' },
      'declined': { bg: 'bg-red-100', text: 'text-red-800', label: 'Declined' },
      'completed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your trades.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Trades</h1>
          <p className="mt-2 text-gray-600">
            Track and manage your ongoing trades
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : trades.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No trades yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start trading to see your exchanges here.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/browse')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Items
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {trades.map((trade) => (
              <div key={trade.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Trade #{trade.id}
                    </h3>
                    {getStatusBadge(trade.status)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {trade.createdAt && typeof trade.createdAt.toDate === 'function' 
                      ? trade.createdAt.toDate().toLocaleDateString()
                      : new Date(trade.createdAt).toLocaleDateString()
                    }
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Your Item */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Your Item</h4>
                    <div className="flex items-center space-x-3">
                      <img
                        src={trade.userItem?.imageUrl || 'https://via.placeholder.com/80x80'}
                        alt={trade.userItem?.title || 'User item'}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {trade.userItem?.title || 'Unknown Item'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Value: ${trade.userItem?.value || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Partner's Item */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Partner's Item</h4>
                    <div className="flex items-center space-x-3">
                      <img
                        src={trade.partnerItem?.imageUrl || 'https://via.placeholder.com/80x80'}
                        alt={trade.partnerItem?.title || 'Partner item'}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {trade.partnerItem?.title || 'Unknown Item'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Value: ${trade.partnerItem?.value || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trade Partner Info */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Trade Partner</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {trade.partner?.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {trade.partner?.email || 'No email provided'}
                      </p>
                    </div>
                    {trade.meetingArranged && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Meeting Arranged
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {trade.status === 'pending' && (
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => handleAcceptTrade(trade.id)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Accept Trade
                    </button>
                    <button
                      onClick={() => handleDeclineTrade(trade.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Decline Trade
                    </button>
                  </div>
                )}

                {trade.status === 'accepted' && (
                  <div className="mt-6">
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Arrange Meeting
                      </button>
                      <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                        Contact Partner
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrades;
