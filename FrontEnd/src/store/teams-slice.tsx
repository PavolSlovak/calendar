import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shift, Team } from "@shared/schemas";

type InitialState = {
  teams: Team[];
  isDeleteModalOpen: boolean;
};

const initialState: InitialState = {
  teams: [],
  isDeleteModalOpen: false,
};

export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },

    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },

    setIsDeleteModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isDeleteModalOpen = action.payload;
    },
  },
});
export const { setTeams, addTeam, setIsDeleteModalOpen } = teamSlice.actions;
