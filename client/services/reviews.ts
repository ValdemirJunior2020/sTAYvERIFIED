// File: client/services/reviews.ts

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

export async function createReview(payload: any) {
  const user = auth.currentUser;

  console.log("createReview auth user:", user?.uid, user?.email);

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const docRef = await addDoc(collection(db, "reviews"), {
    ...payload,
    userId: user.uid,
    created_at: serverTimestamp(),
  });

  return docRef.id;
}