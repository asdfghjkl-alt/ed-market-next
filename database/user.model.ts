import mongoose, { model, models } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: String,
    email: String,
    image: String,
    emailVerified: Boolean,
    role: String,
  },
  { collection: "user", timestamps: true },
);

// Avoid recompilation in hot-reload
const User = models.User || model<IUser>("User", UserSchema);

export default User;
