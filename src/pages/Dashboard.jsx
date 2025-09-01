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
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [activeTrades, setActiveTrades] = useState([]);
  const [quickStats, setQuickStats] = useState({
    totalValue: 0,
    averageItemValue: 0,
    mostPopularCategory: 'N/A',
    tradingSuccessRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Loading dashboard data for user:', currentUser.uid);

      // Load user items
      const userItems = await firebaseService.getUserItems(currentUser.uid);
      console.log('User items loaded:', userItems);
      
      // Load trades
      const trades = await firebaseService.getTrades(currentUser.uid);
      console.log('Trades loaded:', trades);
      
      const activeTrades = trades.filter(trade => 
        trade.status === 'pending' || trade.status === 'accepted' || trade.status === 'active'
      );
      const completedTrades = trades.filter(trade => trade.status === 'completed');
      
      console.log('Active trades:', activeTrades);
      console.log('Completed trades:', completedTrades);
      
      // Load notifications
      const notifications = await firebaseService.getNotifications(currentUser.uid);
      console.log('Notifications loaded:', notifications);
      
      const unreadNotifications = notifications.filter(notif => !notif.read);
      console.log('Unread notifications:', unreadNotifications);

      // Calculate additional stats
      const totalValue = userItems.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
      const averageItemValue = userItems.length > 0 ? totalValue / userItems.length : 0;
      
      // Find most popular category
      const categoryCount = {};
      userItems.forEach(item => {
        const category = item.category || 'Other';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
      const mostPopularCategory = Object.keys(categoryCount).reduce((a, b) => 
        categoryCount[a] > categoryCount[b] ? a : b, 'N/A'
      );
      
      // Calculate trading success rate
      const totalTrades = trades.length;
      const successfulTrades = completedTrades.length;
      const tradingSuccessRate = totalTrades > 0 ? (successfulTrades / totalTrades) * 100 : 0;

      const newStats = {
        myItems: userItems.length,
        activeTrades: activeTrades.length,
        completedTrades: completedTrades.length,
        notifications: unreadNotifications.length
      };

      const newQuickStats = {
        totalValue: totalValue,
        averageItemValue: averageItemValue,
        mostPopularCategory: mostPopularCategory,
        tradingSuccessRate: tradingSuccessRate
      };
      
      console.log('Dashboard stats:', newStats);
      console.log('Quick stats:', newQuickStats);
      
      setStats(newStats);
      setQuickStats(newQuickStats);
      setRecentItems(userItems.slice(0, 3)); // Show 3 most recent items
      setActiveTrades(activeTrades.slice(0, 3)); // Show 3 most recent active trades

      // Create recent activity from items and trades
      const activity = [];
      
      // Add recent items
      userItems.slice(0, 2).forEach(item => {
        activity.push({
          id: `item-${item.id}`,
          action: `Added item "${item.title}" for trading`,
          time: formatTimeAgo(item.createdAt),
          type: 'item'
        });
      });

      // Add recent trades
      trades.slice(0, 2).forEach(trade => {
        activity.push({
          id: `trade-${trade.id}`,
          action: `Trade ${trade.status}: ${trade.description || 'Trade request'}`,
          time: formatTimeAgo(trade.createdAt),
          type: 'trade'
        });
      });

      // Sort by most recent and take top 5
      activity.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivity(activity.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const now = new Date();
    const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffMs = now - time;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return time.toLocaleDateString();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {currentUser?.displayName || currentUser?.email || 'User'}!
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📦</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      My Items
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.myItems}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🔄</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Trades
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.activeTrades}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed Trades
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.completedTrades}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🔔</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Notifications
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.notifications}
                    </dd>
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
              <div className="flex items-center">
                <div className="flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-100 truncate">
                      Total Portfolio Value
                    </dt>
                    <dd className="text-lg font-medium">
                      ${quickStats.totalValue.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 overflow-hidden shadow rounded-lg">
            <div className="p-5 text-white">
              <div className="flex items-center">
                <div className="flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-green-100 truncate">
                      Avg Item Value
                    </dt>
                    <dd className="text-lg font-medium">
                      ${quickStats.averageItemValue.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 overflow-hidden shadow rounded-lg">
            <div className="p-5 text-white">
              <div className="flex items-center">
                <div className="flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-purple-100 truncate">
                      Top Category
                    </dt>
                    <dd className="text-lg font-medium">
                      {quickStats.mostPopularCategory}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden shadow rounded-lg">
            <div className="p-5 text-white">
              <div className="flex items-center">
                <div className="flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-orange-100 truncate">
                      Success Rate
                    </dt>
                    <dd className="text-lg font-medium">
                      {quickStats.tradingSuccessRate.toFixed(1)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Items */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Items
                </h3>
                <Link
                  to="/my-items"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  View all →
                </Link>
              </div>
              <div className="space-y-4">
                {recentItems.length > 0 ? (
                  recentItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/50x50'}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-sm text-gray-500">${item.value}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.createdAt && typeof item.createdAt.toDate === 'function' 
                          ? formatTimeAgo(item.createdAt)
                          : 'Recently added'
                        }
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500">No items yet.</p>
                    <Link
                      to="/add-item"
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                    >
                      Add your first item
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Trades */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Active Trades
                </h3>
                <Link
                  to="/my-trades"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  View all →
                </Link>
              </div>
              <div className="space-y-4">
                {activeTrades.length > 0 ? (
                  activeTrades.map((trade) => (
                    <div key={trade.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          Trade #{trade.id}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trade.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          trade.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {trade.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img
                          src={trade.userItem?.imageUrl || 'https://via.placeholder.com/40x40'}
                          alt={trade.userItem?.title || 'Your item'}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="text-gray-400">⇄</span>
                        <img
                          src={trade.partnerItem?.imageUrl || 'https://via.placeholder.com/40x40'}
                          alt={trade.partnerItem?.title || 'Partner item'}
                          className="w-10 h-10 rounded object-cover"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        With: {trade.partner?.name || 'Unknown user'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500">No active trades.</p>
                    <Link
                      to="/browse"
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                    >
                      Browse items to trade
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/add-item"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">+</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Add New Item</p>
                    <p className="text-sm text-gray-500">List something for trade</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/browse"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">🔍</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Browse Items</p>
                    <p className="text-sm text-gray-500">Find items to trade</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/my-trades"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">🔄</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Manage Trades</p>
                    <p className="text-sm text-gray-500">View trade history</p>
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
