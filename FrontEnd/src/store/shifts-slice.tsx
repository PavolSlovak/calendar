import { createSlice } from "@reduxjs/toolkit";
import { Exception, Shift } from "@shared/schemas";

export enum DaysOfWeek {
  sun = "sun",
  mon = "mon",
  tue = "tue",
  wed = "wed",
  thu = "thu",
  fri = "fri",
  sat = "sat",
}

type InitialState = {
  shifts: Shift[];
  shift: Shift;
  isEndDateSet: boolean;
  isExceptionSet: boolean;
};

const initialState: InitialState = {
  shifts: [],
  shift: {
    memberID: "",
    teamID: "",
    startTime: "08:00",
    endTime: "17:00",
    date: null,
    status: "pending",
    recurrence: {
      frequency: "weekly",
      days: [],
      monthDays: [],
      endDate: null,
      exceptions: [],
    },
  },

  isEndDateSet: false,
  isExceptionSet: false,
};

export const shiftSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    setUserAndTeam: (state, action) => {
      state.shift.memberID = action.payload.memberID;
      state.shift.teamID = action.payload.teamID;
    },

    // Add a new reducer to add a shift to the state
    addShift: (state, action) => {
      state.shifts = [...state.shifts, action.payload];
    },
    setIsEndDateSet: (state, action) => {
      state.isEndDateSet = action.payload;
    },
    setIsExceptionSet: (state, action) => {
      state.isExceptionSet = action.payload;
    },
  },
});
export const {
  addShift,
  setUserAndTeam,
  setIsEndDateSet,
  setIsExceptionSet,
  // Exceptions section
} = shiftSlice.actions;
