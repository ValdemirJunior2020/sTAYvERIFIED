// File: hooks/useHydratedAuth.ts
import { useAuth } from '@/context/AuthContext';

export function useHydratedAuth() {
  return useAuth();
}
