"use client";

import { useState } from "react";

const FORMULAS = [
  { id: "F-001", name: "口服美白提亮（三核一锚）", category: "美白", ingredients: 9, pathways: 3, evidence: "8/9🟢", price: "¥15,000", form: "粉剂", market: "香港", status: "verified" },
  { id: "F-002", name: "口服光保护盾", category: "美白", ingredients: 5, pathways: 2, evidence: "5/5🟢", price: "¥12,000", form: "胶囊", market: "香港+跨境", status: "verified" },
  { id: "F-003", name: "女性私密微生态四层防线", category: "私密护理", ingredients: 7, pathways: 4, evidence: "6/7🟢", price: "¥18,000", form: "胶囊", market: "三市场", status: "verified" },
  { id: "F-004", name: "盆底生态营养（四维联动）", category: "盆底健康", ingredients: 8, pathways: 4, evidence: "7/8🟢", price: "¥20,000", form: "粉剂", market: "香港", status: "verified" },
  { id: "F-005", name: "口服祛痘净透时序调控", category: "祛痘", ingredients: 8, pathways: 3, evidence: "7/8🟢", price: "¥15,000", form: "粉剂", market: "香港+跨境", status: "verified" },
  { id: "F-006", name: "胶原抗衰双效修复", category: "胶原", ingredients: 7, pathways: 3, evidence: "6/7🟢", price: "¥14,000", form: "粉剂", market: "三市场", status: "verified" },
  { id: "F-007", name: "女性泌尿屏护复配", category: "泌尿健康", ingredients: 5, pathways: 3, evidence: "5/5🟢", price: "¥12,000", form: "片剂", market: "香港+跨境", status: "verified" },
  { id: "F-008", name: "助眠安神复合配方", category: "助眠", ingredients: 6, pathways: 2, evidence: "5/6🟢", price: "¥10,000", form: "胶囊", market: "三市场", status: "verified" },
  { id: "F-009", name: "肠道益生菌协同", category: "肠道健康", ingredients: 8, pathways: 3, evidence: "7/8🟢", price: "¥13,000", form: "粉剂", market: "三市场", status: "verified" },
  { id: "F-010", name: "关节修护胶原配方", category: "关节", ingredients: 6, pathways: 2, evidence: "6/6🟢", price: "¥14,000", form: "片剂", market: "香港", status: "verified" },
  { id: "F-011", name: "男性活力综合", category: "男性健康", ingredients: 7, pathways: 3, evidence: "5/7🟢", price: "¥16,000", form: "胶囊", market: "香港+跨境", status: "verified" },
  { id: "F-012", name: "更年期综合调理", category: "女性健康", ingredients: 9, pathways: 4, evidence: "7/9🟢", price: "¥18,000", form: "胶囊", market: "三市场", status: "verified" },
  { id: "F-013", name: "口服防脱育发", category: "头发", ingredients: 7, pathways: 3, evidence: "5/7🟢", price: "¥15,000", form: "粉剂", market: "香港", status: "verified" },
  { id: "F-014", name: "护眼蓝光防护", category: "眼部", ingredients: 5, pathways: 2, evidence: "5/5🟢", price: "¥11,000", form: "胶囊", market: "三市场", status: "verified" },
  { id: "F-015", name: "体重管理代餐", category: "体重管理", ingredients: 10, pathways: 3, evidence: "8/10🟢", price: "¥12,000", form: "粉剂", market: "香港+跨境", status: "verified" },
];

const CATEGORIES = ["全部", "美白", "私密护理", "盆底健康", "祛痘", "胶原", "泌尿健康", "助眠", "肠道健康", "关节", "男性健康", "女性健康", "头发", "眼部", "体重管理"];

export default function FormulaLibraryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("全部");
  const [formFilter, setFormFilter] = useState("全部");

  const filtered = FORMULAS.filter(f => {
    const matchSearch = !search || f.name.includes(search) || f.category.includes(search) || f.id.includes(search);
    const matchCategory = categoryFilter === "全部" || f.category === categoryFilter;
    const matchForm = formFilter === "全部" || f.form === formFilter;
    return matchSearch && matchCategory && matchForm;
  });

  return (
    <div className="h-full overflow-y-auto bg-gray-50/30 p-6">
        {/* Header with filters */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">成熟配方数据库</h2>
              <p className="text-sm text-gray-500">
                显示 {filtered.length} 个配方 · 全部经过七问审计+安全验证+拮抗排查
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2">
              <span className="text-sm">�</span>
              <span className="text-xs text-brand-700">购买配方授权后可获取完整配方表+SOP+合规文件</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索配方..."
              className="w-56 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none"
            />
            <div className="flex items-center gap-1 flex-wrap">
              {["全部", "美白", "私密护理", "盆底健康", "祛痘", "胶原", "泌尿健康", "助眠"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs transition ${
                    categoryFilter === cat ? "bg-brand-100 text-brand-700 font-medium" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-1">
              {["全部", "粉剂", "胶囊", "片剂"].map(form => (
                <button
                  key={form}
                  onClick={() => setFormFilter(form)}
                  className={`rounded-lg px-2.5 py-1 text-xs transition ${
                    formFilter === form ? "bg-brand-100 text-brand-700 font-medium" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {form}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Formula Grid */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gradient-to-r from-brand-50/50 to-orange-50/30">
                <th className="px-4 py-3 text-left font-medium text-gray-600">编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">配方名称</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">品类</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">成分</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">通路</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">证据</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">剂型</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">市场</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">授权价</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} className="border-b border-gray-50 transition hover:bg-brand-50/30 cursor-pointer">
                  <td className="px-4 py-3">
                    <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-brand-700">{f.id}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{f.name}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setCategoryFilter(f.category)}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700 hover:bg-brand-100"
                    >
                      {f.category}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">{f.ingredients}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{f.pathways}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-medium text-accent-700">{f.evidence}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-600">{f.form}</td>
                  <td className="px-4 py-3 text-center text-[10px] text-gray-500">{f.market}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-medium text-brand-700">{f.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* What's Included */}
        <div className="mt-6 rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-orange-50/50 p-5">
          <h3 className="font-semibold text-gray-800">购买配方授权包含</h3>
          <div className="mt-3 grid grid-cols-4 gap-4">
            {[
              { icon: "📋", label: "完整配方表", desc: "逐成分+剂量+来源" },
              { icon: "🏭", label: "生产SOP", desc: "投料顺序+工艺参数" },
              { icon: "🛡️", label: "安全验证", desc: "UL对比+拮抗排查" },
              { icon: "📑", label: "合规文件", desc: "原料身份+宣称边界" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-amber-100 bg-white p-3 text-center">
                <div className="text-2xl">{item.icon}</div>
                <div className="mt-1 text-sm font-medium text-gray-800">{item.label}</div>
                <div className="text-[10px] text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 rounded-2xl border border-accent-200 bg-accent-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
              <span className="text-xl">🤝</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-accent-800">需要定制配方或批量授权？</h4>
              <p className="mt-0.5 text-sm text-accent-700">我们提供从配方授权到OEM全链路服务。批量授权享折扣。</p>
            </div>
            <button className="shrink-0 rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent-700">
              联系商务团队
            </button>
          </div>
        </div>
    </div>
  );
}
