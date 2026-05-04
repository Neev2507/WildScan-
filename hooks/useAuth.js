import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeAuthState, getUserDocument, createUserDocument } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setInitializing(false);
        return;
      }

      setUser(firebaseUser);
      const existingProfile = await getUserDocument(firebaseUser.uid);

      if (!existingProfile) {
        await createUserDocument(firebaseUser, {
          displayName: firebaseUser.isAnonymous ? 'Guest' : firebaseUser.displayName || 'WildScan User',
          avatarURL: firebaseUser.photoURL ?? null,
          totalPoints: 0,
          animalsScanned: 0,
        });
        setProfile({
          uid: firebaseUser.uid,
          displayName: firebaseUser.isAnonymous ? 'Guest' : firebaseUser.displayName || 'WildScan User',
          avatarURL: firebaseUser.photoURL ?? null,
          totalPoints: 0,
          animalsScanned: 0,
        });
      } else {
        setProfile(existingProfile);
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
