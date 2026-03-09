import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

export async function signupUser(
  email: string,
  password: string,
  displayName?: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName?.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim() });
  }

  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    email: cred.user.email,
    displayName: displayName?.trim() || "",
    createdAt: serverTimestamp(),
  });

  return cred.user;
}

export async function loginUser(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function forgotPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  await signOut(auth);
}

export async function deleteCurrentUserAccount() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user.");
  }

  await deleteDoc(doc(db, "users", user.uid)).catch(() => {});
  await deleteUser(user);
}
