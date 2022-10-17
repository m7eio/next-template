import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

import { User } from "@/model";
import dbConnect from "@/lib/connect-mongoose";

export const getAuthoOptions = (req: NextApiRequest): NextAuthOptions => {
  return {
    providers: [
      CredentialsProvider({
        name: "Ethereum",
        credentials: {
          message: {
            label: "Message",
            type: "text",
            placeholder: "0x0",
          },
          signature: {
            label: "Signature",
            type: "text",
            placeholder: "0x0",
          },
        },
        async authorize(credentials) {
          try {
            const siwe = new SiweMessage(
              JSON.parse(credentials?.message || "{}")
            );

            const nextAuthUrl =
              process.env.NEXTAUTH_URL ||
              (process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : process.env.NEXT_PUBLIC_HOST);
            if (!nextAuthUrl) {
              return null;
            }

            const nextAuthHost = new URL(nextAuthUrl).host;
            if (siwe.domain !== nextAuthHost) {
              return null;
            }

            if (siwe.nonce !== (await getCsrfToken({ req }))) {
              return null;
            }

            await siwe.validate(credentials?.signature || "");
            return {
              id: siwe.address,
            };
          } catch (e) {
            return null;
          }
        },
      }),
    ],
    session: {
      strategy: "jwt",
      // maxAge: 60 * 60 * 24 * 30 * 365,
    },
    secret: process.env.NEXTAUTH_SECRET,
    // jwt: {
    //   maxAge: 60 * 60 * 24 * 30 * 365,
    // },
    callbacks: {
      async session({ session, token }) {
        // @ts-ignore
        session.address = token.sub;
        await dbConnect();

        let user = await User.findOne({ address: token.sub });

        if (!user) {
          const userModel = new User({
            address: token.sub,
          });

          user = await userModel.save();
        }

        if (!session.user) {
          session.user = {};
        }
        session.user.name = user?.nickname;
        session.user.image = user?.avatar;
        session.user.email = user?.email;

        return session;
      },
    },
  };
};

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const isDefaultSigninPage =
    req.method === "GET" && (req.query.nextauth as string).includes("signin");

  const options = getAuthoOptions(req);
  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    options.providers.pop();
  }

  return await NextAuth(req, res, options);
};
