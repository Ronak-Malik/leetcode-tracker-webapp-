import mongoose from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name?: string;
  leetcodeUsername: string;
  notifyMail: string;
  leetcodeStats?: {
    totalSolved: number;
    easy: number;
    medium: number;
    hard: number;
    ranking: number;
    streak: number;
    lastUpdated: Date;
    recentProblems: Array<{
      title: string;
      titleSlug: string;
      difficulty: string;
      solvedAt: Date;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: false,
    },
    leetcodeUsername: {
      type: String,
      required: [true, "LeetCode username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    notifyMail: {
      type: String,
      required: [true, "Notification email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    leetcodeStats: {
      type: {
        totalSolved: Number,
        easy: Number,
        medium: Number,
        hard: Number,
        ranking: Number,
        streak: Number,
        lastUpdated: Date,
        recentProblems: [{
          title: String,
          titleSlug: String,
          difficulty: String,
          solvedAt: Date,
        }],
      },
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);