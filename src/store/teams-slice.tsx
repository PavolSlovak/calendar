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
    updateSchedule: (
      state,
      action: PayloadAction<{ teamId: string; memberId: string; day: string }>
    ) => {
      const team = state.teams.find(
        (team) => team.id === action.payload.teamId
      );
      if (!team) return;

      const updatedWeekSchedule = team.weekSchedule.map((weekDay) => {
        if (weekDay.day === action.payload.day) {
          const isMemberScheduled = weekDay.shifts.includes(
            action.payload.memberId
          );
          return {
            ...weekDay,
            shifts: isMemberScheduled
              ? weekDay.shifts.filter(
                  (shift) => shift !== action.payload.memberId
                )
              : [...weekDay.shifts, action.payload.memberId],
          };
        }
        return weekDay;
      });

      team.weekSchedule = updatedWeekSchedule;
    },
    addToSchedule: (
      state,
      action: PayloadAction<{
        teamId: string;
        memberId: string;
        day: string;
        startTime: string;
        endTime: string;
      }>
    ) => {
      const team = state.teams.find(
        (team) => team.id === action.payload.teamId
      );
      if (!team) return;

      const updatedWeekSchedule = team.weekSchedule.map((weekDay) => {
        if (weekDay.day === action.payload.day) {
          return {
            ...weekDay,
            shifts: [
              ...weekDay.shifts,
              {
                memberId: action.payload.memberId,
                startTime: "09:00",
                endTime: "17:00",
              },
            ],
          };
        }
        return weekDay;
      });

      team.weekSchedule = updatedWeekSchedule;
    },
  },
});
export const { addTeam, addToSchedule, updateSchedule } = teamSlice.actions;
