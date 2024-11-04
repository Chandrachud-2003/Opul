import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

export function GoogleSignInButton() {
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Redirect or update UI after successful sign-in
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <GoogleIcon />
      <span>Continue with Google</span>
    </button>
  );
} 