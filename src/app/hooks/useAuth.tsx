"use client";

import { 
    createContext,
    useContext, 
    useState,
    useEffect
} from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    AuthError
} from "firebase/auth";
import { auth } from "../lib/firebaseConfig";

//只使用user的部分屬性值
export interface UserType {
  uid: string;
  email: string | null;
}

interface AuthContextType {
  user: UserType | null;
  register: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  register: async (email: string, password: string) => {
    return Promise.reject("註冊函式未執行!");
  },
  signIn: async (email: string, password: string) => {
    return Promise.reject("登入函式未執行!");
  },
  logOut: async () => {
    return Promise.reject("登出函式未執行!");
  },
});

export const AuthProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email
        })
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);  

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const err = error as AuthError;
      console.error("register error:", err.message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const err = error as AuthError;
      console.error("signIn error:", err.message);
      throw err;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      const err = error as AuthError;
      console.error("logOut error:", err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, signIn, logOut }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);