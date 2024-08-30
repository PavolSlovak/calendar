import { User as FirebaseUser } from "firebase/auth";
import { z } from "zod";

const users: FirebaseUser[] = [
  {
    uid: "1",
    email: "PavolSlovak@gmail.com",
    displayName: "Pavol Slovak",
    photoURL: "https://randomuser.me",
  },
  {
    uid: "2",
    email: "johndoe@gmail.com",
    displayName: "John Doe",
    photoURL: "https://randomuser.me",
  },
  {
    uid: "3",
    email: "peterparker@gmail.com",
    displayName: "Peter Parker",
    photoURL: "https://randomuser.me",
  },
  {
    uid: "4",
    email: "jane@gmail.com",
    displayName: "Jane Peterson",
    photoURL: "https://randomuser.me",
  },

  // ... other users
];
export default users;
