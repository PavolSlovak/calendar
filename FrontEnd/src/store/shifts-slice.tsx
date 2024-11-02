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
};

const initialState: InitialState = {
  shifts: [],
  shift: {
    memberID: "",
    teamID: "",
    startTime: "",
    endTime: "",
    date: null,
    status: "pending",
    recurrence: {
      frequency: "weekly",
      days: [],
      monthDays: [],
      startTime: "08:00",
      endTime: "17:00",
      exceptions: [],
    },
  },

  isSubmitting: false,
  serverError: null,
  selectedShift: null,
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
    setShifts: (state, action) => {
      state.shifts = action.payload;
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
  setShifts,
} = shiftSlice.actions;
