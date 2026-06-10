"use client";

export default function IngredientsRedirectPage() {
  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-b from-amber-50/60 to-white">
      <div className="w-full max-w-lg text-center p-8">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-100">
          <span className="text-5xl">💊</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">成分数据库</h1>
        <p className="mt-3 text-gray-600">
          NutriCore 成分数据库 — 涵盖 500+ 功能性成分的证据等级、有效剂量、合规状态与成本数据
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-amber-100 bg-white p-4 text-center">
            <div className="text-2xl font-bold text-brand-700">500+</div>
            <div className="mt-1 text-xs text-gray-500">功能性成分</div>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white p-4 text-center">
            <div className="text-2xl font-bold text-brand-700">6维</div>
            <div className="mt-1 text-xs text-gray-500">评估体系</div>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white p-4 text-center">
            <div className="text-2xl font-bold text-brand-700">3市场</div>
            <div className="mt-1 text-xs text-gray-500">合规覆盖</div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <p className="font-medium">数据库功能</p>
          <ul className="mt-2 space-y-1 text-left text-xs">
            <li>• 成分搜索：按名称、功效、通路快速检索</li>
            <li>• 证据分级：🟢直接RCT / 🟡相关RCT / 🔴机理推断</li>
            <li>• 剂量区间：最低有效剂量 → UL上限</li>
            <li>• 合规状态：内地/香港/跨境三市场逐成分确认</li>
            <li>• 成本估算：原料公斤价 → 日成本</li>
            <li>• 拮抗标记：已知相互作用警告</li>
          </ul>
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href="http://localhost:3001/ingredients"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
          >
            进入成分数据库
          </a>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          成分数据库由 NutriCore 系统驱动，需独立启动服务
        </p>
      </div>
    </div>
  );
}
