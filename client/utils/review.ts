// File: utils/review.ts
import { ExpectationSliders, QaScorecard, TrustBadge } from '@/types';

export function calculateTrustPercentage(scorecard: QaScorecard) {
  const checks = [
    scorecard.photosMatch,
    !scorecard.hiddenFees,
    scorecard.reservationFound,
    scorecard.advertisedPriceMatched,
    scorecard.smoothCheckIn,
    scorecard.helpfulSupport
  ];

  const positives = checks.filter(Boolean).length;
  return Math.round((positives / checks.length) * 100);
}

export function getTrustBadge(percent: number): TrustBadge {
  if (percent >= 90) return 'Gold';
  if (percent >= 75) return 'Silver';
  return 'Bronze';
}

export function averageSliderSummary(items: ExpectationSliders[]) {
  if (!items.length) return { visuals: 0, value: 0, process: 0 };
  const total = items.reduce(
    (acc, item) => ({
      visuals: acc.visuals + item.visuals,
      value: acc.value + item.value,
      process: acc.process + item.process
    }),
    { visuals: 0, value: 0, process: 0 }
  );

  return {
    visuals: Number((total.visuals / items.length).toFixed(1)),
    value: Number((total.value / items.length).toFixed(1)),
    process: Number((total.process / items.length).toFixed(1))
  };
}
