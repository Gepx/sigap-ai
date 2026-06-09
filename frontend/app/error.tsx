"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#F4F9F6] px-4 py-8 sm:px-6 lg:px-8 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-[2rem] bg-white shadow-xl shadow-[#B43331]/10 border border-[#B43331]/20">
        <AlertCircle className="size-8 text-[#B43331]" />
      </div>
      
      <h1 className="mb-4 text-3xl font-black tracking-tight text-[#1A2E26] sm:text-4xl">
        Something went wrong!
      </h1>
      
      <p className="mb-8 max-w-md text-base font-medium leading-relaxed text-[#1A2E26]/60">
        We encountered an unexpected error while trying to process your request. 
        Please try again or return to the dashboard.
      </p>

      <button
        onClick={() => reset()}
        className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#00B074] px-8 text-sm font-bold text-white shadow-lg shadow-[#00B074]/25 transition-all hover:-translate-y-0.5 hover:bg-[#079968]"
      >
        <RotateCcw className="size-4 transition-transform group-hover:-rotate-180" />
        Try again
      </button>
    </div>
  );
}
