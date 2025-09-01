import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, updateNotification, deleteNotification as deleteNotificationFromDb } from '../services/firebaseService';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const userNotifications = await getNotifications(currentUser.uid);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'trade_request':
        return '🔄';
      case 'trade_accepted':
        return '✅';
      case 'trade_completed':
        return '🎉';
      case 'item_viewed':
        return '👀';
      case 'message':
        return '💬';
      case 'price_suggestion':
        return '💰';
      default:
        return '📄';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'trade_request':
        return 'bg-blue-100 text-blue-800';
      case 'trade_accepted':
        return 'bg-green-100 text-green-800';
      case 'trade_completed':
        return 'bg-purple-100 text-purple-800';
      case 'item_viewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'message':
        return 'bg-indigo-100 text-indigo-800';
      case 'price_suggestion':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await updateNotification(notificationId, { read: true });
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(notification => 
          updateNotification(notification.id, { read: true })
        )
      );
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await deleteNotificationFromDb(notificationId);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
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
            onClick={loadNotifications}
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
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">
              Stay updated with your trades and activities
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex overflow-x-auto">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'trade_request', label: 'Trade Requests' },
                { key: 'trade_accepted', label: 'Accepted' },
                { key: 'message', label: 'Messages' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'unread' && unreadCount > 0 && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">
                {filter === 'all' && "You don't have any notifications yet."}
                {filter === 'unread' && "You're all caught up! No unread notifications."}
                {filter !== 'all' && filter !== 'unread' && `No ${filter.replace('_', ' ')} notifications.`}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`bg-white rounded-lg shadow-md p-6 ${
                  !notification.read ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`font-semibold ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          getNotificationColor(notification.type)
                        }`}>
                          {notification.type.replace('_', ' ')}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      <p className="text-sm text-gray-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                {/* Action buttons for trade-related notifications */}
                {(notification.type === 'trade_request' && !notification.read) && (
                  <div className="mt-4 flex space-x-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700">
                      Accept Trade
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700">
                      Decline
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300">
                      View Details
                    </button>
                  </div>
                )}
                
                {(notification.type === 'message') && (
                  <div className="mt-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">
                      Reply
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Notification Settings */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Notification Settings
          </h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
              <span className="ml-2 text-sm text-gray-700">Trade requests</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
              <span className="ml-2 text-sm text-gray-700">Trade status updates</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
              <span className="ml-2 text-sm text-gray-700">New messages</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
              <span className="ml-2 text-sm text-gray-700">Item views and interest</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
