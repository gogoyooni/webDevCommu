// import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import prisma from "@/app/libs/prismadb";

export const authOptions: any = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      console.log("user:", user);
      console.log("account: ", account);

      if (account.provider === "google") {
        // const { name, email } = user;

        try {
          //   const userExists = await User.findOne({ email });
          const userExists = await prisma.user.findFirst({
            where: {
              email: user.email,
            },
          });

          if (!userExists) {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                image: user.image,
              }),
              cache: "no-store",
            });

            if (res.ok) {
              return user;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      return user;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
