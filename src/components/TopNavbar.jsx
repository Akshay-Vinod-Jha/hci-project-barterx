import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  ArrowRightLeft,
  Plus,
  Filter,
  MapPin,
  ChevronDown,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TopNavbar = ({ onMenuClick, isDarkMode, toggleDarkMode }) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("All Cities");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Vehicles",
    "Sports",
    "Books",
    "Toys",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-marketplace-gray-900 border-b border-marketplace-border-light dark:border-marketplace-gray-700 shadow-marketplace sticky top-0 z-30"
    >
      <div className="max-w-8xl mx-auto">
        {/* Main Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          {/* Left Section - Logo & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-marketplace-gray-600 hover:text-marketplace-text-primary hover:bg-marketplace-gray-100 dark:hover:bg-marketplace-gray-700 rounded-marketplace transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Logo - Desktop */}
            <Link
              to="/dashboard"
              className="hidden lg:flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-marketplace-primary rounded-marketplace flex items-center justify-center shadow-marketplace">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
                  alt="BarterX Logo"
                  className="w-6 h-6"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <ArrowRightLeft className="text-white hidden" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-marketplace-primary">
                  BarterX
                </h1>
                <p className="text-xs text-marketplace-text-secondary">
                  Trade & Exchange
                </p>
              </div>
            </Link>

            {/* Mobile Logo */}
            <Link
              to="/dashboard"
              className="lg:hidden flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-marketplace-primary rounded-marketplace flex items-center justify-center shadow-marketplace">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
                  alt="BarterX Logo"
                  className="w-5 h-5"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <ArrowRightLeft className="text-white hidden" size={16} />
              </div>
              <span className="text-lg font-bold text-marketplace-primary">
                BarterX
              </span>
            </Link>
          </div>

          {/* Center Section - Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="flex w-full">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-12 pl-4 pr-8 bg-marketplace-gray-100 border border-r-0 border-marketplace-border-medium rounded-l-marketplace focus:outline-none focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary text-sm font-medium text-marketplace-text-primary appearance-none cursor-pointer"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-marketplace-gray-500"
                  size={16}
                />
              </div>

              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for items, brands, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full h-12 px-4 border border-marketplace-border-medium focus:outline-none focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary text-marketplace-text-primary placeholder-marketplace-text-muted"
                />
              </div>

              {/* Location Filter */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="h-12 pl-3 pr-8 bg-marketplace-gray-100 border border-l-0 border-marketplace-border-medium focus:outline-none focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary text-sm text-marketplace-text-primary appearance-none cursor-pointer"
                >
                  <option value="All Cities">All Cities</option>
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-marketplace-gray-500"
                  size={16}
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="h-12 px-6 bg-marketplace-primary hover:bg-marketplace-primary-hover text-white font-medium rounded-r-marketplace transition-colors shadow-marketplace"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            {/* Sell Button */}
            <Link
              to="/add-item"
              className="hidden sm:flex items-center space-x-2 bg-marketplace-secondary hover:bg-marketplace-secondary-dark text-marketplace-primary px-4 py-2 rounded-marketplace font-semibold text-sm shadow-marketplace transition-all duration-200"
            >
              <Plus size={16} />
              <span>SELL</span>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-marketplace-gray-600 hover:text-marketplace-text-primary hover:bg-marketplace-gray-100 dark:hover:bg-marketplace-gray-700 rounded-marketplace transition-colors"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="p-2 text-marketplace-gray-600 hover:text-marketplace-text-primary hover:bg-marketplace-gray-100 dark:hover:bg-marketplace-gray-700 rounded-marketplace transition-colors"
              title="My Favorites"
            >
              <Heart size={18} />
            </Link>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 text-marketplace-gray-600 hover:text-marketplace-text-primary hover:bg-marketplace-gray-100 dark:hover:bg-marketplace-gray-700 rounded-marketplace transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-marketplace-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
              >
                3
              </motion.span>
            </Link>

            {/* User Profile */}
            <Link
              to="/profile"
              className="flex items-center space-x-2 p-2 hover:bg-marketplace-gray-100 dark:hover:bg-marketplace-gray-700 rounded-marketplace transition-colors"
            >
              <div className="w-8 h-8 bg-marketplace-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {(currentUser?.displayName || currentUser?.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div className="hidden xl:block">
                <p className="text-sm font-medium text-marketplace-text-primary">
                  {(currentUser?.displayName || "User").split(" ")[0]}
                </p>
              </div>
              <ChevronDown
                className="hidden xl:block text-marketplace-gray-500"
                size={16}
              />
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-marketplace-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-marketplace-border-light rounded-marketplace focus:outline-none focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary text-marketplace-text-primary placeholder-marketplace-text-muted"
              />
            </div>
            <button
              type="button"
              className="p-3 text-marketplace-gray-600 hover:text-marketplace-text-primary hover:bg-marketplace-gray-100 rounded-marketplace transition-colors"
              title="Filters"
            >
              <Filter size={18} />
            </button>
          </form>
        </div>

        {/* Category Navigation Bar */}
        <div className="hidden lg:block border-t border-marketplace-border-light dark:border-marketplace-gray-700">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-8 overflow-x-auto">
              <Link
                to="/browse"
                className="text-sm font-medium text-marketplace-text-secondary hover:text-marketplace-primary whitespace-nowrap transition-colors"
              >
                All Categories
              </Link>
              <Link
                to="/browse?category=electronics"
                className="text-sm font-medium text-marketplace-text-secondary hover:text-category-electronics whitespace-nowrap transition-colors"
              >
                Electronics
              </Link>
              <Link
                to="/browse?category=fashion"
                className="text-sm font-medium text-marketplace-text-secondary hover:text-category-fashion whitespace-nowrap transition-colors"
              >
                Fashion
              </Link>
              <Link
                to="/browse?category=home"
                className="text-sm font-medium text-marketplace-text-secondary hover:text-category-home whitespace-nowrap transition-colors"
              >
                Home & Garden
              </Link>
              <Link
                to="/browse?category=cars"
                className="text-sm font-medium text-marketplace-text-secondary hover:text-category-cars whitespace-nowrap transition-colors"
              >
                Vehicles
              </Link>
              <Link
                to="/browse?category=sports"
                className="text-sm font-medium text-marketplace-text-secondary hover:text-category-sports whitespace-nowrap transition-colors"
              >
                Sports
              </Link>
              <Link
                to="/browse?category=books"
                className="text-sm font-medium text-marketplace-text-secondary hover:text-category-books whitespace-nowrap transition-colors"
              >
                Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopNavbar;
