import mongoose from "mongoose";
// additional information for user saved in MongoDB bcs firebase auth only save email, uid, displayname, photoURL
const userSchema = new mongoose.Schema({
  uid: String,
  isMember: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);
export default User;
