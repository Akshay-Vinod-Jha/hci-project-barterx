// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET
};

// Function to upload image to Cloudinary
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'baterx_unsigned'); // We'll create this preset
  formData.append('cloud_name', cloudinaryConfig.cloudName);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Function to delete image from Cloudinary (requires signed request - better to do server-side)
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    // For now, we'll just log this - deletion should be handled server-side for security
    console.log('Delete request for:', publicId);
    console.warn('Image deletion should be implemented server-side for security');
    return { result: 'ok' };
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};
