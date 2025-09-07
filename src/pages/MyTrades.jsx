import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ArrowUpDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  DollarSign,
  User,
  Calendar,
  Package,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  Phone,
  Mail,
  Star,
  Shield,
  Eye,
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import firebaseService from "../services/firebaseService";

const MyTrades = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    if (currentUser) {
      loadTrades();
    }
  }, [currentUser]);

  const loadTrades = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Loading trades for user:", currentUser.uid);
      const userTrades = await firebaseService.getTrades(currentUser.uid);
      console.log("Loaded trades:", userTrades);

      setTrades(userTrades || []);
    } catch (error) {
      console.error("Error loading trades:", error);
      setError("Failed to load trades. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTrade = async (tradeId) => {
    try {
      await firebaseService.updateTrade(tradeId, { status: "accepted" });
      loadTrades(); // Reload trades after accepting
    } catch (error) {
      console.error("Error accepting trade:", error);
      setError("Failed to accept trade. Please try again.");
    }
  };

  const handleDeclineTrade = async (tradeId) => {
    try {
      await firebaseService.updateTrade(tradeId, { status: "declined" });
      loadTrades(); // Reload trades after declining
    } catch (error) {
      console.error("Error declining trade:", error);
      setError("Failed to decline trade. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-marketplace-secondary bg-opacity-20",
        text: "text-marketplace-secondary",
        label: "Pending Review",
        icon: Clock,
      },
      accepted: {
        bg: "bg-marketplace-success bg-opacity-20",
        text: "text-marketplace-success",
        label: "Accepted",
        icon: CheckCircle,
      },
      declined: {
        bg: "bg-marketplace-error bg-opacity-20",
        text: "text-marketplace-error",
        label: "Declined",
        icon: XCircle,
      },
      completed: {
        bg: "bg-marketplace-primary bg-opacity-20",
        text: "text-marketplace-primary",
        label: "Completed",
        icon: CheckCircle,
      },
    };

    const config = statusConfig[status] || statusConfig["pending"];
    const IconComponent = config.icon;

    return (
      <div
        className={`inline-flex items-center px-3 py-1 rounded-marketplace text-xs font-semibold ${config.bg} ${config.text}`}
      >
        <IconComponent size={12} className="mr-1" />
        {config.label}
      </div>
    );
  };

  const getFilteredTrades = () => {
    if (filterStatus === "all") return trades;
    return trades.filter((trade) => trade.status === filterStatus);
  };

  const filteredTrades = getFilteredTrades();

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
            Please log in to view your trades.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-marketplace-primary text-white px-6 py-3 rounded-marketplace-lg font-semibold hover:bg-marketplace-primary-hover transition-colors"
          >
            Go to Login
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
                My Trades
              </h1>
              <p className="text-marketplace-text-secondary mt-2">
                Track and manage your {trades.length} active exchanges
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-marketplace-gray-50 dark:bg-marketplace-gray-800 px-4 py-2 rounded-marketplace-lg">
                <TrendingUp size={16} className="text-marketplace-success" />
                <span className="text-sm font-medium text-marketplace-text-primary">
                  {trades.filter((t) => t.status === "completed").length}{" "}
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-marketplace-error-light border border-marketplace-error text-marketplace-error px-6 py-4 rounded-marketplace-lg flex items-center shadow-marketplace"
          >
            <AlertCircle size={20} className="mr-3" />
            <span>{error}</span>
          </motion.div>
        )}

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
                <option value="all">All Trades ({trades.length})</option>
                <option value="pending">
                  Pending ({trades.filter((t) => t.status === "pending").length}
                  )
                </option>
                <option value="accepted">
                  Accepted (
                  {trades.filter((t) => t.status === "accepted").length})
                </option>
                <option value="completed">
                  Completed (
                  {trades.filter((t) => t.status === "completed").length})
                </option>
                <option value="declined">
                  Declined (
                  {trades.filter((t) => t.status === "declined").length})
                </option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-marketplace-text-secondary font-medium text-sm">
              {filteredTrades.length} results
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

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-marketplace-primary border-t-transparent mx-auto"></div>
              <p className="mt-6 text-marketplace-text-secondary text-lg">
                Loading your trades...
              </p>
            </div>
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-12 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-marketplace-gray-100 dark:bg-marketplace-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowUpDown
                  size={40}
                  className="text-marketplace-text-secondary"
                />
              </div>
              <h3 className="text-xl font-bold text-marketplace-text-primary mb-2">
                {filterStatus === "all"
                  ? "No trades yet"
                  : `No ${filterStatus} trades`}
              </h3>
              <p className="text-marketplace-text-secondary mb-6">
                {filterStatus === "all"
                  ? "Start exploring the marketplace to find items you want to trade for."
                  : `You don't have any ${filterStatus} trades at the moment.`}
              </p>
              <button
                onClick={() => navigate("/browse")}
                className="inline-flex items-center bg-marketplace-secondary text-marketplace-primary px-6 py-3 rounded-marketplace-lg font-bold hover:bg-marketplace-secondary-dark transition-colors shadow-marketplace"
              >
                <Package size={20} className="mr-2" />
                Browse Items
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {filteredTrades.map((trade, index) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light hover:border-marketplace-primary shadow-marketplace hover:shadow-marketplace-elevated transition-all duration-300 overflow-hidden"
              >
                {/* Trade Header */}
                <div className="p-6 border-b border-marketplace-border-light">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-marketplace-primary bg-opacity-10 rounded-marketplace flex items-center justify-center">
                        <ArrowUpDown
                          size={20}
                          className="text-marketplace-primary"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-marketplace-text-primary">
                          Trade #{trade.id.slice(-6)}
                        </h3>
                        <p className="text-sm text-marketplace-text-secondary">
                          {trade.createdAt &&
                          typeof trade.createdAt.toDate === "function"
                            ? trade.createdAt.toDate().toLocaleDateString()
                            : new Date(trade.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(trade.status)}
                  </div>
                </div>

                {/* Trade Items */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Your Item */}
                    <div className="bg-marketplace-gray-50 dark:bg-marketplace-gray-800 rounded-marketplace-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-marketplace-text-primary">
                          Your Item
                        </h4>
                        <span className="text-xs bg-marketplace-primary bg-opacity-20 text-marketplace-primary px-2 py-1 rounded-marketplace font-semibold">
                          OFFERING
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            trade.userItem?.imageUrl ||
                            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop"
                          }
                          alt={trade.userItem?.title || "Your item"}
                          className="w-16 h-16 rounded-marketplace object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-marketplace-text-primary truncate">
                            {trade.userItem?.title || "Unknown Item"}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <DollarSign
                              size={12}
                              className="text-marketplace-success"
                            />
                            <span className="text-sm text-marketplace-success font-medium">
                              ₹{(trade.userItem?.value || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Partner's Item */}
                    <div className="bg-marketplace-gray-50 dark:bg-marketplace-gray-800 rounded-marketplace-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-marketplace-text-primary">
                          Partner's Item
                        </h4>
                        <span className="text-xs bg-marketplace-secondary bg-opacity-20 text-marketplace-secondary px-2 py-1 rounded-marketplace font-semibold">
                          RECEIVING
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            trade.partnerItem?.imageUrl ||
                            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop"
                          }
                          alt={trade.partnerItem?.title || "Partner item"}
                          className="w-16 h-16 rounded-marketplace object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-marketplace-text-primary truncate">
                            {trade.partnerItem?.title || "Unknown Item"}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <DollarSign
                              size={12}
                              className="text-marketplace-success"
                            />
                            <span className="text-sm text-marketplace-success font-medium">
                              ₹
                              {(trade.partnerItem?.value || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trade Partner Info */}
                  <div className="bg-marketplace-gray-50 dark:bg-marketplace-gray-800 rounded-marketplace-lg p-4 mb-6">
                    <h4 className="font-semibold text-marketplace-text-primary mb-3 flex items-center">
                      <User size={16} className="mr-2" />
                      Trade Partner
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-marketplace-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {(trade.partner?.name || "U").charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-marketplace-text-primary">
                            {trade.partner?.name || "Unknown User"}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-marketplace-text-secondary">
                            <div className="flex items-center space-x-1">
                              <Star
                                size={10}
                                className="text-marketplace-secondary fill-current"
                              />
                              <span>4.8</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield
                                size={10}
                                className="text-marketplace-success"
                              />
                              <span>Verified</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {trade.meetingArranged && (
                        <span className="text-xs bg-marketplace-success bg-opacity-20 text-marketplace-success px-2 py-1 rounded-marketplace font-semibold">
                          <Calendar size={10} className="inline mr-1" />
                          MEETING SET
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {trade.status === "pending" && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAcceptTrade(trade.id)}
                        className="flex-1 bg-marketplace-success text-white py-3 px-4 rounded-marketplace-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Accept Trade
                      </button>
                      <button
                        onClick={() => handleDeclineTrade(trade.id)}
                        className="flex-1 bg-marketplace-error text-white py-3 px-4 rounded-marketplace-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center"
                      >
                        <XCircle size={16} className="mr-2" />
                        Decline
                      </button>
                    </div>
                  )}

                  {trade.status === "accepted" && (
                    <div className="space-y-3">
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-marketplace-primary text-white py-3 px-4 rounded-marketplace-lg font-semibold hover:bg-marketplace-primary-hover transition-colors flex items-center justify-center">
                          <Calendar size={16} className="mr-2" />
                          Arrange Meeting
                        </button>
                        <button className="flex-1 bg-marketplace-secondary text-marketplace-primary py-3 px-4 rounded-marketplace-lg font-semibold hover:bg-marketplace-secondary-dark transition-colors flex items-center justify-center">
                          <MessageCircle size={16} className="mr-2" />
                          Contact Partner
                        </button>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-marketplace-text-secondary">
                          Exchange contact details and arrange a safe meeting
                          place
                        </p>
                      </div>
                    </div>
                  )}

                  {trade.status === "completed" && (
                    <div className="text-center p-4 bg-marketplace-success bg-opacity-10 rounded-marketplace-lg">
                      <CheckCircle
                        size={24}
                        className="text-marketplace-success mx-auto mb-2"
                      />
                      <p className="text-marketplace-success font-semibold">
                        Trade Completed Successfully!
                      </p>
                      <p className="text-xs text-marketplace-text-secondary mt-1">
                        Don't forget to rate your trade partner
                      </p>
                    </div>
                  )}

                  {trade.status === "declined" && (
                    <div className="text-center p-4 bg-marketplace-error bg-opacity-10 rounded-marketplace-lg">
                      <XCircle
                        size={24}
                        className="text-marketplace-error mx-auto mb-2"
                      />
                      <p className="text-marketplace-error font-semibold">
                        Trade was declined
                      </p>
                      <p className="text-xs text-marketplace-text-secondary mt-1">
                        Keep browsing for other great opportunities
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrades;
