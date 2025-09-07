import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const ModernLayout = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Always open on desktop
      } else {
        setSidebarOpen(false); // Closed by default on mobile
      }
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!currentUser) {
    return children;
  }

  return (
    <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-900 transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Top Navbar */}
          <TopNavbar
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-marketplace-bg-secondary dark:bg-marketplace-gray-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ModernLayout;
