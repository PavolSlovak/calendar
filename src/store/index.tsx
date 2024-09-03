import { configureStore } from "@reduxjs/toolkit";
import { teamSlice } from "./teams-slice";
import { scheduleSlice } from "./schedule-slice";

export const store = configureStore({
  reducer: {
    teams: teamSlice.reducer,
    schedule: scheduleSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
