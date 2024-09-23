import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../firebase";
import { User } from "../lib/types";
import { serializeUser } from "../utils/serializeUser";
type AuthState = {
  currentUser: User | null;
};

type AuthContextType = AuthState & {
  signup: (email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  resetPassword: (email: string) => void;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // firebase auth state change listener to update the current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const serializedUser = serializeUser(user as User); // firebase User object has additional properties that we don't need in our app (would cause issues when serializing errors)
      setCurrentUser(serializedUser);
      setLoading(false);
    });

    // firebase ID token listener to detect token expiration or changes
    const unsubscribeFromIdToken = auth.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("token", token); // Update token in local storage
        console.log("Token refreshed or changed:", token);
      } else {
        // User is signed out or token expired, clear the token and handle logout
        localStorage.removeItem("token");
        setCurrentUser(null); // Optionally, you can log out the user here
        console.log("Token expired or user logged out");
      }
    });

    return () => {
      unsubscribe();
      unsubscribeFromIdToken();
    };
  }, []);

  function signup(email: string, password: string) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  async function login(email: string, password: string) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      if (!user) return;
      // Get the ID token
      const token = await user.getIdToken();
      // Store the token in local storage
      localStorage.setItem("token", token);
      // Show or return the token
      console.log("Token:", token);
      return token;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error; // Rethrow or handle the error as needed
    }
  }
  function logout() {
    return auth.signOut();
  }
  function resetPassword(email: string) {
    return auth.sendPasswordResetEmail(email);
  }
  function updateEmail(email: string) {
    console.log("updateEmail", email);
    return auth.currentUser?.updateEmail(email);
  }

  function updatePassword(password: string) {
    return auth.currentUser?.updatePassword(password);
  }

  const ctxValue: AuthContextType = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };
  return (
    <AuthContext.Provider value={ctxValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
