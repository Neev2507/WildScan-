import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

import { FIREBASE_CONFIG } from '../utils/firebaseConfig';

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

// Note: Firebase Auth automatically uses browser localStorage on web
// and will persist auth state. On native, we rely on the default behavior
// as AsyncStorage integration requires React Native specific modules.

export const subscribeAuthState = (callback) => onAuthStateChanged(auth, callback);

export const signInAsGuest = async () => {
  const credential = await signInAnonymously(auth);
  await createUserDocument(credential.user, {
    displayName: 'Guest',
    avatarURL: null,
    totalPoints: 0,
    animalsScanned: 0,
  });
  return credential;
};

export const signInWithGoogleWeb = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  await createUserDocument(userCredential.user, {
    displayName: userCredential.user.displayName || 'WildScan User',
    avatarURL: userCredential.user.photoURL || null,
  });
  return userCredential;
};

export const createUserDocument = async (user, extraData = {}) => {
  if (!user || !user.uid) return null;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  const baseData = {
    displayName: user.displayName || 'WildScan User',
    avatarURL: user.photoURL || null,
    totalPoints: 0,
    animalsScanned: 0,
  };

  if (snapshot.exists()) {
    const current = snapshot.data();
    await setDoc(
      userRef,
      {
        displayName: baseData.displayName,
        avatarURL: baseData.avatarURL,
        lastSeenAt: serverTimestamp(),
        ...extraData,
      },
      { merge: true }
    );
    return { id: user.uid, ...current, ...extraData };
  }

  const newDoc = {
    ...baseData,
    ...extraData,
    createdAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
  };

  await setDoc(userRef, newDoc);
  return { id: user.uid, ...newDoc };
};

export const getUserDocument = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const signOutUser = async () => signOut(auth);

export const getLeaderboard = async () => {
  const leaderboardQuery = query(collection(db, 'users'), orderBy('totalPoints', 'desc'), limit(20));
  const snapshot = await getDocs(leaderboardQuery);
  return snapshot.docs.map((result) => ({ id: result.id, ...result.data() }));
};

export { auth, db };

