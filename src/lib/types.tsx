import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters!"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters!"),
});
export type TLoginSchema = z.infer<typeof loginSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters!")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type TUpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export type TFirebaseConfig = {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId: string | undefined;
};
export type SidebarProps = {
  teams: Team[];
  activeTeam: Team | null;
  onTeamSelect: (team: Team) => void;
};
// Define a Zod schema for user data
export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(), // Email can be null
  displayName: z.string().nullable(), // DisplayName can be null
  schedule: z.array(z.string()), // Schedule can be null
  photoURL: z.string().nullable(), // PhotoURL can be null
  colorStamp: z.string().nullable(), // ColorStamp can be null
});
export type User = z.infer<typeof UserSchema>;

export const Team = z.object({
  id: z.string(),
  teamName: z.string().min(3, "Team name must be at least 3 characters!"),
  invitations: z.array(z.string().email()),
  members: z.array(UserSchema),
  createdBy: UserSchema,
});
export type Team = z.infer<typeof Team>;
