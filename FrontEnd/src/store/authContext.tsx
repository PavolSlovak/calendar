import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { auth, messaging } from "../firebase/firebase";
import { User } from "../lib/types";
import { serializeUser } from "../utils/serializeUser";
import { onMessage } from "firebase/messaging";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import { saveMessagingDeviceToken } from "../firebase/messaging";
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

  async function signup(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;
    // If sign-up is successful, save the messaging device token
    await saveMessagingDeviceToken(uid);

    return userCredential;
  }

  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (!user) return;
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      saveMessagingDeviceToken(user.uid); // Save the FCM token to the user document in Firestore

      return token; // Return the token or user object as needed
    } catch (error) {
      console.error("Error logging in:", error);
      throw error; // Rethrow or handle the error as needed
    }
  }
  function logout() {
    auth.signOut();
    setCurrentUser(null); // Clear the user state
    localStorage.removeItem("token"); // Clear the token from local storage
    console.log("User logged out");
    return;
  }
  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }
  function updateEmail(email: string) {
    console.log("updateEmail", email);
    return (auth.currentUser as firebase.User)?.updateEmail(email);
  }

  function updatePassword(password: string) {
    return (auth.currentUser as firebase.User)?.updatePassword(password);
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
