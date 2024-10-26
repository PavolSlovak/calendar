import { configureStore } from "@reduxjs/toolkit";
import { teamSlice } from "./teams-slice";
import { calendarSlice } from "./calendar-slice";

export const store = configureStore({
  reducer: {
    teams: teamSlice.reducer,
    calendar: calendarSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
