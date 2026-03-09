// File: components/ReviewCard.tsx
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { GlassCard } from '@/components/GlassCard';
import { TagChip } from '@/components/TagChip';
import { colors } from '@/constants/theme';
import { ReviewRecord } from '@/types';
import { formatDate } from '@/utils/date';
import { slugifyCompany } from '@/utils/company';

const badgeMap = {
  Bronze: require('../assets/bronze.png'),
  Silver: require('../assets/silver.png'),
  Gold: require('../assets/gold.png')
};

export function ReviewCard({ review }: { review: ReviewRecord }) {
  return (
    <Pressable onPress={() => router.push(`/company/${slugifyCompany(review.company)}`)}>
      <GlassCard>
        <View style={styles.header}>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={styles.company}>{review.company}</Text>
            <Text style={styles.meta}>{formatDate(review.created_at)}</Text>
          </View>
          <Image source={badgeMap[review.trust_badge]} style={styles.badge} />
        </View>

        {review.proof ? <Image source={{ uri: review.proof }} style={styles.preview} resizeMode="cover" /> : null}

        <Text style={styles.summary} numberOfLines={3}>
          {review.verification_summary || review.review}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.percent}>{review.trust_percentage}% Verified</Text>
          <View style={styles.tags}>
            {review.tags.bestFor.slice(0, 2).map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 14
  },
  company: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800'
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12
  },
  badge: {
    width: 42,
    height: 42
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 14
  },
  summary: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12
  },
  footer: {
    gap: 10
  },
  percent: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '800'
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  }
});
