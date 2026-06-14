import axios, { isAxiosError } from "axios";
import { auth } from "@/auth";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 600000,
});

api.interceptors.request.use(
  async (config) => {
    let token: string | undefined;

    try {
      if (isServer) {
        const session = await auth();
        token = session?.user?.token;
      } else {
        const session = await getSession();
        token = session?.user?.token;
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error(
        "Failed to get session for axios interceptor:",
        error instanceof Error ? error.message : String(error),
      );
    }
    return config;
  },
  (error) => {
    if (error instanceof Error) {
      return Promise.reject(error);
    } else {
      return Promise.reject(new Error(String(error)));
    }
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 498) {
        if (typeof window !== "undefined") {
          document.cookie = "session_expired=1; path=/; max-age=10";
          await signOut({ redirect: false });
          window.location.href = "/login";
        } else {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          cookieStore.set("session_expired", "1", { path: "/" });
          redirect("/login");
        }
      } else if (error.response?.status === 403) {
        redirect("/error?code=403");
      } else if (error.response?.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        let message = "Too Many Requests. ";
        if (retryAfter) {
          message += ` Try again in ${retryAfter} seconds.`;
        }
        toast.warning(message);
      }
    } else {
      toast.error("An enexpected error occured.");
    }

    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);

export default api;
