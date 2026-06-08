import { RegisterForm } from "@/components/register-form";
import { Suspense } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function RegisterPage() {
  return (
    <BackgroundBeamsWithCollision className="min-h-svh bg-[#F4F9F6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,176,116,0.18),transparent_28%),linear-gradient(180deg,#F4F9F6_0%,#FBFFFC_60%,#ECF5F0_100%)] z-0" />
      <div className="absolute right-[-5rem] top-8 size-72 rounded-full bg-[#00B074]/12 blur-3xl z-0" />
      <div className="absolute bottom-[-6rem] left-1/4 size-[28rem] rounded-full bg-[#1A2E26]/8 blur-3xl z-0" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00B074]/35 to-transparent z-10" />
      <div className="relative w-full max-w-xl z-20">
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
