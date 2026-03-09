// File: components/GradientButton.tsx
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius } from '@/constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function GradientButton({ title, onPress, loading, disabled }: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={{ opacity: disabled ? 0.55 : 1 }}>
      <LinearGradient colors={gradients.button as [string, string]} style={styles.button}>
        {loading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.text}>{title}</Text>}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  text: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700'
  }
});
