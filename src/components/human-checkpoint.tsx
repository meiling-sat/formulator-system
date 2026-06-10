"use client";

import type { Project } from "@/lib/mock-data";
import { getCheckpointInfo } from "@/lib/state-machine";

interface HumanCheckpointProps {
  project: Project;
  onConfirm: () => void;
  onSkip: () => void;
}

export function HumanCheckpoint({ project, onConfirm, onSkip }: HumanCheckpointProps) {
  const checkpointInfo = getCheckpointInfo(project.status);
  if (!checkpointInfo) return null;

  const stageNum = project.status === "stage_3_awaiting_confirm" ? 3
    : project.status === "stage_7_awaiting_confirm" ? 7
    : 9;

  const stageData = project.stages[stageNum]?.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-6">
        <div className="pointer-events-none absolute -right-4 -top-4 text-8xl font-black text-amber-100/40 select-none">
          {stageNum === 3 ? "①" : stageNum === 7 ? "②" : "③"}
        </div>
        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-sm">
            <span className="text-xl text-white font-bold">✋</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-amber-900">{checkpointInfo.title}</h2>
              <span className="rounded-full bg-amber-200/60 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800">
                审核卡点 {stageNum === 3 ? "1/3" : stageNum === 7 ? "2/3" : "3/3"}
              </span>
            </div>
            <p className="mt-1 text-sm text-amber-700">{checkpointInfo.description}</p>
            <p className="mt-1.5 text-xs text-amber-600/80">{checkpointInfo.reviewFocus}</p>
          </div>
        </div>
      </div>

      {/* Team Badge */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex -space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-100 text-xs">👨‍🔬</div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-accent-100 text-xs">👩‍⚕️</div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-100 text-xs">📋</div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">专业团队将审核此阶段产出</p>
          <p className="text-xs text-gray-500">资深配方师 · 药剂师 · 合规专员 — 预计24小时内完成审核</p>
        </div>
      </div>

      {/* Stage-specific Content Preview */}
      {stageNum === 3 && stageData && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">待审核内容</h3>
          {["layer1", "layer2", "layer3"].map((key, i) => {
            const layer = (stageData as any)[key];
            if (!layer) return null;
            return (
              <div key={key} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-white p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-xs font-bold text-brand-700">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-gray-800">{layer.title}</h4>
                  <p className="truncate text-xs text-gray-500">{layer.summary}</p>
                </div>
                <span className="shrink-0 rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-medium text-accent-700">
                  {layer.status}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {stageNum === 7 && stageData && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">待审核内容</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-amber-100 bg-white p-3 text-center">
              <div className="text-2xl font-bold text-brand-600">{(stageData as any).final_formula?.ingredients?.length ?? "—"}</div>
              <div className="mt-1 text-[10px] text-gray-500">活性成分</div>
            </div>
            <div className="rounded-xl border border-amber-100 bg-white p-3 text-center">
              <div className="text-2xl font-bold text-accent-600">{(stageData as any).final_formula?.three_color_summary?.green ?? "—"}</div>
              <div className="mt-1 text-[10px] text-gray-500">🟢 绿色通行</div>
            </div>
            <div className="rounded-xl border border-amber-100 bg-white p-3 text-center">
              <div className="text-2xl font-bold text-gray-600">{(stageData as any).final_formula?.antagonism ?? "0"}</div>
              <div className="mt-1 text-[10px] text-gray-500">拮抗项</div>
            </div>
          </div>
        </div>
      )}

      {stageNum === 9 && stageData && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">待审核内容</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-amber-100 bg-white p-3">
              <div className="mb-1 text-xs text-gray-500">💰 成本核算</div>
              <div className="text-sm font-medium text-gray-800">{(stageData as any).cost ? `¥${(stageData as any).cost.total_per_box}/盒` : "已完成"}</div>
            </div>
            <div className="rounded-xl border border-amber-100 bg-white p-3">
              <div className="mb-1 text-xs text-gray-500">🏭 生产SOP</div>
              <div className="text-sm font-medium text-gray-800">{(stageData as any).sop ? (stageData as any).sop.dosage_form : "已完成"}</div>
            </div>
            <div className="rounded-xl border border-amber-100 bg-white p-3">
              <div className="mb-1 text-xs text-gray-500">🛡️ 安全验证</div>
              <div className="text-sm font-medium text-gray-800">{(stageData as any).safety?.overall_grade ?? "已完成"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 border-t border-amber-100 pt-5">
        {/* Primary: Wait for review */}
        <button
          onClick={onConfirm}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-accent-700 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:from-accent-600 hover:to-accent-800 hover:shadow-md"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          提交人工审核（推荐）
        </button>

        {/* Secondary: Skip */}
        <button
          onClick={onSkip}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:shadow-md"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
          跳过审核，继续体验完整流程
        </button>

        {/* Info text */}
        <p className="text-center text-[11px] text-gray-400">
          跳过审核不影响完整体验，但最终文档将标注"未经人工审核"且无法下载
        </p>
      </div>
    </div>
  );
}
