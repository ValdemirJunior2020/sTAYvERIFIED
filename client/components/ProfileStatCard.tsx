// File: components/ProfileStatCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/constants/theme';

export function ProfileStatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    padding: 16,
    gap: 4
  },
  value: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 18
  },
  label: {
    color: colors.textMuted,
    fontSize: 12
  }
});
