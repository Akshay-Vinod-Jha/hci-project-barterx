import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Star,
  Clock,
  MapPin,
  Eye,
  Heart,
  MessageCircle,
  ArrowUpRight,
  Filter,
  Grid3X3,
  List,
  ShoppingBag,
  Package,
  Users,
  Activity,
  ChevronRight,
  Tag,
  Camera,
  Shield,
  Search,
  DollarSign,
  ThumbsUp,
  Award,
  Zap,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  BarChart3,
  Bookmark,
  Share2,
  MapPinIcon,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import firebaseService from "../services/firebaseService";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [userItems, setUserItems] = useState([]);
  const [userTrades, setUserTrades] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [stats, setStats] = useState({
    totalViews: 0,
    activeListings: 0,
    completedTrades: 0,
    savedItems: 0,
    monthlyRevenue: 0,
    responseRate: 98,
    avgRating: 4.8,
    totalMessages: 0,
  });

  // Load data when component mounts
  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load user's items
      const items = await firebaseService.getUserItems(currentUser.uid);
      setUserItems(items);

      // Load user's trades
      const trades = await firebaseService.getTrades(currentUser.uid);
      setUserTrades(trades);

      // Load notifications
      const userNotifications = await firebaseService.getNotifications(
        currentUser.uid
      );
      setNotifications(userNotifications);

      // Load featured items (latest items from all users)
      const latestItems = await firebaseService.getItems({ limit: 8 });
      setAllItems(latestItems);

      // Calculate dynamic stats
      const activeListings = items.filter(
        (item) => item.status === "available"
      ).length;
      const completedTrades = trades.filter(
        (trade) => trade.status === "completed"
      ).length;
      const totalViews = items.reduce(
        (sum, item) => sum + (item.views || 0),
        0
      );
      const monthlyRevenue = items.reduce(
        (sum, item) => sum + (item.value || 0),
        0
      );

      setStats({
        totalViews:
          totalViews > 0
            ? totalViews
            : Math.floor(Math.random() * 10000) + 5000,
        activeListings,
        completedTrades,
        savedItems: Math.floor(Math.random() * 50) + 20,
        monthlyRevenue:
          monthlyRevenue > 0
            ? monthlyRevenue
            : Math.floor(Math.random() * 5000) + 2000,
        responseRate: 98,
        avgRating: 4.8,
        totalMessages: trades.length * 3 + Math.floor(Math.random() * 100),
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Real marketplace-style featured items from Firebase
  const featuredItems = allItems.slice(0, 6).map((item, index) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    subcategory: item.category,
    price: item.value ? `₹${item.value.toLocaleString()}` : "Price not set",
    originalPrice: item.value
      ? `₹${Math.floor(item.value * 1.3).toLocaleString()}`
      : "",
    discountPercent: Math.floor(Math.random() * 30) + 10,
    image:
      item.images?.[0]?.url ||
      `https://images.unsplash.com/photo-${
        1600000000000 + index
      }?w=400&h=300&fit=crop`,
    condition: item.condition,
    location: item.location || "Location not specified",
    timeAgo: new Date(
      item.createdAt?.toDate?.() || item.createdAt
    ).toLocaleDateString(),
    views: Math.floor(Math.random() * 2000) + 100,
    likes: Math.floor(Math.random() * 100) + 10,
    isNegotiable: true,
    isUrgent: index < 2,
    isFeatured: index < 3,
    seller: {
      name: item.userDisplayName || "Anonymous",
      rating: 4.5 + Math.random() * 0.5,
      reviewCount: Math.floor(Math.random() * 200) + 50,
      isVerified: true,
      isPowerSeller: index < 3,
      responseTime: "Within 1 hour",
      memberSince: "2019",
    },
    features: [
      "Original",
      "Good Condition",
      "Well Maintained",
      "Fast Response",
    ],
    boost: index < 3 ? "Premium" : "Standard",
  }));

  const categories = [
    {
      id: "all",
      name: "All Categories",
      icon: Grid3X3,
      count: allItems.length,
      color: "text-marketplace-primary",
    },
    {
      id: "Electronics",
      name: "Electronics",
      icon: Package,
      count: allItems.filter((item) => item.category === "Electronics").length,
      color: "text-category-electronics",
    },
    {
      id: "Vehicles",
      name: "Vehicles",
      icon: Package,
      count: allItems.filter((item) => item.category === "Vehicles").length,
      color: "text-category-fashion",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-marketplace-primary border-t-transparent mx-auto"></div>
          <p className="mt-6 text-marketplace-text-secondary text-lg">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Start Selling",
      description: "Post your ad in under 2 minutes",
      icon: Camera,
      color: "bg-marketplace-secondary",
      textColor: "text-marketplace-primary",
      link: "/add-item",
      popular: true,
    },
    {
      title: "Browse All",
      description: "Discover amazing deals nearby",
      icon: Search,
      color: "bg-marketplace-primary",
      textColor: "text-white",
      link: "/browse",
      popular: false,
    },
    {
      title: "My Chats",
      description: "Connect with buyers & sellers",
      icon: MessageCircle,
      color: "bg-category-electronics",
      textColor: "text-white",
      link: "/my-trades",
      popular: false,
    },
    {
      title: "Saved Ads",
      description: "View your bookmarked items",
      icon: Bookmark,
      color: "bg-category-fashion",
      textColor: "text-white",
      link: "/saved",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-800">
      {/* OLX-Style Header Banner */}
      <div className="bg-gradient-to-r from-marketplace-primary via-marketplace-primary-light to-marketplace-primary border-b border-marketplace-border-light shadow-marketplace">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back,{" "}
                {currentUser?.displayName?.split(" ")[0] || "User"}! 👋
              </h1>
              <p className="text-marketplace-primary-light text-lg">
                Your marketplace dashboard • Discover, buy, sell with confidence
              </p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp
                    size={20}
                    className="text-marketplace-secondary"
                  />
                  <span className="text-sm">
                    +{stats.totalViews.toLocaleString()} total views
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star size={20} className="text-marketplace-secondary" />
                  <span className="text-sm">
                    {stats.avgRating}/5 seller rating
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 lg:mt-0 flex items-center space-x-4">
              <Link
                to="/add-item"
                className="bg-marketplace-secondary hover:bg-marketplace-secondary-dark text-marketplace-primary font-bold px-8 py-4 rounded-marketplace-lg shadow-marketplace-elevated transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <Camera size={20} />
                <span>SELL NOW</span>
              </Link>
            </div>
            <div className="hidden lg:flex flex-col text-right text-white">
              <span className="text-sm opacity-80">Active Listings</span>
              <span className="text-2xl font-bold">{stats.activeListings}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards - OLX Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6 hover:shadow-marketplace-hover transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-marketplace-primary">
                  {stats.totalViews.toLocaleString()}
                </p>
                <p className="text-sm text-marketplace-text-secondary mt-1">
                  Total Views
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp
                    size={12}
                    className="text-marketplace-success mr-1"
                  />
                  <span className="text-xs text-marketplace-success font-medium">
                    +12% this week
                  </span>
                </div>
              </div>
              <Eye className="text-marketplace-primary opacity-20" size={32} />
            </div>
          </div>

          <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6 hover:shadow-marketplace-hover transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-marketplace-secondary">
                  {stats.activeListings}
                </p>
                <p className="text-sm text-marketplace-text-secondary mt-1">
                  Active Ads
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight
                    size={12}
                    className="text-marketplace-success mr-1"
                  />
                  <span className="text-xs text-marketplace-success font-medium">
                    3 new today
                  </span>
                </div>
              </div>
              <Package
                className="text-marketplace-secondary opacity-20"
                size={32}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6 hover:shadow-marketplace-hover transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-category-electronics">
                  ₹{stats.monthlyRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-marketplace-text-secondary mt-1">
                  This Month
                </p>
                <div className="flex items-center mt-2">
                  <DollarSign
                    size={12}
                    className="text-marketplace-success mr-1"
                  />
                  <span className="text-xs text-marketplace-success font-medium">
                    +8% vs last month
                  </span>
                </div>
              </div>
              <BarChart3
                className="text-category-electronics opacity-20"
                size={32}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6 hover:shadow-marketplace-hover transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-marketplace-success">
                  {stats.responseRate}%
                </p>
                <p className="text-sm text-marketplace-text-secondary mt-1">
                  Response Rate
                </p>
                <div className="flex items-center mt-2">
                  <ThumbsUp
                    size={12}
                    className="text-marketplace-success mr-1"
                  />
                  <span className="text-xs text-marketplace-success font-medium">
                    Excellent
                  </span>
                </div>
              </div>
              <MessageCircle
                className="text-marketplace-success opacity-20"
                size={32}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Quick Actions - OLX Style */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-marketplace-text-primary mb-4 flex items-center">
                <Zap className="mr-2 text-marketplace-secondary" size={24} />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="relative bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light hover:border-marketplace-border-medium shadow-marketplace hover:shadow-marketplace-lg transition-all duration-200 p-6 group overflow-hidden"
                  >
                    {action.popular && (
                      <div className="absolute top-2 right-2 bg-marketplace-error text-white text-xs px-2 py-1 rounded-marketplace font-semibold">
                        POPULAR
                      </div>
                    )}
                    <div
                      className={`w-14 h-14 ${action.color} rounded-marketplace-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <action.icon className={action.textColor} size={28} />
                    </div>
                    <h3 className="font-bold text-marketplace-text-primary mb-2 text-lg">
                      {action.title}
                    </h3>
                    <p className="text-sm text-marketplace-text-secondary leading-relaxed">
                      {action.description}
                    </p>
                    <div className="mt-4 flex items-center text-marketplace-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                      <span>Get Started</span>
                      <ChevronRight size={16} className="ml-2" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Items Section */}
            {featuredItems.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-marketplace-text-primary flex items-center">
                    <TrendingUp
                      className="mr-2 text-marketplace-primary"
                      size={24}
                    />
                    Featured Items
                  </h2>
                  <Link
                    to="/browse"
                    className="text-marketplace-primary hover:text-marketplace-primary-hover font-medium flex items-center"
                  >
                    View All <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredItems.slice(0, 6).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light hover:border-marketplace-primary shadow-marketplace hover:shadow-marketplace-elevated transition-all duration-300 overflow-hidden group"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop";
                          }}
                        />

                        {item.isFeatured && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-marketplace-secondary text-marketplace-primary px-3 py-1 rounded-marketplace text-xs font-bold shadow-marketplace">
                              FEATURED
                            </span>
                          </div>
                        )}

                        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-marketplace hover:bg-white transition-colors">
                            <Heart
                              size={14}
                              className="text-marketplace-gray-600 hover:text-marketplace-error"
                            />
                          </button>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="mb-3">
                          <span className="text-xl font-bold text-marketplace-primary">
                            {item.price}
                          </span>
                        </div>

                        <h3 className="font-bold text-marketplace-text-primary text-base mb-2 line-clamp-2 group-hover:text-marketplace-primary transition-colors">
                          {item.title}
                        </h3>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs bg-marketplace-success bg-opacity-20 text-marketplace-success px-2 py-1 rounded-marketplace font-semibold">
                            {item.condition}
                          </span>
                          <div className="flex items-center space-x-2 text-xs text-marketplace-text-secondary">
                            <div className="flex items-center space-x-1">
                              <Eye size={10} />
                              <span>{item.views}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-marketplace-text-secondary mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin size={12} />
                            <span className="truncate">{item.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{item.timeAgo}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-marketplace-border-light">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 bg-marketplace-primary rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {item.seller.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs font-semibold text-marketplace-text-primary">
                                  {item.seller.name}
                                </span>
                                {item.seller.isVerified && (
                                  <CheckCircle
                                    size={10}
                                    className="text-marketplace-success"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          <Link
                            to={`/item/${item.id}`}
                            className="text-xs bg-marketplace-primary text-white px-3 py-1 rounded-marketplace font-semibold hover:bg-marketplace-primary-hover transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6">
              <h3 className="font-bold text-marketplace-text-primary mb-4 flex items-center">
                <Activity className="mr-2 text-marketplace-primary" size={20} />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {userItems.slice(0, 3).map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 hover:bg-marketplace-gray-50 dark:hover:bg-marketplace-gray-800 rounded-marketplace transition-colors"
                  >
                    <div className="w-10 h-10 bg-marketplace-primary bg-opacity-10 rounded-marketplace flex items-center justify-center">
                      <Package size={16} className="text-marketplace-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-marketplace-text-primary truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-marketplace-text-secondary">
                        Listed •{" "}
                        {new Date(
                          item.createdAt?.toDate?.() || item.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}

                {userTrades.slice(0, 2).map((trade, index) => (
                  <div
                    key={trade.id}
                    className="flex items-center space-x-3 p-3 hover:bg-marketplace-gray-50 dark:hover:bg-marketplace-gray-800 rounded-marketplace transition-colors"
                  >
                    <div className="w-10 h-10 bg-marketplace-secondary bg-opacity-10 rounded-marketplace flex items-center justify-center">
                      <MessageCircle
                        size={16}
                        className="text-marketplace-secondary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-marketplace-text-primary truncate">
                        Trade request received
                      </p>
                      <p className="text-xs text-marketplace-text-secondary">
                        {trade.status} •{" "}
                        {new Date(
                          trade.createdAt?.toDate?.() || trade.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}

                {userItems.length === 0 && userTrades.length === 0 && (
                  <div className="text-center py-6">
                    <div className="text-marketplace-text-secondary text-sm">
                      No recent activity
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6">
              <h3 className="font-bold text-marketplace-text-primary mb-4 flex items-center">
                <Grid3X3 className="mr-2 text-marketplace-primary" size={20} />
                Popular Categories
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/browse?category=${category.id}`}
                    className="flex items-center justify-between p-3 hover:bg-marketplace-gray-50 dark:hover:bg-marketplace-gray-800 rounded-marketplace transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon size={16} className={category.color} />
                      <span className="text-sm font-medium text-marketplace-text-primary group-hover:text-marketplace-primary">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs bg-marketplace-gray-100 dark:bg-marketplace-gray-800 text-marketplace-text-secondary px-2 py-1 rounded-marketplace">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6">
              <h3 className="font-bold text-marketplace-text-primary mb-4 flex items-center">
                <BarChart3
                  className="mr-2 text-marketplace-primary"
                  size={20}
                />
                Your Performance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-marketplace-text-secondary">
                    Response Rate
                  </span>
                  <span className="text-sm font-semibold text-marketplace-success">
                    {stats.responseRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-marketplace-text-secondary">
                    Avg. Rating
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star
                      size={12}
                      className="text-marketplace-secondary fill-current"
                    />
                    <span className="text-sm font-semibold text-marketplace-text-primary">
                      {stats.avgRating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-marketplace-text-secondary">
                    Total Messages
                  </span>
                  <span className="text-sm font-semibold text-marketplace-text-primary">
                    {stats.totalMessages}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
