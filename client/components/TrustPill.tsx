// File: components/TrustPill.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/constants/theme';

export function TrustPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    borderRadius: radius.md,
    padding: 14,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 5
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800'
  },
  label: {
    color: colors.textMuted,
    fontSize: 12
  }
});
