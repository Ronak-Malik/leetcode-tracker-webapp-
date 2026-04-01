import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/models/user.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        const user = await UserModel.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("Invalid login method");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        // Return user object with ALL fields
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email.split('@')[0],
          isProfileCompleted: user.isProfileCompleted || false,
          leetcodeUsername: user.leetcodeUsername || null,
          notifyMail: user.notifyMail || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // When user signs in for the first time, add all user data to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isProfileCompleted = user.isProfileCompleted;
        token.leetcodeUsername = user.leetcodeUsername;  // Note: lowercase l
        token.notifyMail = user.notifyMail;              // Note: lowercase n
      }
      return token;
    },
    async session({ session, token }) {
      // Add token data to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.isProfileCompleted = token.isProfileCompleted as boolean;
        session.user.leetcodeUsername = token.leetcodeUsername as string;  // Note: lowercase l
        session.user.notifyMail = token.notifyMail as string;              // Note: lowercase n
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};