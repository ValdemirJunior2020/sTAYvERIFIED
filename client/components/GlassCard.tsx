// File: components/GlassCard.tsx
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius } from '@/constants/theme';

export function GlassCard({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.shell, style]} {...props}>
      <BlurView intensity={25} tint="dark" style={styles.blur}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardGlass
  },
  blur: {
    padding: 16
  }
});
