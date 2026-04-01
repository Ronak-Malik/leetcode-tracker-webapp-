import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isProfileCompleted: boolean;
      leetcodeUsername: string;  // Note: lowercase l
      notifyMail: string;        // Note: lowercase n
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    isProfileCompleted: boolean;
    leetcodeUsername: string;    // Note: lowercase l
    notifyMail: string;          // Note: lowercase n
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    isProfileCompleted: boolean;
    leetcodeUsername: string;    // Note: lowercase l
    notifyMail: string;          // Note: lowercase n
  }
}