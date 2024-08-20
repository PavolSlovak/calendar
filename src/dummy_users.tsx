import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  profilePicture: z.string(),
  hashedPassword: z.string(),
  role: z.enum(["Admin", "Editor", "User"]),
});
export type User = z.infer<typeof userSchema>;

const users: User[] = [
  {
    id: 1,
    username: "John Doe",
    email: "johndoe@gmail.com",
    profilePicture: "https://randomuser.me",
    role: "Admin",
    hashedPassword: "eroijnberhbjernjvrnvijnvibihbvihvihvvr",
  },
  {
    id: 2,
    username: "Pavol Slovak",
    email: "PavolSlovak@gmail.com",
    profilePicture: "https://randomuser.me",
    role: "Editor",
    hashedPassword: "eroijnberhbjernjvrnvijnvibihbvihvihvvr",
  },
  // ... other users
];
export default users;
