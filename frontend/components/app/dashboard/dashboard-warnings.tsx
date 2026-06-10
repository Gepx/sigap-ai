import React from "react";
import { AlertTriangle } from "lucide-react";

export default function DashboardWarnings({ warnings }: { warnings: any[] }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertTriangle className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-rose-800">
            Early Warning Detected
          </h3>
          <p className="text-sm text-rose-600">
            {warnings[0].message}
          </p>
        </div>
      </div>
    </div>
  );
}
