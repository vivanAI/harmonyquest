import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    backendUser?: {
      id: number;
      name?: string | null;
      email?: string | null;
      avatar?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    backendUser?: {
      id: number;
      name?: string | null;
      email?: string | null;
      avatar?: string | null;
    };
  }
}
