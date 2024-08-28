import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

// Define a Zod schema for user data
export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(), // Email can be null
  displayName: z.string().nullable(), // DisplayName can be null
  photoURL: z.string().nullable(), // PhotoURL can be null
});
export const Team = z.object({
  id: z.string(),
  teamName: z.string().min(3, "Team name must be at least 3 characters!"),
  invitations: z.array(z.string().email()),
  members: z.array(UserSchema),
  createdBy: UserSchema,
});
export type Team = z.infer<typeof Team>;

type InitialState = {
  teams: Team[];
};

const initialState: InitialState = {
  teams: [],
};

export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },
  },
});
export const { addTeam } = teamSlice.actions;
