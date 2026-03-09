// File: services/reviewVerification.ts
import { api } from '@/services/api';
import { ExpectationSliders, QaScorecard, ReviewTags, VerificationResult } from '@/types';

export async function verifyReviewWithAI(payload: {
  company: string;
  review: string;
  scorecard: QaScorecard;
  sliders: ExpectationSliders;
  tags: ReviewTags;
}) {
  const { data } = await api.post<VerificationResult>('/api/verify-review', payload);
  return data;
}
