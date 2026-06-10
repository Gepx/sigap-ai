import React from "react";
import {
  Sparkles,
  AlertTriangle,
  Info,
  Zap,
  PenTool,
  Copy,
  Check,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  rec: any;
  isDrafting: boolean;
  copiedId: string | null;
  onGenerateDraft: (rec: any) => void;
  onCopy: (id: string, text: string) => void;
}

export default function RecommendationCard({
  rec,
  isDrafting,
  copiedId,
  onGenerateDraft,
  onCopy,
}: Props) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return <AlertTriangle className="size-4 text-rose-500" />;
      case "Medium":
        return <Zap className="size-4 text-amber-500" />;
      case "Low":
        return <Info className="size-4 text-emerald-500" />;
      default:
        return <Info className="size-4 text-slate-500" />;
    }
  };

  const recId = rec.id || rec.title;

  return (
    <div className="group rounded-[1.35rem] border border-[#1A2E26]/8 bg-[#FBFFFC] p-5 transition-colors hover:border-[#00B074]/20 hover:bg-[#E8FFF4]/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-lg font-black text-[#1A2E26]">{rec.title}</h3>
            <span
              className={`
                inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold
                ${
                  rec.priority === "High"
                    ? "border-[#F25F5C]/20 bg-[#FFF1F1] text-[#B43331]"
                    : rec.priority === "Medium"
                      ? "border-[#F2C94C]/30 bg-[#FFF8E1] text-[#9A7200]"
                      : "border-[#00B074]/20 bg-[#E8FFF4] text-[#007A51]"
                }
              `}
            >
              {getPriorityIcon(rec.priority)}
              {rec.priority} priority
            </span>
          </div>
          <p className="mb-4 text-sm leading-7 text-[#1A2E26]/62">
            {rec.description}
          </p>
          <div className="mt-2 flex w-full items-start sm:items-center gap-3 rounded-[2rem] border border-[#00B074]/20 bg-white px-5 py-3.5 shadow-sm">
            <Sparkles className="size-4 shrink-0 text-[#007A51] mt-0.5 sm:mt-0" />
            <div className="text-sm leading-relaxed">
              <span className="font-bold text-[#1A2E26] mr-1.5">
                Expected impact:
              </span>
              <span className="font-semibold text-[#007A51]">
                {rec.impact}
              </span>
            </div>
          </div>

          {/* Draft Section */}
          <div className="mt-4 border-t border-[#1A2E26]/10 pt-4">
            {!rec.draft ? (
              <Button
                onClick={() => onGenerateDraft(rec)}
                disabled={isDrafting}
                variant="outline"
                className="rounded-full border-[#00B074]/30 bg-white text-[#007A51] hover:bg-[#E8FFF4] hover:text-[#00B074]"
              >
                {isDrafting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <PenTool className="mr-2 size-4" />
                )}
                {isDrafting ? "Drafting..." : "Generate Response Draft"}
              </Button>
            ) : (
              <div className="relative rounded-2xl border border-[#00B074]/30 bg-[#F4F9F6] p-4 text-sm text-[#1A2E26]">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#007A51]">
                    Generated Draft
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onGenerateDraft(rec)}
                      disabled={isDrafting}
                      className="h-8 rounded-full hover:bg-white text-[#007A51]"
                      title="Regenerate Draft"
                    >
                      {isDrafting ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="size-3.5" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCopy(recId, rec.draft)}
                      className="h-8 rounded-full hover:bg-white text-[#007A51]"
                      title="Copy to clipboard"
                    >
                      {copiedId === recId ? (
                        <Check className="size-3.5" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {rec.draft}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
