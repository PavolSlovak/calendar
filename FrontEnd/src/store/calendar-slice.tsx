import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FirebaseAuthUser,
  Team,
  UserAdditionalData,
  UserCombined,
} from "@shared/schemas";
import { startOfToday } from "date-fns";

type InitialState = {
  activeTeam: Team | null;
  activeMembers: UserCombined[];
  selectedDay: string;
};
const initialState: InitialState = {
  activeTeam: null,
  activeMembers: [],
  selectedDay: startOfToday().toISOString(),
};
export const calendarSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setActiveTeam: (state, action: PayloadAction<Team>) => {
      state.activeTeam = action.payload;

      console.log("activeTeam", state.activeTeam);
    },
    setActiveMembers: (state, action: PayloadAction<UserCombined[]>) => {
      state.activeMembers = action.payload;
    },
    setSelectedDay: (state, action: PayloadAction<string>) => {
      state.selectedDay = action.payload;
    },
  },
});
export const { setActiveTeam, setSelectedDay, setActiveMembers } =
  calendarSlice.actions;
