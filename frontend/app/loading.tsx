import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#F4F9F6] text-[#1A2E26]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-[#00B074]/10 border border-[#00B074]/20">
          <Loader2 className="size-6 animate-spin text-[#00B074]" />
        </div>
        <p className="text-sm font-bold text-[#1A2E26]/60 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
