import { RegisterForm } from "@/components/register-form";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#F4F9F6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,176,116,0.18),transparent_28%),linear-gradient(180deg,#F4F9F6_0%,#FBFFFC_60%,#ECF5F0_100%)]" />
      <div className="absolute right-[-5rem] top-8 size-72 rounded-full bg-[#00B074]/12 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/4 size-[28rem] rounded-full bg-[#1A2E26]/8 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00B074]/35 to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl items-center justify-center lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="hidden flex-col gap-8 pr-6 lg:flex">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#00B074]/20 bg-white/70 px-4 py-2 text-sm font-bold text-[#007A51] shadow-sm backdrop-blur">
            Create your Sigap account
          </div>
          <div>
            <h1 className="max-w-xl text-5xl font-black leading-[1.03] tracking-tight text-[#1A2E26] xl:text-6xl">
              Join the workspace built for review analysis and faster action.
            </h1>
            <p className="mt-5 max-w-xl text-base font-medium leading-8 text-[#1A2E26]/62">
              Keep the same visual language from the home page and move into a
              focused analysis flow once your account is ready.
            </p>
          </div>

          <div className="grid max-w-xl gap-4 sm:grid-cols-3">
            {[
              ["Brand palette", "Green, cream, and ink"],
              ["Clear flow", "Upload to insight"],
              ["Real output", "Recommendation panel"],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-3xl border border-[#1A2E26]/8 bg-white/80 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-sm font-black text-[#1A2E26]">{title}</p>
                <p className="mt-1 text-xs font-medium leading-6 text-[#1A2E26]/55">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-xl">
          <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
