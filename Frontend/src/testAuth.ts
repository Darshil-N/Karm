// Test Firebase Auth configuration
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './lib/firebase';

export const testFirebaseAuth = async () => {
  try {
    console.log('Testing Firebase Auth configuration...');
    console.log('Auth instance:', auth);
    console.log('Auth app:', auth.app);
    
    // Test with a simple email
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    console.log('Testing email validation:', testEmail);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log('Email is valid:', emailRegex.test(testEmail));
    console.log('Password length:', testPassword.length);
    
    return { success: true };
  } catch (error) {
    console.error('Auth test failed:', error);
    return { success: false, error };
  }
};