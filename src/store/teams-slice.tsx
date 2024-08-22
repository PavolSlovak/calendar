import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSchema } from "../components/Teams/CreateTeamForms/CreateTeam";
import { z } from "zod";

export const Team = z.object({
  teamName: z.string().min(3, "Team name must be at least 3 characters!"),
  members: z.array(z.string().email()),
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
