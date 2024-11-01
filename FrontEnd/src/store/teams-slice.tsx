import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shift, Team } from "@shared/schemas";

type InitialState = {
  teams: Team[];
};

const initialState: InitialState = {
  teams: [],
};
type UpdateScheduleProps = {
  teamId: string;
  memberId: string;
  day: string;
  startTime: string;
  endTime: string;
};
export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },

    updateTeam: (state, action: PayloadAction<Team>) => {
      const team = state.teams.find((team) => team._id === action.payload._id);
      if (!team) return;
    },

    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },

    updateSchedule: (state, action: PayloadAction<UpdateScheduleProps>) => {
      const team = state.teams.find(
        (team) => team._id === action.payload.teamId
      );
      if (!team) return;

      // TODO: Implement update schedule
    },
    addToSchedule: (state, action: PayloadAction<UpdateScheduleProps>) => {
      const team = state.teams.find(
        (team) => team._id === action.payload.teamId
      );
      if (!team) return;

      // TODO: Implement add to schedule
      console.log("Add to schedule", action.payload);
    },
  },
});
export const { setTeams, addTeam, addToSchedule, updateSchedule } =
  teamSlice.actions;
