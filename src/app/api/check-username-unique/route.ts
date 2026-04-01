import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/models/user.model";
import { usernameValidation } from "@/src/schemas/profileSchema";
import z from "zod";

const usernameQuerySchema = z.object({
  leetcodeUsername: usernameValidation
});

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const queryParams = {
      leetcodeUsername: searchParams.get('leetcodeUsername'),
    };

    const result = usernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().leetcodeUsername?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message: usernameErrors?.length > 0
            ? usernameErrors.join(', ')
            : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    const { leetcodeUsername } = result.data;

    const existingUser = await UserModel.findOne({
      leetcodeUsername: leetcodeUsername.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'LeetCode username is already taken',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'LeetCode username is available',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}