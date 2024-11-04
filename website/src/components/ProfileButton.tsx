import { Menu } from '@headlessui/react';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import type { User } from 'firebase/auth';

interface ProfileButtonProps {
  user: User;
}

export function ProfileButton({ user }: ProfileButtonProps) {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 rounded-full">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || 'Profile'}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        )}
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg">
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-gray-100' : ''
              } block w-full px-4 py-2 text-left text-sm`}
              onClick={handleSignOut}
            >
              Sign out
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
} 