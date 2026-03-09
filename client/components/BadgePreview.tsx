// File: components/BadgePreview.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { TrustBadge } from '@/types';

const badgeMap = {
  Bronze: require('../assets/bronze.png'),
  Silver: require('../assets/silver.png'),
  Gold: require('../assets/gold.png')
};

export function BadgePreview({ badge, trustPercentage }: { badge: TrustBadge; trustPercentage: number }) {
  return (
    <View style={styles.wrap}>
      <Image source={badgeMap[badge]} style={styles.image} resizeMode="contain" />
      <View style={{ gap: 4 }}>
        <Text style={styles.percent}>{trustPercentage}% Verified</Text>
        <Text style={styles.caption}>{badge} trust badge</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  image: {
    width: 58,
    height: 58
  },
  percent: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800'
  },
  caption: {
    color: colors.textMuted,
    fontSize: 12
  }
});
