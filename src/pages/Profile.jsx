import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    location: 'San Francisco, CA',
    bio: 'Passionate trader looking for unique items and great deals.',
    joinDate: '2024-01-15',
    tradingPreferences: {
      categories: ['Electronics', 'Books'],
      maxDistance: '50',
      meetingPreference: 'public_place'
    },
    ratings: {
      average: 4.7,
      total: 23,
      breakdown: {
        5: 18,
        4: 4,
        3: 1,
        2: 0,
        1: 0
      }
    },
    stats: {
      totalTrades: 23,
      successfulTrades: 21,
      itemsListed: 15,
      responseTime: '2 hours'
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      tradingPreferences: {
        ...prev.tradingPreferences,
        [name]: value
      }
    }));
  };

  const handleSave = () => {
    // Simulate saving profile data
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
    // Show success message
    alert('Profile updated successfully!');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">
            Manage your account information and trading preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Basic Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="displayName"
                      value={profileData.displayName}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.displayName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{profileData.email}</p>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.bio}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Trading Preferences */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Trading Preferences
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.tradingPreferences.categories.map(category => (
                      <span key={category} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Trading Distance
                  </label>
                  <p className="text-gray-900">{profileData.tradingPreferences.maxDistance} miles</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Preference
                  </label>
                  <p className="text-gray-900">
                    {profileData.tradingPreferences.meetingPreference === 'public_place' 
                      ? 'Public places only' 
                      : 'Any safe location'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Ratings */}
          <div className="space-y-6">
            {/* Profile Avatar */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {profileData.displayName.charAt(0)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {profileData.displayName}
              </h3>
              <p className="text-gray-600 text-sm">
                Member since {new Date(profileData.joinDate).toLocaleDateString()}
              </p>
            </div>

            {/* Ratings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trading Rating
              </h3>
              
              <div className="text-center mb-4">
                <div className="flex justify-center mb-2">
                  {renderStars(profileData.ratings.average)}
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {profileData.ratings.average}
                </p>
                <p className="text-gray-600 text-sm">
                  Based on {profileData.ratings.total} reviews
                </p>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 w-3">{rating}</span>
                    <span className="text-yellow-400">★</span>
                    <div className="flex-1 bg-gray-200 rounded h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded"
                        style={{ 
                          width: `${(profileData.ratings.breakdown[rating] / profileData.ratings.total) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-6">
                      {profileData.ratings.breakdown[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trading Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Trades</span>
                  <span className="font-medium text-gray-900">
                    {profileData.stats.totalTrades}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Successful Trades</span>
                  <span className="font-medium text-gray-900">
                    {profileData.stats.successfulTrades}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">
                    {Math.round((profileData.stats.successfulTrades / profileData.stats.totalTrades) * 100)}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Listed</span>
                  <span className="font-medium text-gray-900">
                    {profileData.stats.itemsListed}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium text-gray-900">
                    {profileData.stats.responseTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors">
                  Change Password
                </button>
                <button className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-300 transition-colors">
                  Privacy Settings
                </button>
                <button className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-300 transition-colors">
                  Download Data
                </button>
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
