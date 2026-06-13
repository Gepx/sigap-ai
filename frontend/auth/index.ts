import { ISessionPermission } from "@/app/types/next.auth";
import NextAuth, { NextAuthConfig, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { InvalidCredentialsError, InvalidUserError, UnverifiedEmailError } from "./error";

export const BASE_PATH = "/api/auth";

const authOptions: NextAuthConfig = {
  trustHost: true,
  jwt: {
    maxAge: 60 * 60,
  },
  session: {
    maxAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          type: "string",
          label: "Email",
          placeholder: "[EMAIL_ADDRESS]",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },

      async authorize(credentials): Promise<User | null> {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        );

        if (res.status === 401) {
          throw new InvalidCredentialsError();
        }
        if (res.status === 403) {
          throw new UnverifiedEmailError();
        }
        if (res.status === 404) {
          throw new InvalidUserError();
        }
        if (!res.ok) {
          throw new Error("An error occurred while signing in");
        }

        const data = (await res.json()) as {
          data: {
            uuid: string;
            email: string;
            name: string;
            role_name: string;
            role_id: string;
            avatar?: string | null;
            token: string;
            // permission: ISessionPermission[];
            // menus: string[];
          };
        };

        if (!data || !data.data) {
          throw new Error("Invalid credentials");
        }

        return {
          uuid: data.data.uuid,
          email: data.data.email,
          name: data.data.name,
          token: data.data.token,
          // permission: data.data.permission,
          role_id: data.data.role_id,
          role_name: data.data.role_name,
          // menus: data.data.menus,
          avatar: data.data.avatar,
        };
      },
    }),
  ],

  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.uuid = user.uuid;
        token.role_id = user.role_id;
        token.role_name = user.role_name;
        token.email = user.email;
        token.token = user.token;
        token.permission = user.permission;
        token.menus = user.menus;
        token.avatar = user.avatar;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.avatar !== undefined) token.avatar = session.avatar;
      }
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.uuid = token.uuid;
        session.user.role_id = token.role_id;
        session.user.role_name = token.role_name;
        session.user.email = token.email;
        session.user.token = token.token;
        session.user.permission = token.permission;
        session.user.menus = token.menus;
        session.user.avatar = token.avatar;
        if (token.name) session.user.name = token.name;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
