import firebaseService from '../services/firebaseService';

// Test function to create a notification manually
export const testCreateNotification = async (userId) => {
  try {
    console.log('🧪 Testing notification creation for user:', userId);
    
    const testNotification = {
      userId: userId,
      type: 'test',
      title: 'Test Notification',
      message: 'This is a test notification to create the collection',
      read: false
    };

    console.log('Creating test notification with data:', testNotification);
    
    const result = await firebaseService.createNotification(testNotification);
    
    console.log('✅ Test notification created successfully!', result);
    console.log('📝 Notification ID:', result.id);
    
    return result;
  } catch (error) {
    console.error('❌ Error creating test notification:', error);
    throw error;
  }
};

export default testCreateNotification;
