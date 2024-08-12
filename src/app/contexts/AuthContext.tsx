'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  UserCredential,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  AuthError
} from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';


interface CustomUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: CustomUser | null;
  register: (email: string, password: string) => Promise<UserCredential>;
  signin: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType>({
  user: null,
  register: async (email: string, password: string) => {
    throw new Error('註冊函式未執行');
  },
  signin: async (email: string, password: string) => {
    throw new Error('登入函式未執行');
  },
  logout: async () => {
    throw new Error('登出函式未執行');
  },
});


export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);  


  const register = async (email: string, password: string) => {
    try {
      return createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const e = error as AuthError;
      throw new Error(e.message);
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      return signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const e = error as AuthError;
      throw new Error(e.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      const e = error as AuthError;
      throw new Error(e.message);
    }
  };


  return (
    <AuthContext.Provider value={{ user, register, signin, logout }}>
      {loading ? <div>加載中...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);