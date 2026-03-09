// File: components/SliderField.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '@/constants/theme';

type Props = {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
};

export function SliderField({ label, leftLabel, rightLabel, value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}/5</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{leftLabel}</Text>
        <Text style={styles.meta}>{rightLabel}</Text>
      </View>

      <Slider
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.gold}
        maximumTrackTintColor="#473636"
        thumbTintColor={colors.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600'
  },
  value: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700'
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  meta: {
    color: colors.textMuted,
    fontSize: 11
  }
});
