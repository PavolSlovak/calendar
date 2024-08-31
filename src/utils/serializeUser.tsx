import { User } from "../lib/types";

export function serializeUser(currentUser: User) {
  if (!currentUser) {
    return {
      uid: "",
      email: "",
      displayName: "",
      photoURL: "",
    };
  }
  return {
    uid: currentUser?.uid || "",
    email: currentUser?.email || "",
    displayName: currentUser?.displayName || "",
    photoURL: currentUser?.photoURL || "",
  };
}
