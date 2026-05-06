import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { subscribeAuthState, getUserDocument, createUserDocument } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [needsUsername, setNeedsUsername] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setNeedsUsername(false);
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
        const newProfile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.isAnonymous ? 'Guest' : firebaseUser.displayName || 'WildScan User',
          avatarURL: firebaseUser.photoURL ?? null,
          totalPoints: 0,
          animalsScanned: 0,
        };
        setProfile(newProfile);
        setNeedsUsername(true);
      } else {
        setProfile(existingProfile);
        setNeedsUsername(!existingProfile.username);
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const updated = await getUserDocument(user.uid);
    if (updated) {
      setProfile(updated);
      setNeedsUsername(!updated.username);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, initializing, needsUsername, refreshProfile }}>
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
