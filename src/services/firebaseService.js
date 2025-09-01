import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Users collection operations
export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    return userRef;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Items collection operations
export const createItem = async (itemData) => {
  try {
    const itemsRef = collection(db, 'items');
    const docRef = await addDoc(itemsRef, {
      ...itemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'available'
    });
    return docRef;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

export const getItems = async (filters = {}) => {
  try {
    console.log('getItems called with filters:', filters);
    let itemsQuery = collection(db, 'items');
    
    // Apply filters
    if (filters.category) {
      itemsQuery = query(itemsQuery, where('category', '==', filters.category));
    }
    if (filters.condition) {
      itemsQuery = query(itemsQuery, where('condition', '==', filters.condition));
    }
    if (filters.userId) {
      console.log('Filtering by userId:', filters.userId);
      itemsQuery = query(itemsQuery, where('userId', '==', filters.userId));
    }
    
    // Order by creation date only if we're not filtering by specific user
    // This avoids potential issues with serverTimestamp() ordering
    if (!filters.userId) {
      try {
        itemsQuery = query(itemsQuery, orderBy('createdAt', 'desc'));
      } catch (orderError) {
        console.warn('Ordering by createdAt failed, continuing without ordering:', orderError);
      }
    }
    
    // Apply limit
    if (filters.limit) {
      itemsQuery = query(itemsQuery, limit(filters.limit));
    }

    console.log('Executing query...');
    const querySnapshot = await getDocs(itemsQuery);
    const items = [];
    querySnapshot.forEach((doc) => {
      const itemData = { id: doc.id, ...doc.data() };
      console.log('Found item:', itemData);
      items.push(itemData);
    });
    
    console.log('Total items found:', items.length);
    
    // Sort manually if we couldn't sort in the query
    if (filters.userId) {
      items.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
    }
    
    return items;
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
};

export const getItemById = async (itemId) => {
  try {
    const itemRef = doc(db, 'items', itemId);
    const itemSnap = await getDoc(itemRef);
    
    if (itemSnap.exists()) {
      return { id: itemSnap.id, ...itemSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting item:', error);
    throw error;
  }
};

export const updateItem = async (itemId, itemData) => {
  try {
    const itemRef = doc(db, 'items', itemId);
    await updateDoc(itemRef, {
      ...itemData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    const itemRef = doc(db, 'items', itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// Trades collection operations
export const createTrade = async (tradeData) => {
  try {
    const tradesRef = collection(db, 'trades');
    const docRef = await addDoc(tradesRef, {
      ...tradeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending'
    });
    return docRef;
  } catch (error) {
    console.error('Error creating trade:', error);
    throw error;
  }
};

export const getTrades = async (userId) => {
  try {
    const tradesQuery = query(
      collection(db, 'trades'),
      where('participants', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(tradesQuery);
    const trades = [];
    querySnapshot.forEach((doc) => {
      trades.push({ id: doc.id, ...doc.data() });
    });
    
    return trades;
  } catch (error) {
    console.error('Error getting trades:', error);
    throw error;
  }
};

export const updateTrade = async (tradeId, tradeData) => {
  try {
    const tradeRef = doc(db, 'trades', tradeId);
    await updateDoc(tradeRef, {
      ...tradeData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating trade:', error);
    throw error;
  }
};

// Notifications collection operations
export const createNotification = async (notificationData) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const docRef = await addDoc(notificationsRef, {
      ...notificationData,
      createdAt: serverTimestamp(),
      read: false
    });
    return docRef;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getNotifications = async (userId) => {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(notificationsQuery);
    const notifications = [];
    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

export const updateNotification = async (notificationId, updates) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await deleteDoc(notificationRef);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Convenience functions
export const getAllItems = async () => {
  return await getItems();
};

export const getUserItems = async (userId) => {
  return await getItems({ userId });
};

// Default export with all functions
const firebaseService = {
  // User operations
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  
  // Item operations
  createItem,
  getItems,
  getAllItems,
  getUserItems,
  getItemById,
  updateItem,
  deleteItem,
  
  // Trade operations
  createTrade,
  getTrades,
  updateTrade,
  
  // Notification operations
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification
};

export default firebaseService;
