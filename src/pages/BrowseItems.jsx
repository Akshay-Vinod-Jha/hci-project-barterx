import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Heart,
  Eye,
  Star,
  Grid3X3,
  List,
  SlidersHorizontal,
  TrendingUp,
  CheckCircle,
  Phone,
  MessageCircle,
  Share2,
  Bookmark,
  ChevronDown,
  DollarSign,
  Tag,
  Shield,
} from "lucide-react";
import firebaseService from "../services/firebaseService";

const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [location, setLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: "all", name: "All Categories", count: 0 },
    { id: "Electronics", name: "Electronics", count: 0 },
    { id: "Vehicles", name: "Vehicles", count: 0 },
    { id: "Home & Garden", name: "Home & Garden", count: 0 },
    { id: "Fashion", name: "Fashion", count: 0 },
    { id: "Sports & Recreation", name: "Sports", count: 0 },
    { id: "Books", name: "Books & Media", count: 0 },
    { id: "Other", name: "Other", count: 0 },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-1000", label: "Under ₹1,000" },
    { value: "1000-5000", label: "₹1,000 - ₹5,000" },
    { value: "5000-25000", label: "₹5,000 - ₹25,000" },
    { value: "25000-100000", label: "₹25,000 - ₹1,00,000" },
    { value: "100000+", label: "Above ₹1,00,000" },
  ];

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "mumbai", label: "Mumbai" },
    { value: "delhi", label: "Delhi" },
    { value: "bangalore", label: "Bangalore" },
    { value: "pune", label: "Pune" },
    { value: "chennai", label: "Chennai" },
    { value: "hyderabad", label: "Hyderabad" },
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");
      const fetchedItems = await firebaseService.getAllItems();
      // Only show available items
      const availableItems = fetchedItems.filter(
        (item) => item.status === "available"
      );
      setItems(availableItems);
    } catch (error) {
      console.error("Error loading items:", error);
      setError("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedItems = () => {
    let filtered = items;

    // Filter by category
    if (filter !== "all") {
      filtered = filtered.filter((item) => item.category === filter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort items
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price_low":
        filtered.sort((a, b) => (a.value || 0) - (b.value || 0));
        break;
      case "price_high":
        filtered.sort((a, b) => (b.value || 0) - (a.value || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredItems = getFilteredAndSortedItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-marketplace-primary border-t-transparent mx-auto"></div>
          <p className="mt-6 text-marketplace-text-secondary text-lg">
            Finding the best deals for you...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-marketplace-error-light border border-marketplace-error text-marketplace-error px-6 py-4 rounded-marketplace-lg mb-6">
            <h3 className="font-semibold mb-2">Oops! Something went wrong</h3>
            <p>{error}</p>
          </div>
          <button
            onClick={loadItems}
            className="bg-marketplace-primary text-white px-6 py-3 rounded-marketplace-lg font-semibold hover:bg-marketplace-primary-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-800">
      {/* Header Section */}
      <div className="bg-white dark:bg-marketplace-gray-900 border-b border-marketplace-border-light shadow-marketplace">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-marketplace-text-primary">
                Browse Marketplace
              </h1>
              <p className="text-marketplace-text-secondary mt-2">
                Discover {filteredItems.length.toLocaleString()} amazing deals
                in your area
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-4 lg:mt-0 lg:max-w-md lg:flex-1 lg:ml-8">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-marketplace-text-secondary"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for anything..."
                  className="w-full pl-10 pr-4 py-3 border border-marketplace-border-medium rounded-marketplace-lg focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary bg-white dark:bg-marketplace-gray-800 text-marketplace-text-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            {/* Categories */}
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6">
              <h3 className="font-bold text-marketplace-text-primary mb-4 flex items-center">
                <Grid3X3 size={20} className="mr-2" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const categoryCount =
                    category.id === "all"
                      ? items.length
                      : items.filter((item) => item.category === category.id)
                          .length;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setFilter(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-marketplace text-left transition-colors ${
                        filter === category.id
                          ? "bg-marketplace-primary text-white"
                          : "hover:bg-marketplace-gray-50 dark:hover:bg-marketplace-gray-800 text-marketplace-text-primary"
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <span
                        className={`text-sm px-2 py-1 rounded-marketplace ${
                          filter === category.id
                            ? "bg-white/20 text-white"
                            : "bg-marketplace-gray-100 dark:bg-marketplace-gray-800 text-marketplace-text-secondary"
                        }`}
                      >
                        {categoryCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6">
              <h3 className="font-bold text-marketplace-text-primary mb-4 flex items-center">
                <DollarSign size={20} className="mr-2" />
                Price Range
              </h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setPriceRange(range.value)}
                    className={`w-full text-left p-2 rounded-marketplace transition-colors ${
                      priceRange === range.value
                        ? "bg-marketplace-primary text-white"
                        : "hover:bg-marketplace-gray-50 dark:hover:bg-marketplace-gray-800 text-marketplace-text-primary"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6">
              <h3 className="font-bold text-marketplace-text-primary mb-4 flex items-center">
                <MapPin size={20} className="mr-2" />
                Location
              </h3>
              <div className="space-y-2">
                {locations.map((loc) => (
                  <button
                    key={loc.value}
                    onClick={() => setLocation(loc.value)}
                    className={`w-full text-left p-2 rounded-marketplace transition-colors ${
                      location === loc.value
                        ? "bg-marketplace-primary text-white"
                        : "hover:bg-marketplace-gray-50 dark:hover:bg-marketplace-gray-800 text-marketplace-text-primary"
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-4">
              <div className="flex items-center space-x-4">
                <span className="text-marketplace-text-secondary font-medium">
                  {filteredItems.length.toLocaleString()} results
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-marketplace ${
                      viewMode === "grid"
                        ? "bg-marketplace-primary text-white"
                        : "text-marketplace-text-secondary hover:bg-marketplace-gray-100 dark:hover:bg-marketplace-gray-800"
                    }`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-marketplace ${
                      viewMode === "list"
                        ? "bg-marketplace-primary text-white"
                        : "text-marketplace-text-secondary hover:bg-marketplace-gray-100 dark:hover:bg-marketplace-gray-800"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-marketplace-border-medium rounded-marketplace bg-white dark:bg-marketplace-gray-800 text-marketplace-text-primary focus:ring-2 focus:ring-marketplace-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light hover:border-marketplace-primary shadow-marketplace hover:shadow-marketplace-elevated transition-all duration-300 overflow-hidden group"
                >
                  {/* Item Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0].url
                          : "/api/placeholder/300/200"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/300/200";
                      }}
                    />

                    {/* Overlay Actions */}
                    <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-marketplace hover:bg-white transition-colors">
                        <Heart
                          size={18}
                          className="text-marketplace-gray-600 hover:text-marketplace-error"
                        />
                      </button>
                      <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-marketplace hover:bg-white transition-colors">
                        <Share2
                          size={18}
                          className="text-marketplace-gray-600 hover:text-marketplace-primary"
                        />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-marketplace-primary text-white px-3 py-1 rounded-marketplace text-xs font-semibold shadow-marketplace">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="p-6">
                    {/* Price */}
                    {item.value && (
                      <div className="mb-3">
                        <span className="text-2xl font-bold text-marketplace-primary">
                          ₹{item.value.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-bold text-marketplace-text-primary text-lg mb-2 line-clamp-2 group-hover:text-marketplace-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-marketplace-text-secondary text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Condition */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs bg-marketplace-success bg-opacity-20 text-marketplace-success px-3 py-1 rounded-marketplace font-semibold">
                        {item.condition}
                      </span>
                      <div className="flex items-center space-x-3 text-xs text-marketplace-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Eye size={12} />
                          <span>234</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart size={12} />
                          <span>18</span>
                        </div>
                      </div>
                    </div>

                    {/* Location & Time */}
                    <div className="flex items-center justify-between text-sm text-marketplace-text-secondary mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{item.location || "Location not specified"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-marketplace-border-light">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-marketplace-primary rounded-full flex items-center justify-center shadow-marketplace">
                          <span className="text-white font-bold text-sm">
                            {(item.userDisplayName || "U").charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-marketplace-text-primary">
                              {item.userDisplayName || "Anonymous"}
                            </span>
                            <CheckCircle
                              size={14}
                              className="text-marketplace-success"
                            />
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star
                              size={12}
                              className="text-marketplace-secondary fill-current"
                            />
                            <span className="text-xs text-marketplace-text-secondary">
                              4.8 (127)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-4">
                      <Link
                        to={`/item/${item.id}`}
                        className="flex-1 bg-marketplace-primary text-white py-2 px-4 rounded-marketplace font-semibold hover:bg-marketplace-primary-hover transition-colors text-center"
                      >
                        View Details
                      </Link>
                      <button className="px-4 py-2 border border-marketplace-border-medium rounded-marketplace text-marketplace-text-primary hover:bg-marketplace-gray-50 dark:hover:bg-marketplace-gray-800 transition-colors">
                        <MessageCircle size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {filteredItems.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-12 max-w-md mx-auto">
                  <div className="w-24 h-24 bg-marketplace-gray-100 dark:bg-marketplace-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search
                      size={40}
                      className="text-marketplace-text-secondary"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-marketplace-text-primary mb-2">
                    No items found
                  </h3>
                  <p className="text-marketplace-text-secondary mb-6">
                    {filter === "all"
                      ? "No items available for trading yet."
                      : `No items found in ${filter} category.`}
                  </p>
                  <Link
                    to="/add-item"
                    className="inline-block bg-marketplace-secondary text-marketplace-primary px-6 py-3 rounded-marketplace-lg font-bold hover:bg-marketplace-secondary-dark transition-colors"
                  >
                    Start Selling Now
                  </Link>
                </div>
              </div>
            )}

            {/* Load More */}
            {filteredItems.length > 0 && (
              <div className="text-center mt-12">
                <button className="bg-marketplace-primary text-white px-8 py-3 rounded-marketplace-lg font-semibold hover:bg-marketplace-primary-hover transition-colors shadow-marketplace">
                  Load More Items
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseItems;
