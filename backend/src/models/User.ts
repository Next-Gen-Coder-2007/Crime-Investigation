import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "investigator" | "viewer";
export type UserStatus = "active" | "suspended" | "pending";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  badgeNumber: string;
  role: UserRole;
  department: string;
  avatar?: string;
  status: UserStatus;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    badgeNumber: {
      type: String,
      required: [true, "Badge number is required"],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "investigator", "viewer"],
      default: "investigator",
    },
    department: {
      type: String,
      default: "Forensics & Intelligence Unit",
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
