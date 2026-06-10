"use client";

import { useFormulatorStore } from "@/lib/store";
import { getStageNumber } from "@/lib/state-machine";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function GlobalSidebar() {
  const { projects, addProject } = useFormulatorStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { icon: "📊", label: "品类竞品分析", href: "/tools/category-scan" },
    { icon: "🔬", label: "配方验证", href: "/tools/formula-verify" },
    { icon: "💊", label: "成分数据库", href: "/tools/ingredients" },
    { icon: "🏷️", label: "贴牌产品库", href: "/tools/white-label" },
    { icon: "📋", label: "配方查询", href: "/tools/formula-library" },
  ];

  return (
    <aside className={`flex h-full flex-col border-r border-amber-100 bg-gradient-to-b from-amber-50/50 to-white transition-all shrink-0 ${sidebarCollapsed ? "w-16" : "w-60"}`}>
      {/* Sidebar Top */}
      <div className="flex h-14 items-center justify-between px-4">
        {!sidebarCollapsed && (
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
            Formulator
          </button>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
        </button>
      </div>

      {/* New Project Button */}
      <div className="px-3 pb-2">
        <button
          onClick={() => router.push("/?new=1")}
          className={`flex w-full items-center gap-2 rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-brand-50 hover:shadow ${sidebarCollapsed ? "justify-center" : ""}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {!sidebarCollapsed && <span>新建项目</span>}
          {!sidebarCollapsed && <span className="ml-auto text-xs text-gray-400">Ctrl K</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition ${sidebarCollapsed ? "justify-center" : ""} ${
                isActive
                  ? "bg-brand-50 text-brand-800 font-medium border border-brand-200/60"
                  : "text-gray-600 hover:bg-brand-50 hover:text-brand-800"
              }`}
            >
              <span className="shrink-0 text-base">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {/* Divider */}
        <div className="!my-3 border-t border-amber-100" />

        {/* History */}
        {!sidebarCollapsed && (
          <div className="mb-2 flex items-center gap-1.5 px-2 text-xs font-medium text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            历史项目
          </div>
        )}
        {projects.map(project => {
          const stageNum = getStageNumber(project.status);
          const isCompleted = project.status === "completed";
          return (
            <button
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}`)}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition hover:bg-gray-200 ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <span className="shrink-0 text-base">{isCompleted ? "✅" : "🧪"}</span>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-gray-700">{project.name}</div>
                  <div className="truncate text-xs text-gray-400">
                    {isCompleted ? "已完成" : `Stage ${stageNum}/10`}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Bottom */}
      <div className="border-t border-amber-100 p-3">
        <button className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-500 transition hover:bg-gray-200 ${sidebarCollapsed ? "justify-center" : ""}`}>
          <span className="text-base">⚙️</span>
          {!sidebarCollapsed && <span>设置</span>}
        </button>
      </div>
    </aside>
  );
}
