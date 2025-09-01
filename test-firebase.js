// Test script to add a sample item to Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWGmKKelS2m3v4qW2qGgAaZjgGD0C3VgE",
  authDomain: "hci-final-e6d6e.firebaseapp.com",
  projectId: "hci-final-e6d6e",
  storageBucket: "hci-final-e6d6e.firebasestorage.app",
  messagingSenderId: "455306424244",
  appId: "1:455306424244:web:6d23b1fb4e1ac78b8fc66d",
  measurementId: "G-FPFZQ1YNC0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addTestItem = async () => {
  try {
    const testItem = {
      title: "Test Item",
      description: "This is a test item to verify Firebase connection",
      category: "Electronics",
      condition: "Like New",
      value: 100,
      location: "Test Location",
      userId: "test-user-123",
      images: [
        {
          url: "https://via.placeholder.com/300x200?text=Test+Item",
          public_id: "test_image_1"
        }
      ],
      status: "available",
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'items'), testItem);
    console.log("Test item added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding test item: ", error);
  }
};

addTestItem();
