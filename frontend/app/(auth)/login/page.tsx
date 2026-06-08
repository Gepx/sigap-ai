import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#F4F9F6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,176,116,0.18),transparent_28%),linear-gradient(180deg,#F4F9F6_0%,#FBFFFC_60%,#ECF5F0_100%)]" />
      <div className="absolute left-[8%] top-[15%] size-72 rounded-full bg-[#00B074]/12 blur-3xl animate-pulse" />
      <div className="absolute right-[10%] bottom-[12%] size-[30rem] rounded-full bg-[#1A2E26]/8 blur-3xl animate-pulse [animation-delay:1.2s]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00B074]/35 to-transparent" />
      <div className="absolute left-[12%] top-[24%] size-4 rounded-full bg-[#00B074]/35 blur-[1px] animate-ping" />
      <div className="absolute right-[20%] top-[30%] size-3 rounded-full bg-[#F2C94C]/45 blur-[1px] animate-ping [animation-delay:0.8s]" />

      <div className="relative w-full max-w-xl">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
