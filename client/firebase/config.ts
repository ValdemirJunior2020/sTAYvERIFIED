import { Platform } from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  inMemoryPersistence,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7Y-LT6hBF9uhv2Fj-J74KencZqvOiwJg",
  authDomain: "psych-support-app.firebaseapp.com",
  projectId: "psych-support-app",
  storageBucket: "psych-support-app.firebasestorage.app",
  messagingSenderId: "1090749452629",
  appId: "1:1090749452629:web:073d01319785225c0cdfdc",
  measurementId: "G-NX0KK99XFC",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: any;

if (Platform.OS === "web") {
  auth = getAuth(app);
  auth
    .setPersistence(browserLocalPersistence)
    .catch(() => auth.setPersistence(inMemoryPersistence));
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // If Auth was already initialized (e.g. on fast refresh), reuse the existing instance
    auth = getAuth(app);
  }
}

const db = getFirestore(app);

export { app, auth, db };
export default app;
