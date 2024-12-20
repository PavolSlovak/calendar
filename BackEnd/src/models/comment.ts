import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  memberID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  comment: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});
export const Comment = mongoose.model("Comment", commentSchema);
