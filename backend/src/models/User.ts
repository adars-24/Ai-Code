import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(candidate: string): Promise<boolean>;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true, minlength: 6 }
  },
  { timestamps: true }
);

// ✅ FIXED middleware
UserSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// ✅ method
UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);