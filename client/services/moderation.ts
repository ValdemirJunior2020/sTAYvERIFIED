// File: client/services/moderation.ts

import api from "./api";

export type ModerationResult = {
  ok: boolean;
  allowed: boolean;
  flagged: boolean;
  flags: string[];
  message: string;
  source: string;
};

export async function moderateReview(
  company: string,
  review: string
): Promise<ModerationResult> {
  const response = await api.post("/api/moderate-review", {
    company,
    review,
  });

  return response.data;
}