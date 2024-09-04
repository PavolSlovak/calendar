import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  activeTeam: string | null;
};
const initialState: InitialState = {
  activeTeam: null,
};

export const calendarSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setActiveTeam: (state, action: PayloadAction<string>) => {
      state.activeTeam = action.payload;
    },
  },
});
export const { setActiveTeam } = calendarSlice.actions;
