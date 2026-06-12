import { DefaultSession } from "next-auth";

// Permission interface used in session
export interface ISessionPermission {
  uuid: string;
  name: string;
  route: string;
  method: string[];
}

// Extend the default NextAuth types with custom fields
declare module "next-auth" {
  interface User {
    uuid?: string;
    username?: string;
    token?: string;
    permission?: ISessionPermission[];
    role_id?: string;
    role_name?: string;
    menus?: string[];
    avatar?: string | null;
    business_name?: string | null;
    business_type?: string | null;
  }

  interface Session {
    user: {
      uuid?: string;
      username?: string;
      token?: string;
      permission?: ISessionPermission[];
      role_id?: string;
      role_name?: string;
      menus?: string[];
      avatar?: string | null;
      business_name?: string | null;
      business_type?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uuid?: string;
    username?: string;
    token?: string;
    permission?: ISessionPermission[];
    role_id?: string;
    role_name?: string;
    menus?: string[];
    avatar?: string | null;
    business_name?: string | null;
    business_type?: string | null;
  }
}
