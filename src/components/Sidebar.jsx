import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Package,
  ArrowRightLeft,
  Plus,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  TrendingUp,
  MessageSquare,
  Info,
  Grid3X3,
  Heart,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const mainNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/browse", label: "Browse Items", icon: Grid3X3 },
    { path: "/my-items", label: "My Listings", icon: Package },
    { path: "/my-trades", label: "My Trades", icon: ArrowRightLeft },
  ];

  const secondaryItems = [
    { path: "/add-item", label: "Sell Item", icon: Plus, highlight: true },
    { path: "/notifications", label: "Notifications", icon: Bell, badge: true },
    { path: "/profile", label: "My Profile", icon: User },
    { path: "/search", label: "Advanced Search", icon: Search },
    { path: "/feedback", label: "Help & Support", icon: MessageSquare },
  ];

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ item, onClick }) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`group flex items-center space-x-3 px-4 py-3 rounded-marketplace transition-all duration-200 ${
          active
            ? "bg-marketplace-primary text-white shadow-marketplace"
            : item.highlight
            ? "bg-marketplace-secondary hover:bg-marketplace-secondary-dark text-marketplace-primary shadow-marketplace"
            : "text-marketplace-text-secondary hover:text-marketplace-text-primary hover:bg-marketplace-gray-100 dark:hover:bg-marketplace-gray-700"
        }`}
      >
        <Icon
          size={20}
          className={`flex-shrink-0 ${
            active
              ? "text-white"
              : item.highlight
              ? "text-marketplace-primary"
              : "text-marketplace-gray-500 group-hover:text-marketplace-text-primary"
          }`}
        />

        <span className="font-medium text-sm">{item.label}</span>

        {item.badge && item.path === "/notifications" && (
          <span className="ml-auto bg-marketplace-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            3
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: 0, // Always visible on desktop
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        className={`
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          fixed left-0 top-0 h-full w-72 bg-white dark:bg-marketplace-gray-900 
          border-r border-marketplace-border-light dark:border-marketplace-gray-700 
          shadow-marketplace-elevated z-50 
          lg:relative lg:block lg:translate-x-0 lg:z-auto
          transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-marketplace-border-light dark:border-marketplace-gray-700">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-marketplace-primary rounded-marketplace flex items-center justify-center shadow-marketplace">
                <ArrowRightLeft className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-marketplace-primary">
                  BarterX
                </h1>
                <p className="text-xs text-marketplace-text-secondary">
                  Marketplace
                </p>
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 text-marketplace-gray-500 hover:text-marketplace-text-primary hover:bg-marketplace-gray-100 dark:hover:bg-marketplace-gray-700 rounded-marketplace transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-marketplace-border-light dark:border-marketplace-gray-700 bg-marketplace-bg-accent dark:bg-marketplace-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-marketplace-primary rounded-full flex items-center justify-center shadow-marketplace">
                <span className="text-white font-semibold text-lg">
                  {(currentUser?.displayName || currentUser?.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-marketplace-text-primary truncate">
                  {currentUser?.displayName || "User"}
                </p>
                <p className="text-xs text-marketplace-text-secondary truncate">
                  {currentUser?.email}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-marketplace-success rounded-full mr-2"></div>
                  <span className="text-xs text-marketplace-success font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {/* Main Navigation */}
            <div>
              <p className="text-xs font-semibold text-marketplace-text-muted uppercase tracking-wider mb-3 px-2">
                Marketplace
              </p>
              <nav className="space-y-1">
                {mainNavItems.map((item) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </nav>
            </div>

            {/* Secondary Navigation */}
            <div>
              <p className="text-xs font-semibold text-marketplace-text-muted uppercase tracking-wider mb-3 px-2">
                Account & Tools
              </p>
              <nav className="space-y-1">
                {secondaryItems.map((item) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </nav>
            </div>

            {/* Categories Quick Access */}
            <div>
              <p className="text-xs font-semibold text-marketplace-text-muted uppercase tracking-wider mb-3 px-2">
                Popular Categories
              </p>
              <div className="space-y-2">
                <Link
                  to="/browse?category=electronics"
                  className="flex items-center space-x-2 px-2 py-1 text-sm text-marketplace-text-secondary hover:text-category-electronics transition-colors"
                >
                  <div className="w-3 h-3 bg-category-electronics rounded-full"></div>
                  <span>Electronics</span>
                </Link>
                <Link
                  to="/browse?category=fashion"
                  className="flex items-center space-x-2 px-2 py-1 text-sm text-marketplace-text-secondary hover:text-category-fashion transition-colors"
                >
                  <div className="w-3 h-3 bg-category-fashion rounded-full"></div>
                  <span>Fashion</span>
                </Link>
                <Link
                  to="/browse?category=home"
                  className="flex items-center space-x-2 px-2 py-1 text-sm text-marketplace-text-secondary hover:text-category-home transition-colors"
                >
                  <div className="w-3 h-3 bg-category-home rounded-full"></div>
                  <span>Home & Garden</span>
                </Link>
                <Link
                  to="/browse?category=cars"
                  className="flex items-center space-x-2 px-2 py-1 text-sm text-marketplace-text-secondary hover:text-category-cars transition-colors"
                >
                  <div className="w-3 h-3 bg-category-cars rounded-full"></div>
                  <span>Vehicles</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-marketplace-border-light dark:border-marketplace-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-marketplace-error hover:text-red-700 hover:bg-marketplace-error-light dark:hover:bg-red-950/20 rounded-marketplace transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
