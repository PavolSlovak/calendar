import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MemberSchema, Team, User } from "../lib/types";

type InitialState = {
  teams: Team[];
};

const initialState: InitialState = {
  teams: [],
};

export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    updateTeam: (state, action: PayloadAction<Team>) => {
      const team = state.teams.find((team) => team.id === action.payload.id);
      if (!team) return;
    },

    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },
    updateTeamSchedule: (
      state,
      action: PayloadAction<{ teamId: string; memberId: string; day: string }>
    ) => {
      const team = state.teams.find(
        (team) => team.id === action.payload.teamId
      );
      if (!team) return;
      console.log("team", team);

      team.weekSchedule.map((weekDay) => {
        const { day, shifts } = weekDay;
        if (day === action.payload.day) {
          if (shifts.includes(action.payload.memberId)) {
            weekDay.shifts = shifts.filter(
              (shift) => shift !== action.payload.memberId
            );
          } else {
            weekDay.shifts.push(action.payload.memberId);
          }
        }
      });
    },
  },
});
export const { addTeam, updateTeamSchedule } = teamSlice.actions;
