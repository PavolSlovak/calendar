import { createSlice } from "@reduxjs/toolkit";
import { Shift } from "@shared/schemas";

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
  isSubmitting: boolean;
  serverError: string | null;
  selectedShift: string | number | null;
  isEndDateSet: boolean;
};

const initialState: InitialState = {
  shifts: [],
  shift: {
    memberID: "",
    teamID: "",
    startTime: "08:00",
    endTime: "17:00",
    date: new Date().toISOString(),
    status: "pending",
    recurrence: {
      frequency: "weekly",
      days: [],
      monthDays: [],
      endDate: null,
      exceptions: [],
    },
  },

  isSubmitting: false,
  serverError: null,
  selectedShift: null,
  isEndDateSet: false,
};

export const shiftSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    setMonthDays: (state, action) => {
      state.shift.recurrence.monthDays = action.payload;
    },
    setDays: (state, action) => {
      state.shift.recurrence.days = action.payload;
    },
    setExceptions: (state, action) => {
      state.shift.recurrence.exceptions = action.payload;
    },
    setFrequency: (state, action) => {
      state.shift.recurrence.frequency = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    setServerError: (state, action) => {
      state.serverError = action.payload;
    },
    setSelectedShift: (state, action) => {
      state.selectedShift = action.payload;
    },

    setEndDate: (state, action) => {
      state.shift.recurrence.endDate = action.payload;
    },
    setStartTime: (state, action) => {
      console.log("Start Time:", action.payload);
      state.shift.startTime = action.payload;
    },
    setEndTime: (state, action) => {
      console.log("End Time:", action.payload);
      state.shift.endTime = action.payload;
    },
    setUserAndTeam: (state, action) => {
      state.shift.memberID = action.payload.memberID;
      state.shift.teamID = action.payload.teamID;
    },
    resetForm: (state) => {
      state.shift = initialState.shift;
      state.shifts = initialState.shifts;
      state.isSubmitting = initialState.isSubmitting;
      state.serverError = initialState.serverError;
      state.selectedShift = initialState.selectedShift;
      state.isEndDateSet = initialState.isEndDateSet;
    },
    // Add a new reducer to add a shift to the state
    addShift: (state, action) => {
      state.shifts = [...state.shifts, action.payload];
    },
    setIsEndDateSet: (state, action) => {
      state.isEndDateSet = action.payload;
    },
  },
});
export const {
  setMonthDays,
  setDays,
  setExceptions,
  setFrequency,
  setIsSubmitting,
  setServerError,
  setSelectedShift,
  addShift,
  setEndDate,
  setStartTime,
  setEndTime,
  setUserAndTeam,
  resetForm,
  setIsEndDateSet,
} = shiftSlice.actions;
