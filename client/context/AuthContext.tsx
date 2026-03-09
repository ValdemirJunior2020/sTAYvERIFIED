// File: context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { deleteUserProfile, markUserReviewsAsDeleted, upsertUserProfile } from '@/services/firestore';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (displayName: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser?.uid && nextUser.email) {
        await upsertUserProfile({
          uid: nextUser.uid,
          email: nextUser.email,
          displayName: nextUser.displayName || ''
        });
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      },
      signup: async (displayName, email, password) => {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (displayName.trim()) {
          await updateProfile(credential.user, { displayName: displayName.trim() });
        }

        await upsertUserProfile({
          uid: credential.user.uid,
          email: credential.user.email || email,
          displayName: displayName.trim()
        });
      },
      forgotPassword: async (email) => {
        await sendPasswordResetEmail(auth, email.trim());
      },
      logout: async () => {
        await signOut(auth);
      },
      deleteAccount: async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        await markUserReviewsAsDeleted(currentUser.uid);
        await deleteUserProfile(currentUser.uid);
        await deleteUser(currentUser);
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
