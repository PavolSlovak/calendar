import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase.js";
// Name of receipt collection in Firestore
const USER_COLLECTION = "users";

/* 
  Adds user to Firestore with given user information:
  - uid: user ID
  - role: user role (admin or user)
  */
type TAddUser = {
  uid: string;
  role: "admin" | "user";
};

export function addUser({ uid, role }: TAddUser) {
  addDoc(collection(db, USER_COLLECTION), {
    uid,
    role,
  });
}
export function getUser(uid: string) {
  const user = query(collection(db, USER_COLLECTION), where("uid", "==", uid));
  return user;
}
export function deleteUser(uid: string) {
  deleteDoc(doc(db, USER_COLLECTION, uid));
}
