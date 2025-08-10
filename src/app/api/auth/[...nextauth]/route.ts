import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import AppleProvider from "next-auth/providers/apple";

const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE || "http://localhost:8000";

// Build providers conditionally to avoid type errors when envs are missing
const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (
  process.env.AZURE_AD_CLIENT_ID &&
  process.env.AZURE_AD_CLIENT_SECRET &&
  (process.env.AZURE_AD_TENANT_ID || "common")
) {
  providers.push(
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
    })
  );
}

if (
  process.env.APPLE_CLIENT_ID &&
  process.env.APPLE_TEAM_ID &&
  process.env.APPLE_KEY_ID &&
  process.env.APPLE_PRIVATE_KEY
) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: {
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: (process.env.APPLE_PRIVATE_KEY as string).split("\\n").join("\n"),
        keyId: process.env.APPLE_KEY_ID,
      } as any, // Only constructed when all envs exist
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
