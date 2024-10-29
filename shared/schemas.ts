import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters!"),
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
export const userAdditionalDataSchema = z.object({
  fcmToken: z.string(),
  role: z.enum(["admin", "user"]),
  timeStamp: z.date(),
});
const firebaseAuthUserSchema = z.object({
  uid: z.string(),
  email: z.string(),
  displayName: z.string(),
  photoURL: z.string(),
});

const combinedSchema = z.object({
  ...userAdditionalDataSchema.shape,
  ...firebaseAuthUserSchema.shape,
  color: z.string(),
});

// Define the exception schema
const exceptionSchema = z.object({
  date: z.date(),
  newStartTime: z.string().optional(),
  newEndTime: z.string().optional(),
  skip: z.boolean().optional(),
});

// Define the recurrence schema
const recurrenceSchema = z.object({
  frequency: z.enum(["weekly", "monthly"]),
  days: z
    .array(z.enum(["sun", "mon", "tue", "wed", "thu", "fri", "sat"]))
    .default([]),
  monthDays: z.array(z.number()).default([]),
  exceptions: z.array(exceptionSchema).default([]),
});

// Define the comment schema
const commentSchema = z.object({
  memberID: z.string(), // Change to z.string() as ObjectId is a string in TypeScript
  comment: z.string(),
  date: z.date().default(() => new Date()),
});

// Define the member schema
const memberSchema = z.object({
  memberID: z.string(), // Change to z.string() as ObjectId is a string in TypeScript
  firebaseID: z.string(),
  color: z.string(),
});

// Define the shift schema
const shiftSchema = z.object({
  memberID: z.string(), // Change to z.string() as ObjectId is a string in TypeScript
  startTime: z.string(),
  endTime: z.string(),
  date: z.date(),
  recurrence: recurrenceSchema.nullable().optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  comments: z.array(z.string()).optional(), // Use string array for comment IDs
});

// Define the team schema
const teamSchema = z.object({
  _id: z.string(), // Change to z.string() as ObjectId is a string in TypeScript
  teamName: z.string().min(1).max(100), // Adjust min/max according to your needs
  members: z.array(memberSchema).default([]),
  invitations: z.array(z.string()).default([]),
  createdBy: memberSchema,
  shifts: z.array(shiftSchema).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

const notificationSchema = z.object({
  id: z.string(),
  from: z.string(),
  notification: z.object({
    title: z.string(),
    body: z.string(),
  }),
  timestamp: z.date(),
  status: z.enum(["unread", "read"]),
});
const invitationSchema = z.object({
  id: z.string(),
  invitedByUserId: z.string(),
  status: z.enum(["pending", "accepted", "rejected"]),
  teamId: z.string(),
  timestamp: z.date(),
});
export const createTeamSchema = z.object({
  teamName: z.string().nonempty(),
  inviteMember: z.string().email().nullable().or(z.literal("")), // Accepts null or an empty string
});

export type UserAdditionalData = z.infer<typeof userAdditionalDataSchema>;
export type FirebaseAuthUser = z.infer<typeof firebaseAuthUserSchema>;
export type UserCombined = z.infer<typeof combinedSchema>;

export type Exception = z.infer<typeof exceptionSchema>;
export type Recurrence = z.infer<typeof recurrenceSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type Member = z.infer<typeof memberSchema>;
export type Shift = z.infer<typeof shiftSchema>;
export type Team = z.infer<typeof teamSchema>;

export type Notification = z.infer<typeof notificationSchema>;
export type Invitation = z.infer<typeof invitationSchema>;

export type TCreateTeam = z.infer<typeof createTeamSchema>;
