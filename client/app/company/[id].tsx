// File: app/company/[id].tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { GlassCard } from '@/components/GlassCard';
import { BadgePreview } from '@/components/BadgePreview';
import { TagChip } from '@/components/TagChip';
import { ReviewCard } from '@/components/ReviewCard';
import { SectionHeader } from '@/components/SectionHeader';
import { colors } from '@/constants/theme';
import { CompanyRecord, ReviewRecord } from '@/types';
import { subscribeCompanyBySlug, subscribeCompanyReviews } from '@/services/firestore';
import { averageSliderSummary } from '@/utils/review';

export default function CompanyProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyRecord | null>(null);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);

  useEffect(() => {
    if (!id) return;
    const unsubCompany = subscribeCompanyBySlug(id, setCompany);
    return () => unsubCompany();
  }, [id]);

  useEffect(() => {
    if (!company?.name) return;
    return subscribeCompanyReviews(company.name, setReviews);
  }, [company?.name]);

  const sliderSummary = useMemo(
    () => averageSliderSummary(reviews.map((item) => item.expectation_sliders)),
    [reviews]
  );

  const commonFlags = useMemo(() => {
    const counter = new Map<string, number>();
    reviews.forEach((item) => {
      (item.verification_flags || []).forEach((flag) => counter.set(flag, (counter.get(flag) || 0) + 1));
    });
    return [...counter.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([flag]) => flag);
  }, [reviews]);

  if (!company) {
    return (
      <Screen>
        <GlassCard>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>Company not found yet</Text>
          <Text style={{ color: colors.textMuted, marginTop: 10 }}>
            Once a review is submitted, this trust profile will populate automatically.
          </Text>
        </GlassCard>
      </Screen>
    );
  }

  return (
    <Screen>
      <GlassCard>
        <Text style={styles.name}>{company.name}</Text>
        <Text style={styles.desc}>{company.description}</Text>
        <View style={{ marginTop: 16 }}>
          <BadgePreview badge={company.trust_badge} trustPercentage={company.trust_percentage} />
        </View>
      </GlassCard>

      <GlassCard>
        <SectionHeader title="Top intent tags" subtitle="The most common use cases and booking signals reported by travelers." />
        <View style={styles.tags}>
          {(company.top_tags || []).map((tag) => (
            <TagChip key={tag} label={tag} selected />
          ))}
        </View>
      </GlassCard>

      <GlassCard>
        <SectionHeader title="Expectation summaries" subtitle="How this company feels on visuals, value, and booking flow." />
        <Text style={styles.metric}>Visuals: {sliderSummary.visuals}/5</Text>
        <Text style={styles.metric}>Value: {sliderSummary.value}/5</Text>
        <Text style={styles.metric}>Process: {sliderSummary.process}/5</Text>
      </GlassCard>

      <GlassCard>
        <SectionHeader title="Common red flags" subtitle="Signal clustering from AI verification and recent proof-backed reviews." />
        {commonFlags.length ? (
          <View style={styles.tags}>
            {commonFlags.map((flag) => (
              <TagChip key={flag} label={flag} />
            ))}
          </View>
        ) : (
          <Text style={styles.muted}>No significant red flags are clustering yet.</Text>
        )}
      </GlassCard>

      <GlassCard>
        <SectionHeader title="Trust trend" subtitle="Placeholder for time-series trust analytics and partner dashboards." />
        <Text style={styles.muted}>
          This section is ready for premium business intelligence, trust trend charts, and claimed profile analytics.
        </Text>
      </GlassCard>

      <View style={{ gap: 14 }}>
        <SectionHeader title="Recent reviews" subtitle="Traveler stories, proof images, and trust calculations." />
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900'
  },
  desc: {
    color: colors.textMuted,
    marginTop: 8,
    lineHeight: 20
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12
  },
  metric: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8
  },
  muted: {
    color: colors.textMuted,
    marginTop: 12,
    lineHeight: 20
  }
});
