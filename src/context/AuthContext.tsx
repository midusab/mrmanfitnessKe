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
        await ensureProfile(currentUser);
        
        // Real-time profile sync
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const unsubProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `profiles/${currentUser.uid}`);
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
        const newProfile = {
          id: firebaseUser.uid,
          display_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          photo_url: firebaseUser.photoURL,
          role: firebaseUser.email === 'midusab@gmail.com' ? 'admin' : 'user',
          bio: '',
          updated_at: new Date().toISOString(),
        };
        await setDoc(profileRef, newProfile);
        setProfile(newProfile);
      } else {
        const existingData = docSnap.data();
        // Ensure admin role if email matches but role is not set
        if (firebaseUser.email === 'midusab@gmail.com' && existingData.role !== 'admin') {
          await updateDoc(profileRef, { role: 'admin' });
          setProfile({ ...existingData, role: 'admin' });
        } else {
          setProfile(existingData);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `profiles/${firebaseUser.uid}`);
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
