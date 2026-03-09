// File: firebaseConfig.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCCaTBZ8hxGFilKz-0HrulxCUtZ6XhZ5PA',
  authDomain: 'instabrasil-91039.firebaseapp.com',
  projectId: 'instabrasil-91039',
  storageBucket: 'instabrasil-91039.firebasestorage.app',
  messagingSenderId: '923323771134',
  appId: '1:923323771134:web:7c0cd5d705e5680190ddaf',
  measurementId: 'G-FCGC93W9FQ'
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
