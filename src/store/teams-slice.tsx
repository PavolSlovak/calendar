import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../dummy_users";

export type Team = {
  teamName: string;
  members: User[];
  createdBy: User;
};
const initialState = {
  teams: [] as Team[],
};

export const teamSlice = createSlice({
  name: "teams",
  initialState: initialState,

  reducers: {
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },
  },
});
export const { addTeam } = teamSlice.actions;
