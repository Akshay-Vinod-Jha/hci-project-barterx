import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import firebaseService from '../services/firebaseService';
import ImageUpload from '../components/ImageUpload';

const AddItem = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    value: '',
    location: '',
    interestedIn: ''
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    'Electronics',
    'Books',
    'Clothing',
    'Home & Garden',
    'Sports & Recreation',
    'Vehicles',
    'Collectibles',
    'Music Instruments',
    'Other'
  ];

  const conditions = [
    'New',
    'Like New',
    'Good',
    'Fair',
    'Poor'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.condition) {
      setError('Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const itemData = {
        ...formData,
        images: images,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName,
        userEmail: currentUser.email,
        status: 'available'
      };

      console.log('Creating item with data:', itemData);
      console.log('Current user:', currentUser);
      console.log('User ID being stored:', currentUser.uid);

      await firebaseService.createItem(itemData);
      
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: '',
        condition: '',
        value: '',
        location: '',
        interestedIn: ''
      });
      setImages([]);
      
      setTimeout(() => {
        setSuccess(false);
        navigate('/my-items');
      }, 2000);
    } catch (error) {
      console.error('Error submitting item:', error);
      setError('Failed to create item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Item</h1>
          <p className="text-gray-600">
            List an item you'd like to trade with others.
          </p>
        </div>

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Item added successfully! Redirecting to your items...
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Item Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., iPhone 12 Pro Max"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your item in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Images *
                </label>
                <ImageUpload 
                  images={images} 
                  onImagesChange={handleImagesChange}
                  maxImages={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    name="category"
                    id="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    id="condition"
                    required
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                    Estimated Value ($)
                  </label>
                  <input
                    type="number"
                    name="value"
                    id="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="interestedIn" className="block text-sm font-medium text-gray-700">
                  What are you interested in trading for?
                </label>
                <textarea
                  name="interestedIn"
                  id="interestedIn"
                  rows={3}
                  value={formData.interestedIn}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Gaming console, Camera equipment, or open to offers..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding Item...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
