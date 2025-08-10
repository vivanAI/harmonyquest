import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE || "http://192.168.18.4:8000";

// Only Google provider for now
const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Upsert OAuth user in backend to obtain backend JWT
      try {
        const res = await fetch(`${backendBase}/users/oauth_upsert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            avatar: (user as any).image,
          }),
        });
        if (!res.ok) {
          console.error("oauth_upsert failed:", await res.text());
          return false;
        }
        const data = await res.json();
        // Attach to account for jwt callback via account
        (account as any).backendToken = data.access_token;
        (account as any).backendUser = data.user;
        return true;
      } catch (e) {
        console.error("oauth_upsert error:", e);
        return false;
      }
    },
    async jwt({ token, account }) {
      if (account && (account as any).backendToken) {
        token.backendToken = (account as any).backendToken;
        token.backendUser = (account as any).backendUser;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).backendToken = (token as any).backendToken;
      (session as any).backendUser = (token as any).backendUser;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
