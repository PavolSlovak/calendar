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

// Define a Zod schema for user data
export const UserSchema = z.object({
  firebaseUID: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().url(),
  role: z.string(),
});
export type User = z.infer<typeof UserSchema>;

const MemberSchema = UserSchema.extend({ color: z.string() });

export type MemberSchema = z.infer<typeof MemberSchema>;

const ShiftsArraySchema = z.array(
  z.object({
    memberId: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  })
);

export type Shifts = z.infer<typeof ShiftsArraySchema>;

const wScheduleSchema = z.array(
  z.object({
    day: z.string(),
    shifts: ShiftsArraySchema,
  })
);

export type WeekSchema = z.infer<typeof wScheduleSchema>;

export const Team = z.object({
  id: z.string(),
  teamName: z.string().min(3, "Team name must be at least 3 characters!"),
  invitations: z.array(z.string().email()),
  members: z.array(
    z.object({
      memberID: z.string(),
      firebaseUID: z.string(),
      color: z.string(),
    })
  ),
  createdBy: z.string(),
  weekSchedule: wScheduleSchema, // Array of objects with day and shifts
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Team = z.infer<typeof Team>;
