import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MemberSchema, Team, User } from "../lib/types";

type InitialState = {
  teams: Team[];
  activeTeam: Team | null;
  checkedMember: MemberSchema | null;
};

const initialState: InitialState = {
  teams: [],
  activeTeam: null,
  checkedMember: null,
};

export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setCheckedMember: (state, action: PayloadAction<User | null>) => {
      state.checkedMember = action.payload;
    },
    updateMemberColor: (state, action: PayloadAction<string>) => {
      const member = state.activeTeam?.members.find(
        (member) => member.uid === state.checkedMember?.uid
      );

      if (!member || !state.checkedMember) return;
      member.color = action.payload;
      state.checkedMember.color = action.payload;
    },
    setActiveTeam: (state, action: PayloadAction<Team>) => {
      state.activeTeam = action.payload;
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
export const {
  addTeam,
  setActiveTeam,
  updateTeamSchedule,
  updateMemberColor,
  setCheckedMember,
} = teamSlice.actions;
