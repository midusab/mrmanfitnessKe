import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, signInWithGoogle, logout, OperationType, handleFirestoreError } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  profile: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch or create profile
        try {
          await ensureProfile(currentUser);
        } catch (e) {
          console.error("Profile synchronization error:", e);
          // Don't block the UI if profile creation fails (e.g. adblocker)
          setLoading(false);
        }
        
        // Real-time profile sync
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const unsubProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
          setLoading(false);
        }, (error) => {
          console.error("Profile snapshot error:", error);
          handleFirestoreError(error, OperationType.GET, `profiles/${currentUser.uid}`);
          setLoading(false);
        });

        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const ensureProfile = async (firebaseUser: User) => {
    const profileRef = doc(db, 'profiles', firebaseUser.uid);
    try {
      const docSnap = await getDoc(profileRef);
      
      if (!docSnap.exists()) {
        const isAdmin = ['midusab@gmail.com', 'bochieng228@gmail.com'].includes(firebaseUser.email || '');
        const newProfile = {
          id: firebaseUser.uid,
          display_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          photo_url: firebaseUser.photoURL,
          role: isAdmin ? 'admin' : 'user',
          bio: '',
          updated_at: new Date().toISOString(),
        };
        await setDoc(profileRef, newProfile);
        setProfile(newProfile);
      } else {
        const existingData = docSnap.data();
        const isAdmin = ['midusab@gmail.com', 'bochieng228@gmail.com'].includes(firebaseUser.email || '');
        // Ensure admin role if email matches but role is not set
        if (isAdmin && existingData.role !== 'admin') {
          await updateDoc(profileRef, { role: 'admin' });
          setProfile({ ...existingData, role: 'admin' });
        } else {
          setProfile(existingData);
        }
      }
    } catch (error) {
      console.warn("Could not ensure profile existence. This is likely due to an AdBlocker or restrictive network policy blocking the database write.", error);
      // We don't rethrow here to allow the user to at least enter the app
    }
  };

  const signIn = async () => {
    await signInWithGoogle();
  };

  const logOut = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logOut, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
