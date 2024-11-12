import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { auth } from "../firebase/firebase";
import { FirebaseAuthUser, UserAdditionalData } from "@shared/schemas";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import { getMessagingDeviceToken } from "../firebase/messaging";
import { addUser, sendNotif, updateUserFCM } from "../utils/http-firestore";
import { th, tr } from "date-fns/locale";
import { getErrorMessage } from "./hooks/getErrorMessage";
import { deleteUser } from "../utils/http-FS_users";

type AuthState = {
  currentUser: FirebaseAuthUser | null;
};

type AuthContextType = AuthState & {
  signup: (email: string, password: string, username: string) => void;
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
  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // firebase auth state change listener to update the current user
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser({
        uid: user?.uid || "",
        email: user?.email || "",
        displayName: user?.displayName || "",
        photoURL: user?.photoURL || "",
      });

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

  async function signup(email: string, password: string, username: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      // Set the display name for the newly created user
      if (!user) throw new Error("User creation failed");
      const fcmToken = await getMessagingDeviceToken(user.uid);
      if (!fcmToken) throw new Error("Failed to retrieve FCM token");

      await Promise.all([
        handleAddUser(fcmToken),
        updateUserDisplayName(username),
        await handleSendNotif(
          user.uid,
          "Success",
          "User signed up successfully"
        ),
      ]);
      return userCredential;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Error signing up:", message);
      // Delete the Firebase user if the user creation fails
      if (auth.currentUser) {
        await handleDeleteUser(auth.currentUser.uid);
      }
      throw new Error("Signup failed, please try again.");
    }
  }
  async function handleAddUser(fcmToken: string) {
    try {
      await addUser(fcmToken);
      console.log("User added to Firestore");
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
      throw new Error("Failed to save user information.");
    }
  }
  async function handleDeleteUser(uid: string) {
    try {
      await deleteUser(uid);
      console.log("User deleted");
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Error deleting user:", message);
      throw new Error(`Failed to delete user: ${message}`);
    }
  }
  async function handleSendNotif(to: string, title: string, body: string) {
    try {
      await sendNotif(to, title, body);
      console.log("Notification sent");
    } catch (error) {
      console.error("Error sending notification:", error);
      throw new Error("Failed to send notification.");
    }
  }
  async function updateUserDisplayName(displayName: string) {
    try {
      const user = auth.currentUser;
      if (!user) return;
      await updateProfile(user, {
        displayName,
      });
      setCurrentUser((prev) => (prev ? { ...prev, displayName } : null)); // Update the user state since onAuthStateChanged only triggers when the user logs in or out
      console.log("User display name updated: ", displayName);
    } catch (error) {
      console.error("Error updating user display name:", error);
      throw new Error("Failed to update user display name.");
    }
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (!user) return;
    const token = await user.getIdToken();
    localStorage.setItem("token", token);

    const fcmToken = await getMessagingDeviceToken(user.uid); // Get the FCM token for the user
    console.log("fcmToken", fcmToken);
    if (fcmToken) {
      await updateUserFCM(fcmToken); // Update the FCM token in Firestore
    } else {
      throw new Error("FCM token not found");
    }
    console.log("User id", user.uid);
    await sendNotif(user.uid, "Success", "User logged in successfully");
    return userCredential;
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
