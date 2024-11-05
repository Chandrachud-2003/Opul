import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut, signInWithRedirect, getAuth, GoogleAuthProvider, getRedirectResult, UserCredential } from 'firebase/auth';
import { createOrUpdateUser } from '../utils/userUtils';

interface AuthContextType {
  user: any;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Check last login time from your database
        const token = await user.getIdToken();
        const response = await fetch('/api/auth/verify-session', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          // Force sign out if session is expired
          await signOut();
          return;
        }
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (!result?.user) throw new Error('No user data returned');
      await createOrUpdateUser(result.user);
      return result;
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear any stored tokens or session data
      localStorage.removeItem('authToken'); // If you're storing any tokens
      sessionStorage.clear(); // Clear any session data

      // Sign out from Firebase
      await firebaseSignOut(auth);

      // Clear user state
      setUser(null);

      // Optional: Call your backend to invalidate the session
      try {
        await api.post('/api/auth/logout');
      } catch (error) {
        console.error('Error invalidating server session:', error);
      }

    } catch (error) {
      console.error('Sign-out error:', error);
      throw error; // Rethrow to handle in the component
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}; 