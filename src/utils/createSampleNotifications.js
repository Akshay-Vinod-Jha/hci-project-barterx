import firebaseService from '../services/firebaseService';

// Utility function to create sample notifications for testing
export const createSampleNotifications = async (userId) => {
  try {
    console.log('Creating sample notifications for user:', userId);

    const sampleNotifications = [
      {
        userId: userId,
        type: 'trade_request',
        title: 'New Trade Request',
        message: 'Someone wants to trade with your iPhone 12!',
        tradeId: 'sample-trade-1',
        itemId: 'sample-item-1',
        fromUserId: 'other-user-1',
        read: false
      },
      {
        userId: userId,
        type: 'trade_accepted',
        title: 'Trade Accepted',
        message: 'Your trade request for the MacBook has been accepted!',
        tradeId: 'sample-trade-2',
        itemId: 'sample-item-2',
        fromUserId: 'other-user-2',
        read: false
      },
      {
        userId: userId,
        type: 'system',
        title: 'Welcome to BarterX',
        message: 'Welcome to our trading platform! Start by adding your first item.',
        read: false
      },
      {
        userId: userId,
        type: 'trade_completed',
        title: 'Trade Completed',
        message: 'Your trade has been completed successfully! 🎉',
        tradeId: 'sample-trade-3',
        read: true
      }
    ];

    for (const notification of sampleNotifications) {
      await firebaseService.createNotification(notification);
      console.log('Created notification:', notification.title);
    }

    console.log('✅ All sample notifications created successfully!');
    return sampleNotifications.length;
  } catch (error) {
    console.error('❌ Error creating sample notifications:', error);
    throw error;
  }
};

export default createSampleNotifications;
