import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MemberSchema, Team } from "../lib/types";

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

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setActiveTeam: (state, action: PayloadAction<Team>) => {
      state.activeTeam = action.payload;
    },
    setCheckedMember: (state, action: PayloadAction<MemberSchema | null>) => {
      state.checkedMember = action.payload;
    },
    updateMemberColor: (
      state,
      action: PayloadAction<{ memberId: string; color: string }>
    ) => {
      if (state.activeTeam) {
        const memberToUpdate = state.activeTeam.members.find(
          (member) => member.uid === action.payload.memberId
        );
        if (memberToUpdate) {
          memberToUpdate.color = action.payload.color;
        }
        // Update the teams array with the updated activeTeam
        const teamIndex = state.teams.findIndex(
          (team) => team.id === state.activeTeam!.id
        );
        if (teamIndex !== -1) {
          state.teams[teamIndex] = state.activeTeam!;
        }
      }
    },
  },
});
export const { setCheckedMember, updateMemberColor } = scheduleSlice.actions;
