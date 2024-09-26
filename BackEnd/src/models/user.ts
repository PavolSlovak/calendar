import mongoose from "mongoose";
import "../models/team.js"; // import Team model so i can use it in isMember ref

// additional information for user saved in MongoDB bcs firebase auth only save email, uid, displayname, photoURL
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  isMember: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  colorStamp: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);
export default User;
