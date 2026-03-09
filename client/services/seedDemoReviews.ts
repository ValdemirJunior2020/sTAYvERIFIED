import { addDoc, collection, getDocs, limit, query, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { demoReviews } from "../data/demoReviews";

export async function seedDemoReviews() {
  const user = auth.currentUser;
  if (!user) throw new Error("Please log in before seeding demo data.");

  const existing = await getDocs(query(collection(db, "reviews"), limit(1)));
  if (!existing.empty) {
    return { inserted: 0, skipped: true };
  }

  for (const item of demoReviews) {
    await addDoc(collection(db, "reviews"), {
      ...item,
      userId: user.uid,
      created_at: serverTimestamp()
    });
  }

  return { inserted: demoReviews.length, skipped: false };
}
