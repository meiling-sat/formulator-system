"use client";

import { useFormulatorStore } from "@/lib/store";
import { getStageNumber, isAwaitingConfirm } from "@/lib/state-machine";
import { useParams, useRouter } from "next/navigation";
import { StageNavigation } from "@/components/stage-navigation";
import { StagePanel } from "@/components/stage-panel";
import { HumanCheckpoint } from "@/components/human-checkpoint";
import { ChatPanel } from "@/components/chat-panel";
import { useState } from "react";
import { STAGES } from "@/lib/state-machine";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, skippedReviews, advanceStage, confirmCheckpoint, skipCheckpoint } = useFormulatorStore();
  
  const project = projects.find(p => p.id === params.id);
  
  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-amber-50/30 to-white">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-gray-500">项目未找到</p>
          <button onClick={() => router.push("/")} className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700">
            返回项目列表
          </button>
        </div>
      </div>
    );
  }

  const currentStageNum = getStageNumber(project.status);
  const isCheckpoint = isAwaitingConfirm(project.status);
  const isCompleted = project.status === "completed";

  const handleAdvance = () => {
    advanceStage(project.id);
  };

  const handleConfirm = () => {
    confirmCheckpoint(project.id);
  };

  const handleSkip = () => {
    skipCheckpoint(project.id);
  };

  const [showChat, setShowChat] = useState(true);
  const stageName = STAGES[currentStageNum - 1]?.label || `阶段${currentStageNum}`;

  return (
    <div className="flex h-screen">
      {/* Left: Stage Navigation */}
      <aside className="w-72 shrink-0 overflow-y-auto border-r border-amber-100 bg-gradient-to-b from-amber-50/60 to-white p-4">
        <div className="mb-4">
          <button
            onClick={() => router.push("/")}
            className="mb-3 flex items-center gap-1 text-sm text-gray-500 transition hover:text-brand-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            返回项目列表
          </button>
          <div className="rounded-lg border border-amber-200/60 bg-white p-3 shadow-sm">
            <span className="inline-block rounded-md bg-brand-100 px-2 py-0.5 text-xs font-mono font-semibold text-brand-700">
              {project.code}
            </span>
            <h2 className="mt-1.5 text-lg font-bold text-gray-900">{project.name}</h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all"
                  style={{ width: `${(currentStageNum / 10) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-gray-400">{currentStageNum}/10</span>
            </div>
          </div>
        </div>
        <StageNavigation
          currentStage={currentStageNum}
          status={project.status}
          stages={project.stages}
        />
      </aside>

      {/* Center: Stage Content */}
      <div className={`flex-1 overflow-y-auto bg-gray-50/30 p-6 ${showChat ? 'max-w-[calc(100%-384px)]' : ''}`}>
        {isCompleted ? (
          <div className="relative overflow-hidden rounded-2xl border border-accent-200 bg-gradient-to-br from-accent-50 to-emerald-50 p-8 text-center">
            <div className="pointer-events-none absolute -right-8 -top-8 text-[120px] font-black text-accent-100/50 select-none">✓</div>
            <div className="relative">
              <div className="mb-3 text-4xl">🎉</div>
              <h2 className="text-xl font-bold text-accent-800">项目已完成</h2>
              <p className="mt-2 text-sm text-accent-600">
                10阶段全部完成 · 11章客户提报文档已生成 · 四路经验回写已触发
              </p>
              <div className="mt-6 rounded-xl border border-accent-100 bg-white p-4 text-left shadow-sm">
                <h3 className="mb-2 font-medium text-gray-700">四路回写记录</h3>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><span className="text-accent-500">✅</span> 配方数据库 — 已录入最终配方</li>
                  <li className="flex items-center gap-2"><span className="text-accent-500">✅</span> 品类经验文件 — 已更新盆底品类通路图谱</li>
                  <li className="flex items-center gap-2"><span className="text-accent-500">✅</span> 经验修正日志 — 已记录本项目关键教训</li>
                  <li className="flex items-center gap-2"><span className="text-accent-500">✅</span> 跨品类通用经验 — 无新增通用规律</li>
                </ul>
              </div>
            </div>
          </div>
        ) : isCheckpoint ? (
          <HumanCheckpoint
            project={project}
            onConfirm={handleConfirm}
            onSkip={handleSkip}
          />
        ) : (
          <StagePanel
            project={project}
            stageNumber={currentStageNum}
            onAdvance={handleAdvance}
            skippedStages={skippedReviews[project.id] ?? []}
          />
        )}
      </div>

      {/* Right: AI Chat Panel */}
      {showChat ? (
        <div className="w-96 shrink-0">
          <ChatPanel
            projectContext={{
              name: project.name,
              code: project.code,
              stage: stageName,
            }}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition hover:bg-brand-700 hover:shadow-xl"
          title="打开配方师 AI"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}
    </div>
  );
}
