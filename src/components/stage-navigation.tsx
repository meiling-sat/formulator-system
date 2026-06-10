"use client";

import { STAGES, type ProjectStatus, getStageNumber } from "@/lib/state-machine";
import type { StageData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface StageNavigationProps {
  currentStage: number;
  status: ProjectStatus;
  stages: Record<number, StageData>;
}

export function StageNavigation({ currentStage, status, stages }: StageNavigationProps) {
  return (
    <nav className="space-y-1">
      {STAGES.map(stage => {
        const isCurrent = stage.number === currentStage;
        const isCompleted = stages[stage.number]?.completed ?? false;
        const isPast = stage.number < currentStage;
        const isFuture = stage.number > currentStage;

        return (
          <div
            key={stage.number}
            className={cn(
              "flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm transition",
              isCurrent && "bg-gradient-to-r from-brand-50 to-orange-50/50 border border-brand-200 shadow-sm",
              isPast && isCompleted && "text-gray-500 hover:bg-gray-50",
              isFuture && "text-gray-400 opacity-60"
            )}
          >
            {/* Stage indicator */}
            <div className="mt-0.5 flex-shrink-0">
              {isCompleted || isPast ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                </div>
              ) : isCurrent ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white shadow-sm">
                  {stage.number}
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-200 text-xs font-medium text-gray-400">
                  {stage.number}
                </div>
              )}
            </div>

            {/* Stage info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "font-medium",
                  isCurrent && "text-brand-800",
                  (isPast && isCompleted) && "text-gray-600",
                  isFuture && "text-gray-400"
                )}>
                  {stage.label}
                </span>
                {stage.isHumanCheckpoint && (
                  <span className="text-xs" title="人工卡点">✋</span>
                )}
              </div>
              {isCurrent && (
                <p className="mt-0.5 text-xs text-brand-700/70 line-clamp-2">
                  {stage.description}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Completion indicator */}
      <div className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
        status === "completed" ? "bg-gradient-to-r from-accent-50 to-emerald-50 border border-accent-200" : "text-gray-300 opacity-40"
      )}>
        <div className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-xs",
          status === "completed" ? "bg-accent-500 text-white" : "border-2 border-gray-200"
        )}>
          {status === "completed" ? "✓" : "⬤"}
        </div>
        <span className={cn(
          "font-medium",
          status === "completed" ? "text-accent-700" : "text-gray-400"
        )}>
          完成 + 四路回写
        </span>
      </div>
    </nav>
  );
}
