import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function NotFound() {
  return (
    <BackgroundBeamsWithCollision className="min-h-svh bg-[#F4F9F6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,176,116,0.18),transparent_28%),linear-gradient(180deg,#F4F9F6_0%,#FBFFFC_60%,#ECF5F0_100%)] z-0" />
      <div className="absolute right-[-5rem] top-8 size-72 rounded-full bg-[#00B074]/12 blur-3xl z-0" />
      <div className="absolute bottom-[-6rem] left-1/4 size-[28rem] rounded-full bg-[#1A2E26]/8 blur-3xl z-0" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00B074]/35 to-transparent z-10" />

      <div className="relative z-20 mx-auto flex w-full max-w-lg flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-black tracking-tight text-[#1A2E26] sm:text-5xl mb-4">
          Page not found
        </h1>

        <p className="mb-8 text-base font-medium leading-relaxed text-[#1A2E26]/60">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved, deleted, or perhaps you mistyped the URL.
        </p>

        <Link
          href="/"
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#00B074] px-8 text-sm font-bold text-white shadow-lg shadow-[#00B074]/25 transition-all hover:-translate-y-0.5 hover:bg-[#079968]"
        >
          Return Home
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
