import React, { useState } from 'react';

const Feedback = () => {
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    message: '',
    rating: 0,
    email: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    'Bug Report',
    'Feature Request',
    'General Feedback',
    'User Experience',
    'Performance Issue',
    'Security Concern',
    'Other'
  ];

  const categories = [
    'App Functionality',
    'User Interface',
    'Trading Process',
    'Search & Browse',
    'Notifications',
    'Profile Management',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send this data to your backend
      console.log('Feedback submitted:', {
        ...formData,
        timestamp: new Date().toISOString()
      });
      
      setSubmitted(true);
      setFormData({
        type: '',
        subject: '',
        message: '',
        rating: 0,
        email: '',
        category: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleRatingClick(i + 1)}
        className={`text-2xl ${
          i < formData.rating ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400 transition-colors`}
      >
        ★
      </button>
    ));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thank You!
          </h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate you taking the time to help us improve BaterX.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Submit More Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
          <p className="text-gray-600">
            Help us improve BaterX by sharing your thoughts, suggestions, or reporting issues.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Type *
                </label>
                <select
                  name="type"
                  id="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select feedback type</option>
                  {feedbackTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category (optional)</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of your feedback"
                />
              </div>

              {/* Overall Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall App Rating
                </label>
                <div className="flex items-center space-x-1 mb-2">
                  {renderStars()}
                </div>
                <p className="text-sm text-gray-500">
                  {formData.rating === 0 && "Click to rate your experience"}
                  {formData.rating === 1 && "Very Poor"}
                  {formData.rating === 2 && "Poor"}
                  {formData.rating === 3 && "Average"}
                  {formData.rating === 4 && "Good"}
                  {formData.rating === 5 && "Excellent"}
                </p>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please provide detailed feedback. If reporting a bug, include steps to reproduce the issue."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.message.length}/1000 characters
                </p>
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Provide your email if you'd like a response to your feedback
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Reporting Bugs
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Describe what you expected to happen</li>
              <li>• Explain what actually happened</li>
              <li>• Include steps to reproduce the issue</li>
              <li>• Mention your device and browser</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Feature Requests
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Explain the problem you're trying to solve</li>
              <li>• Describe your proposed solution</li>
              <li>• Explain how it would benefit other users</li>
              <li>• Consider alternative approaches</li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Other Ways to Reach Us
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900">Email Support</h4>
              <p className="text-gray-600">support@baterx.com</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Community Forum</h4>
              <p className="text-gray-600">forum.baterx.com</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Response Time</h4>
              <p className="text-gray-600">Within 24-48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
