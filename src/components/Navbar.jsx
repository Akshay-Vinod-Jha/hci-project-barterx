import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/home" className="text-xl font-bold">
              BaterX
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
              Dashboard
            </Link>
            <Link to="/browse" className="hover:bg-blue-700 px-3 py-2 rounded">
              Browse Items
            </Link>
            <Link to="/add-item" className="hover:bg-blue-700 px-3 py-2 rounded">
              Add Item
            </Link>
            <Link to="/my-items" className="hover:bg-blue-700 px-3 py-2 rounded">
              My Items
            </Link>
            <Link to="/my-trades" className="hover:bg-blue-700 px-3 py-2 rounded">
              My Trades
            </Link>
            <Link to="/notifications" className="hover:bg-blue-700 px-3 py-2 rounded">
              Notifications
            </Link>
            <Link to="/search" className="hover:bg-blue-700 px-3 py-2 rounded">
              Search
            </Link>
            <Link to="/profile" className="hover:bg-blue-700 px-3 py-2 rounded">
              Profile
            </Link>
            <Link to="/feedback" className="hover:bg-blue-700 px-3 py-2 rounded">
              Feedback
            </Link>
            <Link to="/about" className="hover:bg-blue-700 px-3 py-2 rounded">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {currentUser?.displayName || currentUser?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
