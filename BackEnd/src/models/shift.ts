import mongoose from "mongoose";
import "./comment.js";

const exceptionSchema = new mongoose.Schema({
  date: String,
  newStartTime: String, // Optional: new start time for this date
  newEndTime: String, // Optional: new end time for this date
  skip: Boolean,
});

const recurrenceSchema = new mongoose.Schema({
  frequency: {
    type: String,
    enum: ["weekly", "monthly"],
    required: true,
  },
  days: {
    type: [String], // For weekly recurrence, e.g., ["mon", "wed", "fri"]
    enum: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
    default: [],
  },
  monthDays: {
    type: [Number], // For monthly recurrence, e.g., [5, 15, 30] (representing days of the month)
    default: [],
  },

  exceptions: {
    type: [exceptionSchema],
    default: [],
  },
});

const shiftSchema = new mongoose.Schema({
  memberID: { type: String, required: true },
  teamID: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  date: {
    type: String, // For single, non-recurring shifts
    default: null,
  },
  recurrence: {
    // make sure if date is present, recurrence is null
    type: recurrenceSchema,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});
export const Shift = mongoose.model("Shift", shiftSchema);
