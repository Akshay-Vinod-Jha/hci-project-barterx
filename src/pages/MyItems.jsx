import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  MapPin,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Star,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import firebaseService from "../services/firebaseService";

const MyItems = () => {
  const { currentUser } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (currentUser) {
      loadUserItems();
    }
  }, [currentUser]);

  const loadUserItems = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Loading user items for user:", currentUser.uid);
      const userItems = await firebaseService.getUserItems(currentUser.uid);
      console.log("User items loaded:", userItems);
      setMyItems(userItems);
    } catch (error) {
      console.error("Error loading user items:", error);
      setError("Failed to load your items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      setDeleting(itemId);
      await firebaseService.deleteItem(itemId);
      // Remove item from local state
      setMyItems(myItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "available":
        return "bg-marketplace-success bg-opacity-20 text-marketplace-success";
      case "traded":
        return "bg-marketplace-gray-100 dark:bg-marketplace-gray-800 text-marketplace-text-secondary";
      case "pending":
        return "bg-marketplace-secondary bg-opacity-20 text-marketplace-secondary";
      default:
        return "bg-marketplace-gray-100 dark:bg-marketplace-gray-800 text-marketplace-text-secondary";
    }
  };

  const getFilteredItems = () => {
    if (filterStatus === "all") return myItems;
    return myItems.filter((item) => item.status === filterStatus);
  };

  const filteredItems = getFilteredItems();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-8 max-w-md">
          <AlertCircle
            size={48}
            className="text-marketplace-error mx-auto mb-4"
          />
          <h3 className="text-xl font-bold text-marketplace-text-primary mb-2">
            Authentication Required
          </h3>
          <p className="text-marketplace-text-secondary mb-6">
            Please log in to view your items.
          </p>
          <Link
            to="/login"
            className="bg-marketplace-primary text-white px-6 py-3 rounded-marketplace-lg font-semibold hover:bg-marketplace-primary-hover transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-marketplace-primary border-t-transparent mx-auto"></div>
          <p className="mt-6 text-marketplace-text-secondary text-lg">
            Loading your items...
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
            <AlertCircle size={20} className="inline mr-2" />
            <span className="font-semibold">Error:</span> {error}
          </div>
          <button
            onClick={loadUserItems}
            className="bg-marketplace-primary text-white px-6 py-3 rounded-marketplace-lg font-semibold hover:bg-marketplace-primary-hover transition-colors flex items-center mx-auto"
          >
            <RefreshCw size={16} className="mr-2" />
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
                My Items
              </h1>
              <p className="text-marketplace-text-secondary mt-2">
                Manage your {myItems.length} items •{" "}
                {myItems.filter((item) => item.status === "available").length}{" "}
                active listings
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <Link
                to="/add-item"
                className="bg-marketplace-primary text-white px-6 py-3 rounded-marketplace-lg font-semibold hover:bg-marketplace-primary-hover transition-colors flex items-center shadow-marketplace"
              >
                <Plus size={20} className="mr-2" />
                Add New Item
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-marketplace-text-secondary" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-marketplace-border-medium rounded-marketplace bg-white dark:bg-marketplace-gray-800 text-marketplace-text-primary focus:ring-2 focus:ring-marketplace-primary text-sm"
              >
                <option value="all">All Items ({myItems.length})</option>
                <option value="available">
                  Available (
                  {myItems.filter((item) => item.status === "available").length}
                  )
                </option>
                <option value="traded">
                  Traded (
                  {myItems.filter((item) => item.status === "traded").length})
                </option>
                <option value="pending">
                  Pending (
                  {myItems.filter((item) => item.status === "pending").length})
                </option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-marketplace-text-secondary font-medium text-sm">
              {filteredItems.length} results
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
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-12 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-marketplace-gray-100 dark:bg-marketplace-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package
                  size={40}
                  className="text-marketplace-text-secondary"
                />
              </div>
              <h3 className="text-xl font-bold text-marketplace-text-primary mb-2">
                {filterStatus === "all"
                  ? "No items yet"
                  : `No ${filterStatus} items`}
              </h3>
              <p className="text-marketplace-text-secondary mb-6">
                {filterStatus === "all"
                  ? "Start building your marketplace presence by adding your first item!"
                  : `You don't have any ${filterStatus} items at the moment.`}
              </p>
              <Link
                to="/add-item"
                className="inline-flex items-center bg-marketplace-secondary text-marketplace-primary px-6 py-3 rounded-marketplace-lg font-bold hover:bg-marketplace-secondary-dark transition-colors shadow-marketplace"
              >
                <Plus size={20} className="mr-2" />
                {filterStatus === "all"
                  ? "Add Your First Item"
                  : "Add New Item"}
              </Link>
            </div>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                        : "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop";
                    }}
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-marketplace ${getStatusBadgeColor(
                        item.status
                      )}`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      to={`/edit-item/${item.id}`}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-marketplace hover:bg-white transition-colors"
                    >
                      <Edit3 size={14} className="text-marketplace-primary" />
                    </Link>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={deleting === item.id}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-marketplace hover:bg-white transition-colors disabled:opacity-50"
                    >
                      {deleting === item.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-marketplace-error border-t-transparent"></div>
                      ) : (
                        <Trash2 size={14} className="text-marketplace-error" />
                      )}
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="absolute bottom-3 left-3 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-marketplace px-2 py-1">
                      <Eye size={12} className="text-white" />
                      <span className="text-white text-xs">
                        {Math.floor(Math.random() * 500) + 50}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-marketplace px-2 py-1">
                      <Heart size={12} className="text-white" />
                      <span className="text-white text-xs">
                        {Math.floor(Math.random() * 50) + 5}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item Info */}
                <div className="p-5">
                  {/* Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-marketplace-primary bg-opacity-10 text-marketplace-primary text-xs font-semibold px-2 py-1 rounded-marketplace">
                      {item.category}
                    </span>
                    {item.value && (
                      <span className="text-lg font-bold text-marketplace-primary">
                        ₹{item.value.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-marketplace-text-primary mb-2 line-clamp-2 group-hover:text-marketplace-primary transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-marketplace-text-secondary text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Condition & Location */}
                  <div className="flex items-center justify-between text-sm text-marketplace-text-secondary mb-4">
                    <div className="flex items-center space-x-1">
                      <CheckCircle
                        size={14}
                        className="text-marketplace-success"
                      />
                      <span>{item.condition}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span className="truncate">
                        {item.location || "No location"}
                      </span>
                    </div>
                  </div>

                  {/* Date & Performance */}
                  <div className="flex items-center justify-between text-xs text-marketplace-text-secondary mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>
                        Listed{" "}
                        {new Date(
                          item.createdAt?.toDate?.() || item.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <TrendingUp
                          size={12}
                          className="text-marketplace-success"
                        />
                        <span className="text-marketplace-success">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4 border-t border-marketplace-border-light">
                    <Link
                      to={`/item/${item.id}`}
                      className="flex-1 bg-marketplace-primary text-white py-2 px-4 rounded-marketplace font-semibold hover:bg-marketplace-primary-hover transition-colors text-center text-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/edit-item/${item.id}`}
                      className="px-4 py-2 border border-marketplace-border-medium rounded-marketplace text-marketplace-text-primary hover:bg-marketplace-gray-50 dark:hover:bg-marketplace-gray-800 transition-colors"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={deleting === item.id}
                      className="px-4 py-2 border border-marketplace-error-light text-marketplace-error hover:bg-marketplace-error-light hover:text-white rounded-marketplace transition-colors disabled:opacity-50"
                    >
                      {deleting === item.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItems;
