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

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [stats, setStats] = useState({
    totalViews: 12847,
    activeListings: 23,
    completedTrades: 156,
    savedItems: 89,
    monthlyRevenue: 3420,
    responseRate: 98,
    avgRating: 4.8,
    totalMessages: 234,
  });

  // Real marketplace-style featured items
  const featuredItems = [
    {
      id: 1,
      title: "iPhone 15 Pro Max 256GB - Natural Titanium",
      category: "Electronics",
      subcategory: "Mobile Phones",
      price: "₹89,999",
      originalPrice: "₹1,34,900",
      discountPercent: 33,
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
      condition: "Like New",
      location: "Mumbai, Maharashtra",
      timeAgo: "2 hours ago",
      views: 1847,
      likes: 89,
      isNegotiable: true,
      isUrgent: true,
      isFeatured: true,
      seller: {
        name: "Rajesh Kumar",
        rating: 4.9,
        reviewCount: 127,
        isVerified: true,
        isPowerSeller: true,
        responseTime: "Within 1 hour",
        memberSince: "2019",
      },
      features: [
        "Original Box",
        "Bill Available",
        "No Damage",
        "Fast Charging",
      ],
      boost: "Premium",
    },
    {
      id: 2,
      title: "Royal Enfield Classic 350 - Excellent Condition",
      category: "Vehicles",
      subcategory: "Motorcycles",
      price: "₹1,25,000",
      originalPrice: "₹1,85,000",
      discountPercent: 32,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      condition: "Excellent",
      location: "Pune, Maharashtra",
      timeAgo: "4 hours ago",
      views: 892,
      likes: 43,
      isNegotiable: true,
      isUrgent: false,
      isFeatured: true,
      seller: {
        name: "Amit Singh",
        rating: 4.7,
        reviewCount: 89,
        isVerified: true,
        isPowerSeller: false,
        responseTime: "Within 2 hours",
        memberSince: "2020",
      },
      features: [
        "Single Owner",
        "Full Service History",
        "Insurance Valid",
        "RC Available",
      ],
      boost: "Standard",
    },
    {
      id: 3,
      title: "MacBook Air M2 13-inch - Space Grey (2022)",
      category: "Electronics",
      subcategory: "Laptops",
      price: "₹95,000",
      originalPrice: "₹1,19,900",
      discountPercent: 21,
      image:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      condition: "Like New",
      location: "Bangalore, Karnataka",
      timeAgo: "6 hours ago",
      views: 1234,
      likes: 67,
      isNegotiable: true,
      isUrgent: false,
      isFeatured: true,
      seller: {
        name: "Priya Sharma",
        rating: 4.8,
        reviewCount: 156,
        isVerified: true,
        isPowerSeller: true,
        responseTime: "Within 30 mins",
        memberSince: "2018",
      },
      features: [
        "Apple Warranty",
        "Original Charger",
        "Pristine Condition",
        "Fast Delivery",
      ],
      boost: "Premium",
    },
  ];

  const categories = [
    {
      id: "all",
      name: "All Categories",
      icon: Grid3X3,
      count: 12450,
      color: "text-marketplace-primary",
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: Package,
      count: 3420,
      color: "text-category-electronics",
    },
    {
      id: "vehicles",
      name: "Vehicles",
      icon: Activity,
      count: 1890,
      color: "text-category-cars",
    },
    {
      id: "fashion",
      name: "Fashion",
      icon: ShoppingBag,
      count: 2340,
      color: "text-category-fashion",
    },
    {
      id: "home",
      name: "Home & Garden",
      icon: Package,
      count: 1890,
      color: "text-category-home",
    },
    {
      id: "sports",
      name: "Sports & Fitness",
      icon: Activity,
      count: 1230,
      color: "text-category-sports",
    },
  ];

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
              <div className="hidden lg:flex flex-col text-right text-white">
                <span className="text-sm opacity-80">Active Listings</span>
                <span className="text-2xl font-bold">
                  {stats.activeListings}
                </span>
              </div>
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
                      return (
                        <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-900 transition-colors duration-300">
                          {/* OLX-Style Header Banner */}
                          <div className="bg-gradient-to-r from-marketplace-primary via-marketplace-primary-light to-marketplace-primary border-b border-marketplace-border-light shadow-marketplace dark:shadow-marketplace-dark">
                            <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                <div className="text-white dark:text-marketplace-primary-light">
                                  <h1 className="text-xl font-bold mb-1">
                                    Welcome back, {currentUser?.displayName?.split(" ")[0] || "User"}! 👋
                                  </h1>
                                  <p className="text-marketplace-primary-light text-sm">
                                    Your marketplace dashboard • Discover, buy, sell with confidence
                                  </p>
                                  <div className="flex items-center mt-2 space-x-3">
                                    <div className="flex items-center space-x-1">
                                      <TrendingUp size={14} className="text-marketplace-secondary" />
                                      <span className="text-xs">+{stats.totalViews.toLocaleString()} views</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Star size={14} className="text-marketplace-secondary" />
                                      <span className="text-xs">{stats.avgRating}/5 rating</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 lg:mt-0 flex items-center space-x-2">
                                  <Link
                                    to="/add-item"
                                    className="bg-marketplace-secondary hover:bg-marketplace-secondary-dark text-marketplace-primary font-bold px-4 py-2 rounded-marketplace-lg shadow-marketplace-elevated transition-all duration-200 transform hover:scale-105 flex items-center space-x-1 text-xs"
                                  >
                                    <Camera size={14} />
                                    <span>SELL NOW</span>
                                  </Link>
                                  <div className="hidden lg:flex flex-col text-right text-white dark:text-marketplace-primary-light">
                                    <span className="text-xs opacity-80">Active Listings</span>
                                    <span className="text-base font-bold">{stats.activeListings}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
                            {/* Quick Stats Cards - OLX Style */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                              <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace dark:shadow-marketplace-dark p-3 hover:shadow-marketplace-hover transition-shadow text-xs">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xl font-bold text-marketplace-primary">{stats.totalViews.toLocaleString()}</p>
                                    <p className="text-xs text-marketplace-text-secondary mt-0.5">Views</p>
                                    <div className="flex items-center mt-1">
                                      <TrendingUp size={10} className="text-marketplace-success mr-0.5" />
                                      <span className="text-xs text-marketplace-success font-medium">+12% this week</span>
                                    </div>
                                  </div>
                                  <Eye className="text-marketplace-primary opacity-20" size={18} />
                                </div>
                              </div>
                              <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace dark:shadow-marketplace-dark p-3 hover:shadow-marketplace-hover transition-shadow text-xs">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xl font-bold text-marketplace-secondary">{stats.activeListings}</p>
                                    <p className="text-xs text-marketplace-text-secondary mt-0.5">Active Ads</p>
                                    <div className="flex items-center mt-1">
                                      <ArrowUpRight size={10} className="text-marketplace-success mr-0.5" />
                                      <span className="text-xs text-marketplace-success font-medium">3 new today</span>
                                    </div>
                                  </div>
                                  <Package className="text-marketplace-secondary opacity-20" size={18} />
                                </div>
                              </div>
                              <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace dark:shadow-marketplace-dark p-3 hover:shadow-marketplace-hover transition-shadow text-xs">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xl font-bold text-category-electronics">₹{stats.monthlyRevenue.toLocaleString()}</p>
                                    <p className="text-xs text-marketplace-text-secondary mt-0.5">This Month</p>
                                    <div className="flex items-center mt-1">
                                      <DollarSign size={10} className="text-marketplace-success mr-0.5" />
                                      <span className="text-xs text-marketplace-success font-medium">+8% vs last month</span>
                                    </div>
                                  </div>
                                  <BarChart3 className="text-category-electronics opacity-20" size={18} />
                                </div>
                              </div>
                              <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace dark:shadow-marketplace-dark p-3 hover:shadow-marketplace-hover transition-shadow text-xs">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xl font-bold text-marketplace-success">{stats.responseRate}%</p>
                                    <p className="text-xs text-marketplace-text-secondary mt-0.5">Response Rate</p>
                                    <div className="flex items-center mt-1">
                                      <ThumbsUp size={10} className="text-marketplace-success mr-0.5" />
                                      <span className="text-xs text-marketplace-success font-medium">Excellent</span>
                                    </div>
                                  </div>
                                  <MessageCircle className="text-marketplace-success opacity-20" size={18} />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                              {/* Main Content */}
                              <div className="lg:col-span-9">
                                {/* Quick Actions - OLX Style */}
                                <div className="mb-4">
                                  <h2 className="text-base font-bold text-marketplace-text-primary mb-2 flex items-center">
                                    <Zap className="mr-1 text-marketplace-secondary" size={16} />
                                    Quick Actions
                                  </h2>
                                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                    {quickActions.map((action, index) => (
                                      <Link
                                        key={index}
                                        to={action.link}
                                        className="relative bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light hover:border-marketplace-border-medium shadow-marketplace dark:shadow-marketplace-dark hover:shadow-marketplace-lg transition-all duration-200 p-3 group overflow-hidden text-xs"
                                      >
                                        {action.popular && (
                                          <div className="absolute top-1 right-1 bg-marketplace-error text-white text-[10px] px-1 py-0.5 rounded-marketplace font-semibold">
                                            POPULAR
                                          </div>
                                        )}
                                        <div className={`w-8 h-8 ${action.color} rounded-marketplace-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200`}>
                                          <action.icon className={action.textColor} size={14} />
                                        </div>
                                        <h3 className="font-bold text-marketplace-text-primary mb-1 text-xs">{action.title}</h3>
                                        <p className="text-xs text-marketplace-text-secondary leading-relaxed">{action.description}</p>
                                        <div className="mt-2 flex items-center text-marketplace-primary font-medium text-xs group-hover:translate-x-1 transition-transform">
                                          <span>Get Started</span>
                                          <ChevronRight size={12} className="ml-1" />
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>

                                {/* Featured Items Header */}
                                <div className="mb-3">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                    <h2 className="text-base font-bold text-marketplace-text-primary flex items-center">
                                      <Star className="mr-1 text-marketplace-secondary" size={16} />
                                      Featured Ads Near You
                                    </h2>
                                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                                      <button
                                        onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                                        className="inline-flex items-center px-2 py-1 border border-marketplace-border-medium rounded-marketplace text-xs font-medium text-marketplace-text-secondary hover:text-marketplace-primary hover:border-marketplace-primary transition-colors"
                                      >
                                        {viewMode === "grid" ? <List size={12} /> : <Grid3X3 size={12} />}
                                        <span className="ml-1">{viewMode === "grid" ? "List" : "Grid"}</span>
                                      </button>
                                      <button className="inline-flex items-center px-2 py-1 bg-marketplace-primary text-white rounded-marketplace text-xs font-medium hover:bg-marketplace-primary-hover transition-colors">
                                        <Filter size={12} />
                                        <span className="ml-1">Filters</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Featured Items Grid - OLX Style */}
                                <div className={`grid gap-3 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                                  {featuredItems.map((item, index) => (
                                    <motion.div
                                      key={item.id}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light hover:border-marketplace-primary shadow-marketplace dark:shadow-marketplace-dark hover:shadow-marketplace-elevated transition-all duration-300 overflow-hidden group cursor-pointer text-xs"
                                    >
                                      {/* Item Image */}
                                      <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                          src={item.image}
                                          alt={item.title}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                          onError={(e) => {
                                            e.target.src = '/api/placeholder/400/300';
                                          }}
                                        />
                                        {/* Overlay Badges */}
                                        <div className="absolute top-2 left-2 flex flex-col space-y-1">
                                          {item.isFeatured && (
                                            <span className="bg-marketplace-secondary text-marketplace-primary px-2 py-0.5 rounded-marketplace text-[10px] font-bold shadow-marketplace">
                                              ⭐ FEATURED
                                            </span>
                                          )}
                                          {item.isUrgent && (
                                            <span className="bg-marketplace-error text-white px-2 py-0.5 rounded-marketplace text-[10px] font-bold shadow-marketplace animate-pulse">
                                              🔥 URGENT
                                            </span>
                                          )}
                                          {item.boost === "Premium" && (
                                            <span className="bg-purple-600 text-white px-2 py-0.5 rounded-marketplace text-[10px] font-bold shadow-marketplace">
                                              💎 PREMIUM
                                            </span>
                                          )}
                                        </div>
                                        {/* Discount Badge */}
                                        {item.discountPercent > 0 && (
                                          <div className="absolute top-2 right-2 bg-marketplace-success text-white px-2 py-0.5 rounded-marketplace text-xs font-bold shadow-marketplace">
                                            -{item.discountPercent}%
                                          </div>
                                        )}
                                        {/* Quick Actions */}
                                        <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                          <button className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-marketplace hover:bg-white transition-colors">
                                            <Heart size={12} className="text-marketplace-gray-600 hover:text-marketplace-error" />
                                          </button>
                                          <button className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-marketplace hover:bg-white transition-colors">
                                            <Share2 size={12} className="text-marketplace-gray-600 hover:text-marketplace-primary" />
                                          </button>
                                        </div>
                                      </div>
                                      {/* Item Info */}
                                      <div className="p-2">
                                        {/* Price Section */}
                                        <div className="flex items-center justify-between mb-1">
                                          <div className="flex items-center space-x-1">
                                            <span className="text-base font-bold text-marketplace-primary">{item.price}</span>
                                            {item.originalPrice && (
                                              <span className="text-xs text-marketplace-text-muted line-through">{item.originalPrice}</span>
                                            )}
                                          </div>
                                          {item.isNegotiable && (
                                            <span className="text-[10px] bg-marketplace-warning bg-opacity-20 text-marketplace-warning px-1 py-0.5 rounded-marketplace font-semibold">
                                              NEGOTIABLE
                                            </span>
                                          )}
                                        </div>
                                        {/* Title & Category */}
                                        <h3 className="font-bold text-marketplace-text-primary text-xs mb-1 line-clamp-2 group-hover:text-marketplace-primary transition-colors">
                                          {item.title}
                                        </h3>
                                        <p className="text-xs text-marketplace-text-secondary mb-1">{item.subcategory} • {item.category}</p>
                                        {/* Features */}
                                        <div className="flex flex-wrap gap-0.5 mb-2">
                                          {item.features.slice(0, 2).map((feature, idx) => (
                                            <span key={idx} className="text-[10px] bg-marketplace-gray-100 dark:bg-marketplace-gray-800 text-marketplace-text-secondary px-1 py-0.5 rounded-marketplace">
                                              {feature}
                                            </span>
                                          ))}
                                          {item.features.length > 2 && (
                                            <span className="text-[10px] bg-marketplace-gray-100 dark:bg-marketplace-gray-800 text-marketplace-text-secondary px-1 py-0.5 rounded-marketplace">
                                              +{item.features.length - 2} more
                                            </span>
                                          )}
                                        </div>
                                        {/* Location & Time */}
                                        <div className="flex items-center justify-between text-xs text-marketplace-text-secondary mb-2">
                                          <div className="flex items-center space-x-0.5">
                                            <MapPin size={10} />
                                            <span>{item.location}</span>
                                          </div>
                                          <div className="flex items-center space-x-0.5">
                                            <Clock size={10} />
                                            <span>{item.timeAgo}</span>
                                          </div>
                                        </div>
                                        {/* Seller Info */}
                                        <div className="flex items-center justify-between pt-2 border-t border-marketplace-border-light">
                                          <div className="flex items-center space-x-2">
                                            <div className="w-7 h-7 bg-marketplace-primary rounded-full flex items-center justify-center shadow-marketplace">
                                              <span className="text-white font-bold text-xs">
                                                {item.seller.name.charAt(0)}
                                              </span>
                                            </div>
                                            <div>
                                              <div className="flex items-center space-x-1">
                                                <span className="text-xs font-semibold text-marketplace-text-primary">{item.seller.name}</span>
                                                {item.seller.isVerified && (
                                                  <CheckCircle size={10} className="text-marketplace-success" />
                                                )}
                                                {item.seller.isPowerSeller && (
                                                  <Award size={10} className="text-marketplace-secondary" />
                                                )}
                                              </div>
                                              <div className="flex items-center space-x-1 mt-0.5">
                                                <div className="flex items-center space-x-0.5">
                                                  <Star size={10} className="text-marketplace-secondary fill-current" />
                                                  <span className="text-[10px] text-marketplace-text-secondary">{item.seller.rating} ({item.seller.reviewCount})</span>
                                                </div>
                                                <span className="text-[10px] text-marketplace-text-muted">• {item.seller.responseTime}</span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-2 text-[10px] text-marketplace-text-secondary">
                                            <div className="flex items-center space-x-0.5">
                                              <Eye size={10} />
                                              <span>{item.views.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-0.5">
                                              <Heart size={10} />
                                              <span>{item.likes}</span>
                                            </div>
                                          </div>
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex space-x-1 mt-2">
                                          <button className="flex-1 bg-marketplace-primary text-white py-1 px-2 rounded-marketplace font-semibold hover:bg-marketplace-primary-hover transition-colors flex items-center justify-center space-x-1 text-xs">
                                            <Phone size={10} />
                                            <span>Call</span>
                                          </button>
                                          <button className="flex-1 bg-marketplace-gray-100 dark:bg-marketplace-gray-800 text-marketplace-text-primary py-1 px-2 rounded-marketplace font-semibold hover:bg-marketplace-gray-200 dark:hover:bg-marketplace-gray-700 transition-colors flex items-center justify-center space-x-1 text-xs">
                                            <MessageCircle size={10} />
                                            <span>Chat</span>
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                                {/* Load More Button */}
                                <div className="text-center mt-4">
                                  <button className="bg-marketplace-primary text-white px-4 py-2 rounded-marketplace-lg font-semibold hover:bg-marketplace-primary-hover transition-colors shadow-marketplace dark:shadow-marketplace-dark text-xs">
                                    Load More Ads
                                  </button>
                                </div>
                              </div>
                              {/* Right Sidebar */}
                              <div className="lg:col-span-3 space-y-3">
                                {/* Categories Widget */}
                                <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace dark:shadow-marketplace-dark p-3 text-xs">
                                  <h3 className="font-bold text-marketplace-text-primary mb-2 flex items-center text-xs">
                                    <Grid3X3 size={12} className="mr-1" />
                                    Browse Categories
                                  </h3>
                                  <div className="space-y-1">
                                    {categories.map((category) => (
                                      <Link
                                        key={category.id}
                                        to={`/browse?category=${category.id}`}
                                        className="flex items-center justify-between p-2 hover:bg-marketplace-gray-50 dark:hover:bg-marketplace-gray-800 rounded-marketplace transition-colors group text-xs"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <category.icon size={12} className={`${category.color} group-hover:scale-110 transition-transform`} />
                                          <span className="text-xs font-medium text-marketplace-text-primary group-hover:text-marketplace-primary transition-colors">
                                            {category.name}
                                          </span>
                                        </div>
                                        <span className="text-[10px] text-marketplace-text-secondary bg-marketplace-gray-100 dark:bg-marketplace-gray-800 px-1 py-0.5 rounded-marketplace font-medium">
                                          {category.count.toLocaleString()}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                                {/* Recent Activity */}
                                <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace dark:shadow-marketplace-dark p-3 text-xs">
                                  <h3 className="font-bold text-marketplace-text-primary mb-2 flex items-center text-xs">
                                    <Activity size={12} className="mr-1" />
                                    Recent Activity
                                  </h3>
                                  <div className="space-y-2">
                                    <div className="flex items-start space-x-2">
                                      <div className="w-2 h-2 bg-marketplace-success rounded-full mt-1 animate-pulse"></div>
                                      <div>
                                        <p className="text-xs text-marketplace-text-primary">
                                          <span className="font-semibold">Rajesh K.</span> viewed your <span className="font-medium">iPhone 14 Pro</span>
                                        </p>
                                        <p className="text-[10px] text-marketplace-text-secondary">2 minutes ago</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <div className="w-2 h-2 bg-marketplace-secondary rounded-full mt-1"></div>
                                      <div>
                                        <p className="text-xs text-marketplace-text-primary">
                                          New message from <span className="font-semibold">Priya S.</span> about <span className="font-medium">MacBook Air</span>
                                        </p>
                                        <p className="text-[10px] text-marketplace-text-secondary">15 minutes ago</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <div className="w-2 h-2 bg-marketplace-primary rounded-full mt-1"></div>
                                      <div>
                                        <p className="text-xs text-marketplace-text-primary">
                                          Your <span className="font-medium">Gaming Setup</span> ad got 50+ views today
                                        </p>
                                        <p className="text-[10px] text-marketplace-text-secondary">1 hour ago</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <div className="w-2 h-2 bg-category-fashion rounded-full mt-1"></div>
                                      <div>
                                        <p className="text-xs text-marketplace-text-primary">
                                          <span className="font-semibold">Amit P.</span> saved your <span className="font-medium">Royal Enfield</span> ad
                                        </p>
                                        <p className="text-[10px] text-marketplace-text-secondary">3 hours ago</p>
                                      </div>
                                    </div>
                                  </div>
                                  <Link
                                    to="/notifications"
                                    className="block mt-2 text-center text-marketplace-primary hover:text-marketplace-primary-hover font-medium text-xs py-1 border-t border-marketplace-border-light"
                                  >
                                    View All Activity
                                  </Link>
                                </div>
                                {/* Quick Tips */}
                                <div className="bg-gradient-to-br from-marketplace-secondary to-orange-400 rounded-marketplace-lg p-3 text-marketplace-primary text-xs">
                                  <h3 className="font-bold mb-2 flex items-center text-xs">
                                    <Zap size={12} className="mr-1" />
                                    💡 Selling Tips
                                  </h3>
                                  <ul className="space-y-1 text-xs">
                                    <li className="flex items-start space-x-1">
                                      <CheckCircle size={10} className="mt-0.5 flex-shrink-0" />
                                      <span>Add clear, high-quality photos</span>
                                    </li>
                                    <li className="flex items-start space-x-1">
                                      <CheckCircle size={10} className="mt-0.5 flex-shrink-0" />
                                      <span>Write detailed descriptions</span>
                                    </li>
                                    <li className="flex items-start space-x-1">
                                      <CheckCircle size={10} className="mt-0.5 flex-shrink-0" />
                                      <span>Price competitively</span>
                                    </li>
                                    <li className="flex items-start space-x-1">
                                      <CheckCircle size={10} className="mt-0.5 flex-shrink-0" />
                                      <span>Respond quickly to messages</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
