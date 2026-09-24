import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleAuthProvider, db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  idToken: string | null;
  googleAccessToken: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<string | null>;
  signOutUser: () => Promise<void>;
  getGoogleAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  idToken: null,
  googleAccessToken: null,
  loading: true,
  signInWithGoogle: async () => null,
  signOutUser: async () => {},
  getGoogleAccessToken: async () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);
          // Sync authenticated user with Cloud SQL database
          await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            })
          });

          // Optionally sync authenticated user profile to Firestore if available
          try {
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || null,
              photoURL: user.photoURL || null,
            }, { merge: true });
          } catch (fsErr) {
            console.warn('Firestore user profile sync skipped (using Cloud SQL backend):', fsErr);
          }
        } catch (err) {
          console.error('Failed to sync authenticated user:', err);
        }
      } else {
        setIdToken(null);
        setGoogleAccessToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<string | null> => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken || null;
      if (accessToken) {
        setGoogleAccessToken(accessToken);
      }
      const token = await result.user.getIdToken();
      setIdToken(token);

      await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        })
      });

      return accessToken;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const getGoogleAccessToken = async (): Promise<string | null> => {
    if (googleAccessToken) return googleAccessToken;
    return await signInWithGoogle();
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setIdToken(null);
      setGoogleAccessToken(null);
      setCurrentUser(null);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        idToken,
        googleAccessToken,
        loading,
        signInWithGoogle,
        signOutUser,
        getGoogleAccessToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
