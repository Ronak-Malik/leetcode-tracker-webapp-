import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/models/user.model";
import { signupSchema } from "@/src/schemas/authSchema";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: result.error.issues[0].message,
          errors: result.error.issues 
        },
        { status: 400 }
      );
    }

    const { email, password, name, leetcodeUsername, notifyMail } = result.data;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { leetcodeUsername: leetcodeUsername.toLowerCase() },
        { notifyMail: notifyMail.toLowerCase() }
      ]
    });

    if (existingUser) {
      let errorMessage = "";
      if (existingUser.email === email.toLowerCase()) {
        errorMessage = "Email already registered. Please login.";
      } else if (existingUser.leetcodeUsername === leetcodeUsername.toLowerCase()) {
        errorMessage = "LeetCode username already in use. Please choose another.";
      } else if (existingUser.notifyMail === notifyMail.toLowerCase()) {
        errorMessage = "Notification email already in use. Please use another.";
      }
      
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (all fields collected at signup)
    const user = await UserModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || email.split('@')[0],
      leetcodeUsername: leetcodeUsername.toLowerCase(),
      notifyMail: notifyMail.toLowerCase(),
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully! Please login.",
    });

  } catch (error: any) {
    console.error("Signup Error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Email, LeetCode username, or notification email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}