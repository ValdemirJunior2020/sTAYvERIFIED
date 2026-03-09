// File: types/index.ts
export type Confidence = 'low' | 'medium' | 'high';
export type TrustBadge = 'Bronze' | 'Silver' | 'Gold';

export type QaScorecard = {
  photosMatch: boolean;
  hiddenFees: boolean;
  reservationFound: boolean;
  advertisedPriceMatched: boolean;
  smoothCheckIn: boolean;
  helpfulSupport: boolean;
};

export type ExpectationSliders = {
  visuals: number;
  value: number;
  process: number;
};

export type ReviewTags = {
  bestFor: string[];
  bookingExperience: string[];
};

export type VerificationResult = {
  summary: string;
  confidence: Confidence;
  flags: string[];
  looksUseful: boolean;
  looksSpecific: boolean;
};

export type ReviewRecord = {
  id?: string;
  userId: string;
  company: string;
  review: string;
  proof?: string | null;
  trust_percentage: number;
  trust_badge: TrustBadge;
  qa_scorecard: QaScorecard;
  expectation_sliders: ExpectationSliders;
  tags: ReviewTags;
  verification_summary?: string;
  verification_confidence?: Confidence;
  verification_flags?: string[];
  created_at?: number;
  userEmail?: string;
};

export type CompanyRecord = {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  top_tags?: string[];
  trust_percentage: number;
  trust_badge: TrustBadge;
  created_at?: number;
};

export type UserRecord = {
  uid: string;
  email: string;
  displayName?: string;
  createdAt?: number;
};
