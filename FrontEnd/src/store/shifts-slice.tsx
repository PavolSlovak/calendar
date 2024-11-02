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
      endDate: new Date().toISOString().split("T")[0],
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
    setShifts: (state, action) => {
      state.shifts = action.payload;
    },
    setIsEndDateSet: (state, action) => {
      state.isEndDateSet = !state.isEndDateSet;
    },
    setEndDate: (state, action) => {
      state.shift.recurrence.endDate = action.payload;
    },
    setStartTime: (state, action) => {
      console.log("Start Time:", action.payload);
      state.shift.recurrence.startTime = action.payload;
    },
    setEndTime: (state, action) => {
      console.log("End Time:", action.payload);
      state.shift.recurrence.endTime = action.payload;
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
  setIsEndDateSet,
  setEndDate,
  setStartTime,
  setEndTime,
} = shiftSlice.actions;
