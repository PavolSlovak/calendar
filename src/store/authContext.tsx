import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { User as FirebaseUser } from "firebase/auth";

type AuthState = {
  currentUser: FirebaseUser | null;
};
type AuthContextType = AuthState & {
  signup: ({ email, password }: AuthProps) => void;
  login: ({ email, password }: AuthProps) => void;
  logout: () => void;
};
type AuthProps = {
  email: string;
  password: string;
};
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    // firebase auth state change listener to update the current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  function signup({ email, password }: AuthProps) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login({ email, password }: AuthProps) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logout() {}
  const ctxValue: AuthContextType = {
    currentUser,
    signup,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
}
