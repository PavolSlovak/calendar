import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../firebase";
import { User as FirebaseUser } from "firebase/auth";
type AuthState = {
  currentUser: FirebaseUser | null;
};
type AuthContextType = AuthState & {
  signup: (email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  resetPassword: (email: string) => void;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // firebase auth state change listener to update the current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user as FirebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  function signup(email: string, password: string) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password);
  }
  function logout() {
    return auth.signOut();
  }
  function resetPassword(email: string) {
    return auth.sendPasswordResetEmail(email);
  }
  const ctxValue: AuthContextType = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
  };
  return (
    <AuthContext.Provider value={ctxValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
