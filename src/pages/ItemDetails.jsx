import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Share2,
  Eye,
  MapPin,
  Calendar,
  Package,
  Star,
  Shield,
  MessageCircle,
  Phone,
  User,
  CheckCircle,
  Camera,
  Clock,
  TrendingUp,
  Award,
  Tag,
  DollarSign,
  Flag,
  Bookmark,
  Send,
  X,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeMessage, setTradeMessage] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      setError('');
      const itemData = await firebaseService.getItemById(id);
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

  const submitTradeRequest = async () => {
    try {
      console.log('🚀 Starting trade request process...');
      console.log('Current user:', currentUser);
      console.log('Item details:', item);
      console.log('Trade message:', tradeMessage);

      if (!item || !item.id) {
        throw new Error('Item data is missing');
      }

      if (!currentUser || !currentUser.uid) {
        throw new Error('User authentication is missing');
      }

      if (currentUser.uid === item.userId) {
        alert("You can't send a trade request for your own item!");
        return;
      }

      console.log('✅ Initial validation passed');

      // Create the trade request
      const tradeData = {
        itemId: item.id,
        requesterUserId: currentUser.uid,
        ownerUserId: item.userId,
        message: tradeMessage || 'No message provided',
        status: 'pending',
        participants: [currentUser.uid, item.userId],
        itemDetails: {
          title: item.title || 'Unknown Item',
          imageUrl: item.imageUrl || '',
          value: item.value || 0
        },
        requesterDetails: {
          email: currentUser.email || '',
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Unknown User'
        }
      };

      console.log('📦 Trade data prepared:', tradeData);

      // Create the trade
      console.log('💾 Creating trade in Firestore...');
      const tradeRef = await firebaseService.createTrade(tradeData);
      console.log('✅ Trade created successfully with ID:', tradeRef.id);

      // Create notification for the item owner
      console.log('🔔 Creating notification for item owner...');
      const notificationData = {
        itemTitle: item.title || 'Unknown Item',
        tradeId: tradeRef.id,
        itemId: item.id,
        fromUserId: currentUser.uid,
        fromUserName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Unknown User',
        message: tradeMessage || 'No message provided'
      };
      
      console.log('📝 Notification data:', notificationData);
      
      await firebaseService.createTradeNotification(
        item.userId, // Send notification to item owner
        'trade_request',
        notificationData
      );

      console.log('✅ Notification created successfully');
      console.log('🎉 Trade request process completed successfully');
      
      setShowTradeModal(false);
      setTradeMessage('');
      alert('Trade request sent successfully! The owner will be notified.');
      
    } catch (error) {
      console.error('❌ Detailed error in trade request:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      let userMessage = 'Failed to send trade request. ';
      
      if (error.message.includes('permission')) {
        userMessage += 'Permission denied. Please check your login status.';
      } else if (error.message.includes('network')) {
        userMessage += 'Network error. Please check your internet connection.';
      } else if (error.message.includes('auth')) {
        userMessage += 'Authentication error. Please log in again.';
      } else {
        userMessage += `Error: ${error.message}`;
      }
      
      alert(userMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-marketplace-primary border-t-transparent mx-auto"></div>
          <p className="mt-6 text-marketplace-text-secondary text-lg">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-marketplace-error-light border border-marketplace-error text-marketplace-error px-6 py-4 rounded-marketplace-lg mb-6">
            <AlertCircle size={20} className="inline mr-2" />
            <span className="font-semibold">Error:</span> {error || 'Item not found'}
          </div>
          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-marketplace-gray-600 text-white px-6 py-3 rounded-marketplace-lg font-semibold hover:bg-marketplace-gray-700 transition-colors"
            >
              Go Back
            </button>
            {error && (
              <button
                onClick={loadItem}
                className="bg-marketplace-primary text-white px-6 py-3 rounded-marketplace-lg font-semibold hover:bg-marketplace-primary-hover transition-colors"
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
    <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-800">
      {/* Navigation Bar */}
      <div className="bg-white dark:bg-marketplace-gray-900 border-b border-marketplace-border-light shadow-marketplace sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-marketplace-text-primary hover:text-marketplace-primary font-medium transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to listings
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2 rounded-marketplace transition-colors ${
                  isSaved 
                    ? 'bg-marketplace-primary text-white' 
                    : 'bg-marketplace-gray-100 dark:bg-marketplace-gray-800 text-marketplace-text-secondary hover:text-marketplace-primary'
                }`}
              >
                <Bookmark size={18} />
              </button>
              <button className="p-2 rounded-marketplace bg-marketplace-gray-100 dark:bg-marketplace-gray-800 text-marketplace-text-secondary hover:text-marketplace-primary transition-colors">
                <Share2 size={18} />
              </button>
              <button className="p-2 rounded-marketplace bg-marketplace-gray-100 dark:bg-marketplace-gray-800 text-marketplace-text-secondary hover:text-marketplace-primary transition-colors">
                <Flag size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace overflow-hidden">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={item.images && item.images.length > 0 ? item.images[selectedImageIndex].url : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'}
                  alt={item.title}
                  className="w-full h-96 lg:h-[500px] object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop';
                  }}
                />
                
                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-marketplace text-sm">
                  {selectedImageIndex + 1} / {item.images?.length || 1}
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
                      isLiked 
                        ? 'bg-marketplace-error text-white' 
                        : 'bg-white/90 text-marketplace-gray-600 hover:text-marketplace-error'
                    }`}
                  >
                    <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {item.images && item.images.length > 1 && (
                <div className="p-4 border-t border-marketplace-border-light">
                  <div className="flex space-x-3 overflow-x-auto">
                    {item.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-marketplace overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index 
                            ? 'border-marketplace-primary' 
                            : 'border-marketplace-border-light hover:border-marketplace-border-medium'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6">
              {/* Category & Price Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="bg-marketplace-primary bg-opacity-10 text-marketplace-primary text-sm font-bold px-3 py-1 rounded-marketplace">
                    {item.category}
                  </span>
                  <span className="bg-marketplace-success bg-opacity-20 text-marketplace-success text-sm font-semibold px-3 py-1 rounded-marketplace">
                    {item.condition}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-marketplace-primary">
                    ₹{(item.value || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-marketplace-text-secondary">
                    Fixed Price
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-marketplace-text-primary mb-4 leading-tight">
                {item.title}
              </h1>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6 mb-6 text-sm text-marketplace-text-secondary">
                <div className="flex items-center space-x-1">
                  <Eye size={14} />
                  <span>{Math.floor(Math.random() * 500) + 100} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart size={14} />
                  <span>{Math.floor(Math.random() * 50) + 5} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>
                    {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString() : 'Recently posted'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{item.location || 'Location not specified'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-marketplace-text-primary mb-3">Description</h3>
                <div className="prose prose-marketplace max-w-none">
                  <p className="text-marketplace-text-secondary leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Item Details Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-marketplace-gray-50 dark:bg-marketplace-gray-800 rounded-marketplace p-4">
                  <div className="text-sm text-marketplace-text-secondary mb-1">Condition</div>
                  <div className="font-semibold text-marketplace-text-primary">{item.condition}</div>
                </div>
                <div className="bg-marketplace-gray-50 dark:bg-marketplace-gray-800 rounded-marketplace p-4">
                  <div className="text-sm text-marketplace-text-secondary mb-1">Category</div>
                  <div className="font-semibold text-marketplace-text-primary">{item.category}</div>
                </div>
                <div className="bg-marketplace-gray-50 dark:bg-marketplace-gray-800 rounded-marketplace p-4">
                  <div className="text-sm text-marketplace-text-secondary mb-1">Listed</div>
                  <div className="font-semibold text-marketplace-text-primary">
                    {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString() : 'Recently'}
                  </div>
                </div>
                <div className="bg-marketplace-gray-50 dark:bg-marketplace-gray-800 rounded-marketplace p-4">
                  <div className="text-sm text-marketplace-text-secondary mb-1">Location</div>
                  <div className="font-semibold text-marketplace-text-primary truncate">
                    {item.location || 'Not specified'}
                  </div>
                </div>
              </div>

              {/* Trade Preferences */}
              {item.interestedIn && (
                <div className="border-t border-marketplace-border-light pt-6">
                  <h3 className="text-lg font-bold text-marketplace-text-primary mb-3 flex items-center">
                    <Package size={20} className="mr-2 text-marketplace-secondary" />
                    What the seller wants in exchange
                  </h3>
                  <p className="text-marketplace-text-secondary bg-marketplace-gray-50 dark:bg-marketplace-gray-800 rounded-marketplace p-4">
                    {item.interestedIn}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6">
              <h3 className="text-lg font-bold text-marketplace-text-primary mb-4 flex items-center">
                <User size={20} className="mr-2 text-marketplace-primary" />
                Seller Information
              </h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-marketplace-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {(item.userDisplayName || item.ownerName || 'U').charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-marketplace-text-primary">
                      {item.userDisplayName || item.ownerName || 'Anonymous User'}
                    </h4>
                    <CheckCircle size={16} className="text-marketplace-success" />
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star size={12} className="text-marketplace-secondary fill-current" />
                      <span className="text-sm text-marketplace-text-secondary">4.8 (127 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-marketplace-text-secondary">Response rate</span>
                  <span className="font-semibold text-marketplace-success">98%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-marketplace-text-secondary">Response time</span>
                  <span className="font-semibold text-marketplace-text-primary">Within 1 hour</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-marketplace-text-secondary">Member since</span>
                  <span className="font-semibold text-marketplace-text-primary">2019</span>
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwnItem ? (
                <div className="space-y-3">
                  <button
                    onClick={handleTradeRequest}
                    className="w-full bg-marketplace-primary text-white py-3 px-4 rounded-marketplace-lg font-bold hover:bg-marketplace-primary-hover transition-colors flex items-center justify-center shadow-marketplace"
                  >
                    <MessageCircle size={20} className="mr-2" />
                    Request Trade
                  </button>
                  <button className="w-full bg-marketplace-secondary text-marketplace-primary py-3 px-4 rounded-marketplace-lg font-bold hover:bg-marketplace-secondary-dark transition-colors flex items-center justify-center">
                    <Phone size={20} className="mr-2" />
                    Contact Seller
                  </button>
                </div>
              ) : (
                <div className="bg-marketplace-secondary bg-opacity-20 border border-marketplace-secondary rounded-marketplace-lg p-4">
                  <div className="flex items-center space-x-2 text-marketplace-secondary">
                    <Shield size={16} />
                    <span className="font-semibold text-sm">This is your item</span>
                  </div>
                  <p className="text-sm text-marketplace-text-secondary mt-1">
                    You can edit or manage this listing from your items page.
                  </p>
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6">
              <h3 className="text-lg font-bold text-marketplace-text-primary mb-4 flex items-center">
                <Shield size={20} className="mr-2 text-marketplace-success" />
                Safety Tips
              </h3>
              <div className="space-y-3 text-sm text-marketplace-text-secondary">
                <div className="flex items-start space-x-2">
                  <CheckCircle size={16} className="text-marketplace-success mt-0.5 flex-shrink-0" />
                  <span>Meet in a public, well-lit place</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle size={16} className="text-marketplace-success mt-0.5 flex-shrink-0" />
                  <span>Inspect items before trading</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle size={16} className="text-marketplace-success mt-0.5 flex-shrink-0" />
                  <span>Trust your instincts</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle size={16} className="text-marketplace-success mt-0.5 flex-shrink-0" />
                  <span>Never share personal information</span>
                </div>
              </div>
            </div>

            {/* Related Items Preview */}
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6">
              <h3 className="text-lg font-bold text-marketplace-text-primary mb-4 flex items-center">
                <TrendingUp size={20} className="mr-2 text-marketplace-primary" />
                Similar Items
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 hover:bg-marketplace-gray-50 dark:hover:bg-marketplace-gray-800 rounded-marketplace cursor-pointer transition-colors">
                    <img
                      src={`https://images.unsplash.com/photo-${1600000000 + index}000?w=60&h=60&fit=crop`}
                      alt={`Similar item ${index}`}
                      className="w-12 h-12 rounded-marketplace object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-marketplace-text-primary text-sm truncate">
                        Similar {item.category} Item
                      </p>
                      <p className="text-marketplace-primary font-bold text-sm">
                        ₹{((item.value || 0) + Math.floor(Math.random() * 1000)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Request Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg max-w-md w-full shadow-marketplace-elevated border border-marketplace-border-light"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-marketplace-text-primary">
                  Request Trade
                </h3>
                <button
                  onClick={() => setShowTradeModal(false)}
                  className="p-2 hover:bg-marketplace-gray-100 dark:hover:bg-marketplace-gray-800 rounded-marketplace transition-colors"
                >
                  <X size={20} className="text-marketplace-text-secondary" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-3 p-3 bg-marketplace-gray-50 dark:bg-marketplace-gray-800 rounded-marketplace">
                  <img
                    src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop'}
                    alt={item.title}
                    className="w-12 h-12 rounded-marketplace object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-marketplace-text-primary truncate">
                      {item.title}
                    </p>
                    <p className="text-marketplace-primary font-bold">
                      ₹{(item.value || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-marketplace-text-primary mb-2">
                  Message to {item.userDisplayName || 'seller'}
                </label>
                <textarea
                  value={tradeMessage}
                  onChange={(e) => setTradeMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-marketplace-border-medium rounded-marketplace-lg focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary bg-white dark:bg-marketplace-gray-800 text-marketplace-text-primary transition-colors"
                  placeholder="Hi! I'm interested in trading for this item. I have [describe your item] that might interest you. Let me know if you'd like to discuss!"
                />
                <p className="mt-2 text-xs text-marketplace-text-secondary">
                  Be specific about what you're offering to increase your chances of a successful trade.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={submitTradeRequest}
                  disabled={!tradeMessage.trim()}
                  className="flex-1 bg-marketplace-primary text-white py-3 px-4 rounded-marketplace-lg font-bold hover:bg-marketplace-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Send size={16} className="mr-2" />
                  Send Request
                </button>
                <button
                  onClick={() => setShowTradeModal(false)}
                  className="flex-1 bg-marketplace-gray-200 dark:bg-marketplace-gray-800 text-marketplace-text-primary py-3 px-4 rounded-marketplace-lg font-bold hover:bg-marketplace-gray-300 dark:hover:bg-marketplace-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
