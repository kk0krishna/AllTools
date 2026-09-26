"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInAnonymously, signOut as firebaseSignOut, getRedirectResult, signInWithRedirect, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authError: null,
  signInWithGoogle: async () => {},
  signInAsGuest: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        const result = await getRedirectResult(auth);
        
        if (result?.user && mounted) {
          setUser(result.user);
        }
      } catch (error: any) {
        console.error("[Auth] Initialization/Redirect failed:", error);
        if (mounted) {
          setAuthError(error.message || "Failed to sign in.");
        }
      }
    };

    initializeAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!mounted) return;
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("[Auth] Google sign-in failed:", error);
      setAuthError(error.message || "Failed to initialize sign-in.");
    }
  };

  const signInAsGuest = async () => {
    try {
      setAuthError(null);
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error("Error signing in anonymously:", error);
      setAuthError(error.message || "Failed to sign in as guest.");
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, signInWithGoogle, signInAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
