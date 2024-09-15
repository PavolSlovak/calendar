import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shifts, Team, WeekSchema } from "../lib/types";

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
    updateTeam: (state, action: PayloadAction<Team>) => {
      const team = state.teams.find((team) => team.id === action.payload.id);
      if (!team) return;
    },

    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },

    updateSchedule: (state, action: PayloadAction<UpdateScheduleProps>) => {
      const team = state.teams.find(
        (team) => team.id === action.payload.teamId
      );
      if (!team) return;

      const updatedWeekSchedule: WeekSchema = team.weekSchedule.map(
        (weekDay) => {
          if (weekDay.day === action.payload.day) {
            return {
              ...weekDay,
              shifts: weekDay.shifts.map((shift) =>
                shift.memberId === action.payload.memberId
                  ? {
                      ...shift,
                      startTime: action.payload.startTime,
                      endTime: action.payload.endTime,
                    }
                  : shift
              ),
            };
          }
          return weekDay;
        }
      );
      team.weekSchedule = updatedWeekSchedule;
    },
    addToSchedule: (state, action: PayloadAction<UpdateScheduleProps>) => {
      const team = state.teams.find(
        (team) => team.id === action.payload.teamId
      );
      if (!team) return;

      const updatedWeekSchedule: WeekSchema = team.weekSchedule.map(
        (weekDay) => {
          if (weekDay.day === action.payload.day) {
            const isMemberScheduled = weekDay.shifts.find(
              (shift) => shift.memberId === action.payload.memberId
            );
            return {
              ...weekDay,

              shifts: isMemberScheduled
                ? weekDay.shifts.filter(
                    (shift) => shift.memberId !== action.payload.memberId
                  )
                : [
                    ...weekDay.shifts,
                    {
                      memberId: action.payload.memberId,
                      startTime: action.payload.startTime,
                      endTime: action.payload.endTime,
                    },
                  ],
            };
          }
          return weekDay;
        }
      );

      team.weekSchedule = updatedWeekSchedule;
    },
    /*     addToSchedule: (state, action: PayloadAction<UpdateScheduleProps>) => {
      const team = state.teams.find(
        (team) => team.id === action.payload.teamId
      );
      if (!team) return;

      const updatedWeekSchedule = team.weekSchedule.map((weekDay) => {
        if (weekDay.day === action.payload.day) {
          const isMemberScheduled = weekDay.shifts.find(
            (shift) => shift.memberId === action.payload.memberId
          );
          return {
            ...weekDay,

            shifts: isMemberScheduled
              ? weekDay.shifts.filter(
                  (shift) => shift.memberId !== action.payload.memberId
                )
              : [
                  ...weekDay.shifts,
                  {
                    memberId: action.payload.memberId,
                    startTime: action.payload.startTime,
                    endTime: action.payload.endTime,
                  },
                ],
          };
        }
        return weekDay;
      });

      team.weekSchedule = updatedWeekSchedule;
    }, */
  },
});
export const { addTeam, addToSchedule, updateSchedule } = teamSlice.actions;
