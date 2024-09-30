import mongoose from "mongoose";
import "../models/team.js"; // import Team model so i can use it in isMember ref

// additional information for user saved in MongoDB bcs firebase auth only save email, uid, displayname, photoURL
const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});
const User = mongoose.model("User", userSchema);
export default User;
