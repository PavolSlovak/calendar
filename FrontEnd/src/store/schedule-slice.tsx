import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MemberSchema, Team } from "../lib/types";

type InitialState = {
  teams: Team[];
  activeTeam: Team | null;
  checkedMember: MemberSchema | null;
};
const initialState: InitialState = {
  teams: [],
  activeTeam: null,
  checkedMember: null,
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setActiveTeam: (state, action: PayloadAction<Team>) => {
      state.activeTeam = action.payload;

      // Update the teams array with the new active team
      state.teams = state.teams.map((team) =>
        team.id === action.payload.id ? action.payload : team
      );
    },
    setCheckedMember: (state, action: PayloadAction<MemberSchema | null>) => {
      state.checkedMember = action.payload;
    },
  },
});
export const { setCheckedMember, setActiveTeam } = scheduleSlice.actions;
