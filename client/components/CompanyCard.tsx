// File: components/CompanyCard.tsx
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { GlassCard } from '@/components/GlassCard';
import { colors } from '@/constants/theme';
import { CompanyRecord } from '@/types';

const badgeMap = {
  Bronze: require('../assets/bronze.png'),
  Silver: require('../assets/silver.png'),
  Gold: require('../assets/gold.png')
};

export function CompanyCard({ company }: { company: CompanyRecord }) {
  return (
    <Pressable onPress={() => router.push(`/company/${company.slug}`)}>
      <GlassCard style={styles.card}>
        <View style={styles.top}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.name}>{company.name}</Text>
            <Text style={styles.desc} numberOfLines={1}>
              {company.description || 'Trust intelligence profile'}
            </Text>
          </View>
          <Image source={badgeMap[company.trust_badge]} style={styles.badge} />
        </View>
        <Text style={styles.value}>{company.trust_percentage}% Verified</Text>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250
  },
  top: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 14
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800'
  },
  desc: {
    color: colors.textMuted,
    fontSize: 12
  },
  badge: {
    width: 40,
    height: 40
  },
  value: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: '800'
  }
});
