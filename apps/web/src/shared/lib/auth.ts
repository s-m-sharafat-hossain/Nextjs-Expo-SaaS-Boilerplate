// apps/web/src/shared/lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { db } from "./db";
import { Role, PlanType } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      role: Role;
      plan: PlanType;
      credits: number;
    };
  }
  interface User {
    id: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const existingUser = await db.user.findUnique({
        where: { email: user.email },
        include: { accounts: true },
      });

      if (existingUser) {
        if (account) {
          const accountExists = existingUser.accounts.some(
            (acc) => acc.provider === account.provider
          );

          if (accountExists) {
            await db.account.update({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              data: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state ? String(account.session_state) : null,
              },
            });
          } else {
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state ? String(account.session_state) : null,
              },
            });
          }
        }
        return true;
      }

      // Create new user
      const newUser = await db.user.create({
        data: {
          email: user.email,
          name: user.name || "User",
          image: user.image,
          role: Role.CONSUMER,
          plan: PlanType.FREE,
          credits: 25,
          referralCode: `REF-${Date.now()}`,
          emailVerified: new Date(),
        },
      });

      // Create account
      if (account) {
        await db.account.create({
          data: {
            userId: newUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state ? String(account.session_state) : null,
          },
        });
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        const dbUser = await db.user.findUnique({
          where: { id: token.sub },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
          session.user.plan = dbUser.plan;
          session.user.credits = dbUser.credits;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
