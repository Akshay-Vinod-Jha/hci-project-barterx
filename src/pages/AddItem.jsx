import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Camera,
  MapPin,
  DollarSign,
  Package,
  FileText,
  Tag,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Star,
  Shield,
  ArrowRight,
  Zap
} from 'lucide-react';
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
    { value: 'Electronics', label: 'Electronics', icon: '📱' },
    { value: 'Books', label: 'Books & Media', icon: '📚' },
    { value: 'Clothing', label: 'Fashion & Clothing', icon: '👕' },
    { value: 'Home & Garden', label: 'Home & Garden', icon: '🏠' },
    { value: 'Sports & Recreation', label: 'Sports & Recreation', icon: '⚽' },
    { value: 'Vehicles', label: 'Vehicles', icon: '🚗' },
    { value: 'Collectibles', label: 'Collectibles & Art', icon: '🎨' },
    { value: 'Music Instruments', label: 'Music Instruments', icon: '🎸' },
    { value: 'Other', label: 'Other Items', icon: '📦' }
  ];

  const conditions = [
    { value: 'New', label: 'Brand New', description: 'Never used, with original packaging' },
    { value: 'Like New', label: 'Like New', description: 'Used once or twice, excellent condition' },
    { value: 'Good', label: 'Good', description: 'Used but well maintained' },
    { value: 'Fair', label: 'Fair', description: 'Shows wear but fully functional' },
    { value: 'Poor', label: 'Poor', description: 'Heavily used, may need repairs' }
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
    <div className="min-h-screen bg-marketplace-bg-secondary dark:bg-marketplace-gray-800">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-marketplace-primary via-marketplace-primary-light to-marketplace-primary border-b border-marketplace-border-light shadow-marketplace">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">Sell Your Item</h1>
            <p className="text-marketplace-primary-light text-lg">
              Post your ad in under 2 minutes • Reach millions of buyers
            </p>
            <div className="flex justify-center items-center mt-4 space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Shield size={16} className="text-marketplace-secondary" />
                <span>100% Safe & Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={16} className="text-marketplace-secondary" />
                <span>Instant Listing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={16} className="text-marketplace-secondary" />
                <span>Premium Features</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-marketplace-success-light border border-marketplace-success text-marketplace-success px-6 py-4 rounded-marketplace-lg flex items-center shadow-marketplace"
          >
            <CheckCircle size={20} className="mr-3" />
            <div>
              <h4 className="font-semibold">Success!</h4>
              <p>Item added successfully! Redirecting to your items...</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-marketplace-error-light border border-marketplace-error text-marketplace-error px-6 py-4 rounded-marketplace-lg flex items-center shadow-marketplace"
          >
            <AlertCircle size={20} className="mr-3" />
            <div>
              <h4 className="font-semibold">Error</h4>
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        <div className="bg-white dark:bg-marketplace-gray-900 shadow-marketplace-elevated rounded-marketplace-lg border border-marketplace-border-light overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Item Photos */}
              <div>
                <div className="flex items-center mb-4">
                  <Camera className="text-marketplace-primary mr-3" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-marketplace-text-primary">Add Photos</h3>
                    <p className="text-sm text-marketplace-text-secondary">Upload up to 5 high-quality photos</p>
                  </div>
                </div>
                <div className="bg-marketplace-gray-50 dark:bg-marketplace-gray-800 rounded-marketplace-lg border-2 border-dashed border-marketplace-border-medium p-6">
                  <ImageUpload 
                    images={images} 
                    onImagesChange={handleImagesChange}
                    maxImages={5}
                  />
                  <div className="mt-4 text-center">
                    <p className="text-sm text-marketplace-text-secondary">
                      <Upload size={16} className="inline mr-1" />
                      JPG, PNG up to 10MB each • First photo will be the cover
                    </p>
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div>
                <div className="flex items-center mb-4">
                  <FileText className="text-marketplace-primary mr-3" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-marketplace-text-primary">Item Details</h3>
                    <p className="text-sm text-marketplace-text-secondary">Provide detailed information about your item</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-bold text-marketplace-text-primary mb-2">
                      Ad Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-marketplace-border-medium rounded-marketplace-lg focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary bg-white dark:bg-marketplace-gray-800 text-marketplace-text-primary transition-colors"
                      placeholder="e.g., iPhone 15 Pro Max 256GB - Natural Titanium"
                    />
                    <p className="mt-1 text-xs text-marketplace-text-secondary">
                      Make it descriptive and specific to attract more buyers
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-bold text-marketplace-text-primary mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={5}
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-marketplace-border-medium rounded-marketplace-lg focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary bg-white dark:bg-marketplace-gray-800 text-marketplace-text-primary transition-colors"
                      placeholder="Describe your item in detail. Include brand, model, features, condition, and reason for selling..."
                    />
                    <p className="mt-1 text-xs text-marketplace-text-secondary">
                      Include all important details to help buyers make informed decisions
                    </p>
                  </div>
                </div>
              </div>

              {/* Category & Condition */}
              <div>
                <div className="flex items-center mb-4">
                  <Tag className="text-marketplace-primary mr-3" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-marketplace-text-primary">Category & Condition</h3>
                    <p className="text-sm text-marketplace-text-secondary">Help buyers find your item easily</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-bold text-marketplace-text-primary mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      id="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-marketplace-border-medium rounded-marketplace-lg focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary bg-white dark:bg-marketplace-gray-800 text-marketplace-text-primary transition-colors"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Condition */}
                  <div>
                    <label htmlFor="condition" className="block text-sm font-bold text-marketplace-text-primary mb-2">
                      Condition *
                    </label>
                    <select
                      name="condition"
                      id="condition"
                      required
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-marketplace-border-medium rounded-marketplace-lg focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary bg-white dark:bg-marketplace-gray-800 text-marketplace-text-primary transition-colors"
                    >
                      <option value="">Select condition</option>
                      {conditions.map(condition => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label} - {condition.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price & Location */}
              <div>
                <div className="flex items-center mb-4">
                  <DollarSign className="text-marketplace-primary mr-3" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-marketplace-text-primary">Price & Location</h3>
                    <p className="text-sm text-marketplace-text-secondary">Set your price and location</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Price */}
                  <div>
                    <label htmlFor="value" className="block text-sm font-bold text-marketplace-text-primary mb-2">
                      Price (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-marketplace-text-secondary">₹</span>
                      <input
                        type="number"
                        name="value"
                        id="value"
                        value={formData.value}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-3 border border-marketplace-border-medium rounded-marketplace-lg focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary bg-white dark:bg-marketplace-gray-800 text-marketplace-text-primary transition-colors"
                        placeholder="15000"
                      />
                    </div>
                    <p className="mt-1 text-xs text-marketplace-text-secondary">
                      Set a fair price to attract serious buyers
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-bold text-marketplace-text-primary mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-marketplace-text-secondary" size={16} />
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-marketplace-border-medium rounded-marketplace-lg focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary bg-white dark:bg-marketplace-gray-800 text-marketplace-text-primary transition-colors"
                        placeholder="Mumbai, Maharashtra"
                      />
                    </div>
                    <p className="mt-1 text-xs text-marketplace-text-secondary">
                      Help buyers know where the item is located
                    </p>
                  </div>
                </div>
              </div>

              {/* Trade Preferences */}
              <div>
                <div className="flex items-center mb-4">
                  <Package className="text-marketplace-primary mr-3" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-marketplace-text-primary">Trade Preferences</h3>
                    <p className="text-sm text-marketplace-text-secondary">What would you like in exchange?</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="interestedIn" className="block text-sm font-bold text-marketplace-text-primary mb-2">
                    What are you interested in trading for?
                  </label>
                  <textarea
                    name="interestedIn"
                    id="interestedIn"
                    rows={3}
                    value={formData.interestedIn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-marketplace-border-medium rounded-marketplace-lg focus:ring-2 focus:ring-marketplace-primary focus:border-marketplace-primary bg-white dark:bg-marketplace-gray-800 text-marketplace-text-primary transition-colors"
                    placeholder="Gaming console, Camera equipment, Laptop, or open to interesting offers..."
                  />
                  <p className="mt-1 text-xs text-marketplace-text-secondary">
                    Be specific about what you're looking for to get better trade offers
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t border-marketplace-border-light pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="text-sm text-marketplace-text-secondary">
                    <p>By posting, you agree to our Terms of Service and Privacy Policy</p>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-marketplace-primary text-white py-4 px-8 border border-transparent rounded-marketplace-lg shadow-marketplace-elevated text-lg font-bold hover:bg-marketplace-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marketplace-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Publishing Your Ad...
                      </>
                    ) : (
                      <>
                        <Zap size={20} className="mr-2" />
                        Publish Ad Now
                        <ArrowRight size={20} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white dark:bg-marketplace-gray-900 rounded-marketplace-lg border border-marketplace-border-light shadow-marketplace p-6">
          <h3 className="text-lg font-bold text-marketplace-text-primary mb-4 flex items-center">
            <Star className="mr-2 text-marketplace-secondary" size={20} />
            Tips for a Great Listing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <Camera size={16} className="text-marketplace-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-marketplace-text-primary">Use Quality Photos</h4>
                <p className="text-marketplace-text-secondary">Clear, well-lit photos get 5x more responses</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FileText size={16} className="text-marketplace-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-marketplace-text-primary">Detailed Description</h4>
                <p className="text-marketplace-text-secondary">Include all relevant details and specifications</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <DollarSign size={16} className="text-marketplace-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-marketplace-text-primary">Fair Pricing</h4>
                <p className="text-marketplace-text-secondary">Research similar items for competitive pricing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
