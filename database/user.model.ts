import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    image: String,
    emailVerified: Boolean,
    role: String,
    createdAt: Date,
    updatedAt: Date,
  },
  { collection: "user" },
);

const User = mongoose.model("User", UserSchema);

export default User;
