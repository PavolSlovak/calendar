import { configureStore } from "@reduxjs/toolkit";
import { teamSlice } from "./teams-slice";
import { scheduleSlice } from "./schedule-slice";
import { calendarSlice } from "./calendar-slice";

export const store = configureStore({
  reducer: {
    teams: teamSlice.reducer,
    schedule: scheduleSlice.reducer,
    calendar: calendarSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
