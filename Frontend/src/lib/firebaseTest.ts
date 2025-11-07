import { auth, db } from './firebase';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

// Test function to verify Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    console.log('Auth instance:', auth);
    console.log('Firestore instance:', db);
    console.log('Current user:', auth.currentUser);
    
    // Test if we can access auth state
    auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
    });
    
    return { success: true, message: 'Firebase initialized successfully' };
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return { success: false, error };
  }
};

// Call test function
testFirebaseConnection();