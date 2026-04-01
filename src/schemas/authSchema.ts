import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
  name: z.string().optional(),
  leetcodeUsername: z.string()
    .min(1, "LeetCode username is required")
    .max(50, "LeetCode username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "LeetCode username can only contain letters, numbers, and underscores"),
  notifyMail: z.string()
    .email("Invalid notification email address"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  leetcodeUsername: z.string()
    .min(1, "LeetCode username is required")
    .max(50, "LeetCode username is too long"),
  notifyMail: z.string()
    .email("Invalid notification email address"),
});