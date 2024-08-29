import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Team } from "../lib/types";

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
