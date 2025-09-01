import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import firebaseService from '../services/firebaseService';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    myItems: 0,
    activeTrades: 0,
    completedTrades: 0,
    notifications: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [activeTrades, setActiveTrades] = useState([]);
  const [quickStats, setQuickStats] = useState({
    totalValue: 0,
    averageItemValue: 0,
    mostPopularCategory: 'No items yet',
    tradingSuccessRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      setDebugInfo('Starting data load...');

      console.log('🔍 Dashboard: Loading data for user:', currentUser.uid);

      // Fetch all user items
      setDebugInfo('Fetching user items...');
      const userItems = await firebaseService.getUserItems(currentUser.uid);
      console.log('📦 User items fetched:', userItems);
      
      const safeUserItems = Array.isArray(userItems) ? userItems : [];
      setDebugInfo(`Found ${safeUserItems.length} items`);

      // Fetch trades
      setDebugInfo('Fetching trades...');
      const trades = await firebaseService.getTrades(currentUser.uid);
      console.log('🔄 Trades fetched:', trades);
      
      const safeTrades = Array.isArray(trades) ? trades : [];
      const activeTradesList = safeTrades.filter(trade => 
        trade.status === 'pending' || trade.status === 'accepted' || trade.status === 'active'
      );
      const completedTrades = safeTrades.filter(trade => trade.status === 'completed');

      // Fetch notifications
      setDebugInfo('Fetching notifications...');
      const notifications = await firebaseService.getNotifications(currentUser.uid);
      console.log('🔔 Notifications fetched:', notifications);
      
      const safeNotifications = Array.isArray(notifications) ? notifications : [];
      const unreadNotifications = safeNotifications.filter(notif => !notif.read);

      // Calculate stats
      const totalValue = safeUserItems.reduce((sum, item) => {
        const value = parseFloat(item.value) || 0;
        return sum + value;
      }, 0);

      const averageItemValue = safeUserItems.length > 0 ? totalValue / safeUserItems.length : 0;

      // Find most popular category
      const categoryCount = {};
      safeUserItems.forEach(item => {
        const category = item.category || 'Other';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const mostPopularCategory = Object.keys(categoryCount).length > 0 
        ? Object.keys(categoryCount).reduce((a, b) => 
            categoryCount[a] > categoryCount[b] ? a : b
          )
        : 'No items yet';

      const tradingSuccessRate = safeTrades.length > 0 
        ? (completedTrades.length / safeTrades.length) * 100 
        : 0;

      // Update state
      setStats({
        myItems: safeUserItems.length,
        activeTrades: activeTradesList.length,
        completedTrades: completedTrades.length,
        notifications: unreadNotifications.length
      });

      setQuickStats({
        totalValue,
        averageItemValue,
        mostPopularCategory,
        tradingSuccessRate
      });

      setRecentItems(safeUserItems.slice(0, 3));
      setActiveTrades(activeTradesList.slice(0, 3));

      setDebugInfo(`✅ Data loaded successfully! ${safeUserItems.length} items, ${safeTrades.length} trades`);
      console.log('📊 Dashboard stats calculated:', {
        items: safeUserItems.length,
        trades: safeTrades.length,
        totalValue,
        averageItemValue,
        mostPopularCategory
      });

    } catch (error) {
      console.error('❌ Dashboard error:', error);
      setError(`Error loading data: ${error.message}`);
      setDebugInfo(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return time.toLocaleDateString();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">{debugInfo}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}!
          </p>
        </div>

        {/* Debug Info */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Debug Information</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>User ID: {currentUser.uid}</p>
            <p>Email: {currentUser.email}</p>
            <p>Status: {debugInfo}</p>
            <p>Items Found: {stats.myItems}</p>
            <p>💡 Open browser console (F12) for detailed logs</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📦</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">My Items</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.myItems}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🔄</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Trades</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.activeTrades}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.completedTrades}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🔔</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Notifications</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.notifications}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden shadow rounded-lg">
            <div className="p-5 text-white">
              <h3 className="text-sm font-medium text-blue-100">Portfolio Value</h3>
              <p className="text-2xl font-bold">${quickStats.totalValue.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 overflow-hidden shadow rounded-lg">
            <div className="p-5 text-white">
              <h3 className="text-sm font-medium text-green-100">Avg Item Value</h3>
              <p className="text-2xl font-bold">${quickStats.averageItemValue.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 overflow-hidden shadow rounded-lg">
            <div className="p-5 text-white">
              <h3 className="text-sm font-medium text-purple-100">Top Category</h3>
              <p className="text-lg font-bold truncate">{quickStats.mostPopularCategory}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden shadow rounded-lg">
            <div className="p-5 text-white">
              <h3 className="text-sm font-medium text-orange-100">Success Rate</h3>
              <p className="text-2xl font-bold">{quickStats.tradingSuccessRate.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Items */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Items</h3>
                <Link to="/my-items" className="text-sm text-blue-600 hover:text-blue-500">
                  View all →
                </Link>
              </div>
              
              {recentItems.length > 0 ? (
                <div className="space-y-4">
                  {recentItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/50x50?text=Item'}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50x50?text=Item';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                        <p className="text-xs text-green-600 font-semibold">${item.value}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatTimeAgo(item.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📦</span>
                  </div>
                  <p className="text-gray-500 mb-4">No items yet</p>
                  <Link
                    to="/add-item"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add your first item
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Active Trades */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Trades</h3>
                <Link to="/my-trades" className="text-sm text-blue-600 hover:text-blue-500">
                  View all →
                </Link>
              </div>
              
              {activeTrades.length > 0 ? (
                <div className="space-y-4">
                  {activeTrades.map((trade) => (
                    <div key={trade.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Trade #{trade.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trade.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          trade.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {trade.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <div className="text-center">
                          <img
                            src={trade.userItem?.imageUrl || 'https://via.placeholder.com/40x40'}
                            alt="Your item"
                            className="w-10 h-10 rounded object-cover mx-auto"
                          />
                          <p className="text-xs mt-1 truncate">Your item</p>
                        </div>
                        <span className="text-gray-400">⇄</span>
                        <div className="text-center">
                          <img
                            src={trade.partnerItem?.imageUrl || 'https://via.placeholder.com/40x40'}
                            alt="Partner item"
                            className="w-10 h-10 rounded object-cover mx-auto"
                          />
                          <p className="text-xs mt-1 truncate">Partner item</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <p className="text-gray-500 mb-4">No active trades</p>
                  <Link
                    to="/browse"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Browse items to trade
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/add-item"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <span className="text-white text-xl">+</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Add New Item</p>
                    <p className="text-xs text-gray-500">List something for trade</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/browse"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <span className="text-white text-xl">🔍</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Browse Items</p>
                    <p className="text-xs text-gray-500">Find items to trade</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/my-trades"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Manage Trades</p>
                    <p className="text-xs text-gray-500">View trade history</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
