import { configureStore } from "@reduxjs/toolkit";
import { teamSlice } from "./teams-slice";
import { calendarSlice } from "./calendar-slice";
import { shiftSlice } from "./shifts-slice";

export const store = configureStore({
  reducer: {
    teams: teamSlice.reducer,
    calendar: calendarSlice.reducer,
    shifts: shiftSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
