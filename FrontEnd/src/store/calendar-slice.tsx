import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Team } from "../lib/types";

type InitialState = {
  activeTeam: Team | null;
};
const initialState: InitialState = {
  activeTeam: null,
};
export const calendarSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setActiveTeam: (state, action: PayloadAction<Team>) => {
      state.activeTeam = action.payload;

      console.log("activeTeam", state.activeTeam);
    },
  },
});
export const { setActiveTeam } = calendarSlice.actions;
