"use client";

import GlobalSidebar from "@/components/global-sidebar";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <GlobalSidebar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
