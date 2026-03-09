// File: utils/date.ts
export function formatDate(timestamp?: number) {
  if (!timestamp) return 'Just now';
  return new Date(timestamp).toLocaleDateString();
}
