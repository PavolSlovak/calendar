import { createSlice } from "@reduxjs/toolkit";
import { Exception, Shift } from "@shared/schemas";

type InitialState = {
  shifts: Shift[];
  monthDays: number[];
  days: string[];
  exceptions: Exception[];
  frequency: string;
  startTime: string;
  endTime: string;
  isSubmitting: boolean;
  serverError: string | null;
  selectedShift: string | number | null;
};

const initialState: InitialState = {
  shifts: [],
  monthDays: [],
  days: [],
  exceptions: [],
  frequency: "weekly",
  startTime: "8:00",
  endTime: "17:00",
  isSubmitting: false,
  serverError: null,
  selectedShift: null,
};

export const shiftSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    setMonthDays: (state, action) => {
      state.monthDays = action.payload;
    },
    setDays: (state, action) => {
      state.days = action.payload;
    },
    setExceptions: (state, action) => {
      state.exceptions = action.payload;
    },
    setFrequency: (state, action) => {
      state.frequency = action.payload;
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
