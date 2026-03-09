// File: app/(auth)/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useHydratedAuth } from '@/hooks/useHydratedAuth';

export default function AuthLayout() {
  const { user, loading } = useHydratedAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/home');
    }
  }, [loading, user]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
