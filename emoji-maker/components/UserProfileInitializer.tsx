'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function UserProfileInitializer() {
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      createOrGetUserClient();
    }
  }, [isLoaded, userId]);

  async function createOrGetUserClient() {
    try {
      const response = await fetch('/api/auth/create-or-get-user', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to create or get user');
      }
      const user = await response.json();
      console.log('User:', user);
    } catch (error) {
      console.error('Error creating or getting user:', error);
    }
  }

  return null; // This component doesn't render anything
}