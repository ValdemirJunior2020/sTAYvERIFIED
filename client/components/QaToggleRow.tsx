// File: components/QaToggleRow.tsx
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

type Props = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function QaToggleRow({ label, value, onChange }: Props) {
  return (
    <Pressable onPress={() => onChange(!value)} style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.right}>
        <Text style={[styles.state, value ? styles.good : styles.bad]}>
          {value ? 'Yes' : 'No'}
        </Text>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: '#3b2a2a', true: colors.primaryGlow }}
          thumbColor={colors.text}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  state: {
    fontSize: 12,
    fontWeight: '700'
  },
  good: {
    color: colors.success
  },
  bad: {
    color: colors.danger
  }
});
