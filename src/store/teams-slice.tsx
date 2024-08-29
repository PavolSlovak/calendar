import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Team } from "../lib/types";

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
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },
    updateMemberSchedule: (
      state,
      action: PayloadAction<{ teamId: string; memberId: string; day: string }>
    ) => {
      const team = state.teams.find(
        (team) => team.id === action.payload.teamId
      );
      if (!team) return console.log("Team not found");

      const updatedMembers = team.members.map((member) => {
        if (member.uid === action.payload.memberId) {
          if (member.schedule.includes(action.payload.day)) {
            return {
              ...member,
              schedule: member.schedule.filter(
                (shift) => shift !== action.payload.day
              ),
            };
          }
          return {
            ...member,
            schedule: [...member.schedule, action.payload.day],
          };
        }
        return member;
      });

      team.members = updatedMembers;
    },
  },
});
export const { addTeam } = teamSlice.actions;
