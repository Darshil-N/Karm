import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const AuthTest: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [authStatus, setAuthStatus] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setAuthStatus(`✅ Logged in as: ${user.email}`);
      } else {
        setAuthStatus('❌ Not logged in');
      }
    });

    return () => unsubscribe();
  }, []);

  const testFirebaseConfig = () => {
    console.log('Firebase Auth:', auth);
    console.log('Firebase App:', auth.app);
    console.log('Firebase Config:', auth.config);
    
    setAuthStatus('🔍 Firebase configuration logged to console');
  };

  const testCreateAccount = async () => {
    if (!testEmail || !testPassword) {
      setAuthStatus('❌ Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(testEmail)) {
        throw new Error('Invalid email format');
      }

      if (testPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      console.log('Creating account for:', testEmail);
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail.trim(), testPassword);
      setAuthStatus(`✅ Account created successfully for: ${userCredential.user.email}`);
      console.log('User created:', userCredential.user);
    } catch (error: any) {
      console.error('Create account error:', error);
      setAuthStatus(`❌ Create account failed: ${error.code} - ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    if (!testEmail || !testPassword) {
      setAuthStatus('❌ Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Logging in:', testEmail);
      const userCredential = await signInWithEmailAndPassword(auth, testEmail.trim(), testPassword);
      setAuthStatus(`✅ Login successful for: ${userCredential.user.email}`);
      console.log('User logged in:', userCredential.user);
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthStatus(`❌ Login failed: ${error.code} - ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSignOut = async () => {
    try {
      await auth.signOut();
      setAuthStatus('✅ Signed out successfully');
    } catch (error: any) {
      setAuthStatus(`❌ Sign out failed: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Auth Test</CardTitle>
          <CardDescription>Test Firebase authentication functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Email:</label>
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Test Password:</label>
            <Input
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="password123"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={testFirebaseConfig}
              variant="outline"
              size="sm"
            >
              Check Config
            </Button>
            <Button 
              onClick={testCreateAccount}
              disabled={isLoading}
              size="sm"
            >
              Create Account
            </Button>
            <Button 
              onClick={testLogin}
              disabled={isLoading}
              variant="secondary"
              size="sm"
            >
              Login
            </Button>
            <Button 
              onClick={testSignOut}
              disabled={isLoading}
              variant="destructive"
              size="sm"
            >
              Sign Out
            </Button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm font-medium mb-1">Current Status:</div>
            <div className="text-sm">{authStatus}</div>
          </div>

          {currentUser && (
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <div className="text-sm font-medium mb-1">Current User:</div>
              <div className="text-sm">
                <div>Email: {currentUser.email}</div>
                <div>UID: {currentUser.uid}</div>
                <div>Email Verified: {currentUser.emailVerified ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest;