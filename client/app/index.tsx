// File: app/index.tsx
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/theme';
import { useHydratedAuth } from '@/hooks/useHydratedAuth';

export default function Index() {
  const { user, loading } = useHydratedAuth();

  useEffect(() => {
    if (loading) return;
    if (user) router.replace('/(tabs)/home');
    else router.replace('/(auth)/login');
  }, [loading, user]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.text} size="large" />
    </View>
  );
}
