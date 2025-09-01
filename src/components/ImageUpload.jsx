import React, { useState } from 'react';
import { uploadImageToCloudinary } from '../config/cloudinary';

const ImageUpload = ({ images, onImagesChange, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      const uploadPromises = fileArray.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select only image files');
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File size must be less than 5MB');
        }
        
        console.log('Uploading file:', file.name, 'to cloud:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
        const result = await uploadImageToCloudinary(file);
        console.log('Upload result:', result);
        return result;
      });
      
      const results = await Promise.all(uploadPromises);
      const newImages = [...images, ...results];
      onImagesChange(newImages);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600">Uploading to Cloudinary...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-gray-400">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">Click to upload or drag and drop</p>
              <p>PNG, JPG, GIF up to 5MB</p>
              <p>Maximum {maxImages} images</p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Guidelines */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, GIF</p>
        <p>• Maximum file size: 5MB per image</p>
        <p>• For best results, use high-quality images with good lighting</p>
        <p>• You can upload up to {maxImages} images</p>
        <p>• Images uploaded: {images.length}/{maxImages}</p>
      </div>
    </div>
  );
};

export default ImageUpload;
