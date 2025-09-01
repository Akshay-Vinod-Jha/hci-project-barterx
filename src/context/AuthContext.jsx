import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const googleProvider = new GoogleAuthProvider();

  // Google Sign In
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Create or update user profile in Firestore
      await createOrUpdateUserProfile(user);
      
      return user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  // Email/Password Registration
  const registerWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Update display name
      await updateProfile(user, { displayName });
      
      // Create user profile in Firestore
      await createOrUpdateUserProfile(user, { displayName });
      
      return user;
    } catch (error) {
      console.error('Email registration error:', error);
      throw error;
    }
  };

  // Email/Password Sign In
  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  // Password Reset
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Create or update user profile in Firestore
  const createOrUpdateUserProfile = async (user, additionalData = {}) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      const userData = {
        email: user.email,
        displayName: user.displayName || additionalData.displayName || '',
        photoURL: user.photoURL || '',
        lastLogin: new Date(),
        ...additionalData
      };

      if (!userSnap.exists()) {
        // Create new user profile
        userData.createdAt = new Date();
        userData.tradingStats = {
          totalTrades: 0,
          successfulTrades: 0,
          rating: 0,
          totalRatings: 0
        };
      }

      await setDoc(userRef, userData, { merge: true });
      setUserProfile(userData);
      
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  };

  // Get user profile from Firestore
  const getUserProfile = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const profile = userSnap.data();
        setUserProfile(profile);
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updatedData) => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        ...updatedData,
        updatedAt: new Date()
      }, { merge: true });
      
      setUserProfile(prev => ({ ...prev, ...updatedData }));
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('AuthContext: Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AuthContext: Auth state changed, user:', user ? user.uid : 'null');
      setCurrentUser(user);
      
      if (user) {
        console.log('AuthContext: User is logged in, getting profile...');
        // Get user profile from Firestore
        await getUserProfile(user.uid);
      } else {
        console.log('AuthContext: No user, clearing profile...');
        setUserProfile(null);
      }
      
      console.log('AuthContext: Setting loading to false');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loginWithGoogle,
    registerWithEmail,
    loginWithEmail,
    resetPassword,
    logout,
    updateUserProfile,
    getUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
