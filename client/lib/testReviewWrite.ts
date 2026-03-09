// File: client/lib/testReviewWrite.ts

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export async function testReviewWrite() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  const docRef = await addDoc(collection(db, "reviews"), {
    userId: user.uid,
    company: "Test Hotel",
    review: "This is a browser test review with enough detail to pass basic checks.",
    proof: "",
    trust_percentage: 88,
    trust_badge: "Silver",
    qa_scorecard: {
      matchedPhotos: true,
      hiddenFees: false,
      reservationFound: true,
      finalPriceMatched: true,
      smoothCheckIn: true,
      helpfulSupport: true
    },
    expectation_sliders: {
      visuals: 4,
      value: 4,
      process: 5
    },
    tags: {
      bestFor: ["Business Trip"],
      bookingExperience: ["Instant Confirmation", "Accurate Listing"]
    },
    verification_summary: "Test verification",
    verification_confidence: "medium",
    verification_flags: [],
    created_at: serverTimestamp()
  });

  return docRef.id;
}