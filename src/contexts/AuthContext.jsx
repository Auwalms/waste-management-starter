import { createContext, useContext, useEffect, useState } from "react";
import { mockUser, mockProfile } from "../data/mockData";

// TODO: Import Firebase auth functions during workshop
// import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with Firebase Google Sign-In during workshop
  function loginWithGoogle() {
    // Mock login - simulates successful Google Sign-In
    console.log("MOCK: Logging in with Google...");
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(mockUser);
        resolve({ user: mockUser });
      }, 500);
    });
  }

  // TODO: Replace with Firebase signOut during workshop
  function logout() {
    // Mock logout
    console.log("MOCK: Logging out...");
    return new Promise((resolve) => {
      setCurrentUser(null);
      setUserProfile(null);
      resolve();
    });
  }

  // TODO: Replace with Firestore profile refresh during workshop
  async function refreshProfile() {
    // Mock profile refresh
    console.log("MOCK: Refreshing profile...");
    if (currentUser) {
      setUserProfile(mockProfile);
    }
  }

  useEffect(() => {
    // TODO: Replace with onAuthStateChanged during workshop
    // For now, simulate a logged-in user with profile
    console.log("MOCK: Auth state initialized with mock user");
    setCurrentUser(mockUser);
    setUserProfile(mockProfile);
    setLoading(false);

    // Real Firebase implementation will look like:
    /*
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
    */
  }, []);

  const value = {
    currentUser,
    userProfile,
    loginWithGoogle,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
