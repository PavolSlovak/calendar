import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Team } from "@shared/schemas";
import { startOfToday } from "date-fns";

type InitialState = {
  activeTeam: Team | null;
  selectedDay: Date;
};
const initialState: InitialState = {
  activeTeam: null,
  selectedDay: startOfToday(),
};
export const calendarSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setActiveTeam: (state, action: PayloadAction<Team>) => {
      state.activeTeam = action.payload;

      console.log("activeTeam", state.activeTeam);
    },
    setSelectedDay: (state, action: PayloadAction<Date>) => {
      state.selectedDay = action.payload;
    },
  },
});
export const { setActiveTeam, setSelectedDay } = calendarSlice.actions;
