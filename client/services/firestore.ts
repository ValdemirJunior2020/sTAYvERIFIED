// File: services/firestore.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { CompanyRecord, ReviewRecord, UserRecord } from '@/types';
import { slugifyCompany } from '@/utils/company';

const usersCollection = collection(db, 'users');
const reviewsCollection = collection(db, 'reviews');
const companiesCollection = collection(db, 'companies');

export async function upsertUserProfile(user: UserRecord) {
  const userRef = doc(usersCollection, user.uid);
  await setDoc(
    userRef,
    {
      ...user,
      createdAt: user.createdAt || Date.now()
    },
    { merge: true }
  );
}

export async function createReview(record: ReviewRecord) {
  const reviewRef = await addDoc(reviewsCollection, {
    ...record,
    created_at: Date.now(),
    createdAtServer: serverTimestamp()
  });

  await upsertCompanyAggregate(record.company, record.tags.bestFor.concat(record.tags.bookingExperience), record);
  return reviewRef.id;
}

export async function upsertCompanyAggregate(companyName: string, tags: string[], latestReview: ReviewRecord) {
  const slug = slugifyCompany(companyName);
  const companyRef = doc(companiesCollection, slug);

  const reviewsSnapshot = await getDocs(
    query(reviewsCollection, where('company', '==', companyName))
  );

  const values = reviewsSnapshot.docs.map((item) => item.data().trust_percentage as number);
  values.push(latestReview.trust_percentage);
  const average = Math.round(values.reduce((acc, item) => acc + item, 0) / values.length);

  const tagCounter = new Map<string, number>();
  reviewsSnapshot.docs.forEach((item) => {
    const data = item.data();
    const bestFor = data.tags?.bestFor || [];
    const bookingExperience = data.tags?.bookingExperience || [];
    [...bestFor, ...bookingExperience].forEach((tag: string) => {
      tagCounter.set(tag, (tagCounter.get(tag) || 0) + 1);
    });
  });
  tags.forEach((tag) => tagCounter.set(tag, (tagCounter.get(tag) || 0) + 1));

  const topTags = [...tagCounter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag]) => tag);

  await setDoc(
    companyRef,
    {
      name: companyName,
      slug,
      description: `${companyName} trust intelligence profile on StayVerified.`,
      top_tags: topTags,
      trust_percentage: average,
      trust_badge: latestReview.trust_badge,
      created_at: Date.now()
    },
    { merge: true }
  );
}

export function subscribeRecentReviews(callback: (reviews: ReviewRecord[]) => void) {
  return onSnapshot(
    query(reviewsCollection, orderBy('created_at', 'desc'), limit(12)),
    (snapshot) => {
      callback(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as ReviewRecord)
        }))
      );
    }
  );
}

export function subscribeUserReviews(userId: string, callback: (reviews: ReviewRecord[]) => void) {
  return onSnapshot(
    query(reviewsCollection, where('userId', '==', userId), orderBy('created_at', 'desc')),
    (snapshot) => {
      callback(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as ReviewRecord)
        }))
      );
    }
  );
}

export function subscribeCompanies(callback: (companies: CompanyRecord[]) => void) {
  return onSnapshot(
    query(companiesCollection, orderBy('trust_percentage', 'desc'), limit(8)),
    (snapshot) => {
      callback(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as CompanyRecord)
        }))
      );
    }
  );
}

export function subscribeCompanyBySlug(slug: string, callback: (company: CompanyRecord | null) => void) {
  return onSnapshot(doc(companiesCollection, slug), (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback({
      id: snapshot.id,
      ...(snapshot.data() as CompanyRecord)
    });
  });
}

export function subscribeCompanyReviews(companyName: string, callback: (reviews: ReviewRecord[]) => void) {
  return onSnapshot(
    query(reviewsCollection, where('company', '==', companyName), orderBy('created_at', 'desc')),
    (snapshot) => {
      callback(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as ReviewRecord)
        }))
      );
    }
  );
}

export async function markUserReviewsAsDeleted(userId: string) {
  const snapshot = await getDocs(query(reviewsCollection, where('userId', '==', userId)));
  await Promise.all(
    snapshot.docs.map((item) =>
      updateDoc(item.ref, {
        userEmail: 'Deleted User',
        userId: 'deleted-user'
      })
    )
  );
}

export async function deleteUserProfile(uid: string) {
  await deleteDoc(doc(usersCollection, uid));
}
