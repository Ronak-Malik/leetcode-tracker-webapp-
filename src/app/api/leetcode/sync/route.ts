import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/models/user.model";
import { verifyJWT } from "@/src/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await UserModel.findById(decoded.userId);

    if (!user || !user.leetcodeUsername) {
      return NextResponse.json(
        { success: false, message: "LeetCode username not found" },
        { status: 400 }
      );
    }

    // Fetch fresh stats from LeetCode
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; LeetOTracker/1.0)",
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                ranking
              }
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              submissionCalendar
            }
            recentAcSubmissionList(username: $username, limit: 20) {
              title
              titleSlug
              timestamp
            }
          }
        `,
        variables: {
          username: user.leetcodeUsername,
        },
      }),
    });

    const data = await response.json();
    const matchedUser = data?.data?.matchedUser;

    if (!matchedUser) {
      return NextResponse.json(
        { success: false, message: "LeetCode user not found" },
        { status: 404 }
      );
    }

    // Parse stats
    const stats = matchedUser.submitStats.acSubmissionNum;
    const totalSolved =
      stats.find((s: any) => s.difficulty === "All")?.count || 0;
    const easy = stats.find((s: any) => s.difficulty === "Easy")?.count || 0;
    const medium =
      stats.find((s: any) => s.difficulty === "Medium")?.count || 0;
    const hard = stats.find((s: any) => s.difficulty === "Hard")?.count || 0;

    // Calculate streak from calendar
    const calendarRaw = matchedUser.submissionCalendar;
    let currentStreak = 0;

    if (calendarRaw) {
      const calendar = JSON.parse(calendarRaw);
      const submissionDays = Object.keys(calendar)
        .map((timestamp) => parseInt(timestamp))
        .sort((a, b) => a - b);

      const today = Math.floor(Date.now() / 1000);
      const oneDay = 60 * 60 * 24;
      let expectedDay = Math.floor(today / oneDay) * oneDay;

      for (let i = submissionDays.length - 1; i >= 0; i--) {
        const day = Math.floor(submissionDays[i] / oneDay) * oneDay;
        if (day === expectedDay) {
          currentStreak++;
          expectedDay -= oneDay;
        } else if (day < expectedDay) {
          break;
        }
      }
    }

    // Get recent problems
    const recentProblems = (data?.data?.recentAcSubmissionList || []).map(
      (sub: any) => ({
        title: sub.title,
        titleSlug: sub.titleSlug,
        solvedAt: new Date(parseInt(sub.timestamp) * 1000),
      })
    );

    // Prepare stats object
    const leetcodeStats = {
      username: user.leetcodeUsername,
      totalSolved,
      easy,
      medium,
      hard,
      ranking: matchedUser.profile.ranking || 0,
      streak: currentStreak,
      lastUpdated: new Date(),
      recentProblems: recentProblems.slice(0, 10),
    };

    // Save to database
    await UserModel.findByIdAndUpdate(
  decoded.userId,
  { leetcodeStats },
  { returnDocument: 'after' }
);
    return NextResponse.json({
      success: true,
      data: {
        newProblemsCount: recentProblems.length,
        totalProblemsCount: totalSolved,
      },
    });
    
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, message: "Error syncing data. Please try again." },
      { status: 500 }
    );
  }
}