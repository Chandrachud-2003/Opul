import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/axios';

export function AuthPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  interface GoogleAuthResult {
    user: {
      uid: string;
      email: string;
      emailVerified: boolean;
      displayName: string | null;
      photoURL: string | null;
      phoneNumber: string | null;
      metadata: {
        creationTime?: string;
        lastSignInTime?: string;
      };
      providerData: {
        providerId: string;
        uid: string;
        displayName: string | null;
        email: string | null;
        phoneNumber: string | null;
        photoURL: string | null;
      }[];
    };
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      const googleResult = (await signInWithGoogle()) as unknown as GoogleAuthResult;
      if (!googleResult?.user) throw new Error('No user data returned');
      
      // Check if user exists in MongoDB
      try {
        const response = await api.get(`/api/users/${googleResult.user.email}`);
        if (response.data) {
          console.log('User exists in MongoDB:', response.data);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log('User doesn\'t exist in MongoDB');
        } else {
          console.error('Error checking user:', error);
        }
      }

      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to ReferralHub</h1>
          <p className="text-gray-600">
            Join our community of smart referrers
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* Terms and Privacy Policy Notice */}
        <p className="mt-4 text-center text-sm text-gray-600">
          By logging in, you agree to our{' '}
          <a href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
