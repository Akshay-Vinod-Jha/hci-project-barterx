import React, { useState } from 'react';

const CloudinaryTest = () => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const testUpload = async (file) => {
    setUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'baterx_unsigned');
    formData.append('cloud_name', 'dytrdwq82');

    try {
      console.log('Testing upload to cloudinary...');
      console.log('Cloud Name:', 'dytrdwq82');
      console.log('Upload Preset:', 'baterx_unsigned');
      console.log('File:', file.name, file.size, file.type);

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dytrdwq82/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(`Upload failed: ${data.error?.message || 'Unknown error'}`);
      }

      setResult(data);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      testUpload(file);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg m-4">
      <h2 className="text-xl font-bold mb-4">Cloudinary Upload Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Image Upload
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {uploading && (
          <div className="text-blue-600 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Uploading...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p><strong>Success!</strong> Image uploaded successfully.</p>
            <p><strong>URL:</strong> <a href={result.secure_url} target="_blank" rel="noopener noreferrer" className="underline">{result.secure_url}</a></p>
            <p><strong>Public ID:</strong> {result.public_id}</p>
            <img src={result.secure_url} alt="Uploaded" className="mt-2 max-w-xs rounded" />
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>Cloud Name:</strong> dytrdwq82</p>
          <p><strong>Upload Preset:</strong> baterx_unsigned</p>
          <p><strong>Note:</strong> Make sure you've created the 'baterx_unsigned' upload preset in your Cloudinary dashboard with signing mode set to 'Unsigned'.</p>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryTest;
