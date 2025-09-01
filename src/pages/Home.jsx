import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to BaterX
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Hello, {currentUser?.displayName || currentUser?.email}!
          </p>
          <p className="text-lg text-gray-500 mb-12">
            The ultimate platform for bartering and trading items with others.
            Start exploring, add your items, and make amazing trades!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add Items
              </h3>
              <p className="text-gray-600">
                List items you want to trade and find interested traders.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Browse & Search
              </h3>
              <p className="text-gray-600">
                Discover amazing items from other users that you might want.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Make Trades
              </h3>
              <p className="text-gray-600">
                Connect with other users and make mutually beneficial trades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
