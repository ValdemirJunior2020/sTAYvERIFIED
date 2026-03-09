// File: components/TagChip.tsx
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '@/constants/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function TagChip({ label, selected, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.selected]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  selected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryGlow
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600'
  },
  selectedLabel: {
    color: colors.text
  }
});
