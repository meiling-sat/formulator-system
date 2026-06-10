"use client";

import type { Project } from "@/lib/mock-data";
import { STAGES } from "@/lib/state-machine";

interface StagePanelProps {
  project: Project;
  stageNumber: number;
  onAdvance: () => void;
  skippedStages?: number[];
}

export function StagePanel({ project, stageNumber, onAdvance, skippedStages = [] }: StagePanelProps) {
  const stage = STAGES[stageNumber - 1];
  const stageData = project.stages[stageNumber]?.data ?? {};

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-r from-brand-50 via-orange-50/60 to-yellow-50/40 p-5">
        <div className="pointer-events-none absolute -right-4 -top-4 text-7xl font-black text-brand-100/50 select-none">
          {String(stageNumber).padStart(2, "0")}
        </div>
        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-sm">
            {stageNumber}
          </span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {stage.label}
              <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-brand-600/60">{stage.labelEn}</span>
            </h2>
            <p className="text-sm text-gray-500">{stage.description}</p>
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <StageContent stageNumber={stageNumber} data={stageData} skippedStages={skippedStages} />
      </div>

      {/* Advance Button */}
      <div className="flex items-center gap-3 border-t border-amber-100 pt-4">
        <button
          onClick={onAdvance}
          className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:from-brand-600 hover:to-brand-800 hover:shadow-md"
        >
          完成当前阶段 →
        </button>
        <span className="text-xs text-gray-400">
          {stage.isHumanCheckpoint ? "下一步需要人工确认 ✋" : "自动进入下一阶段"}
        </span>
      </div>
    </div>
  );
}

function StageContent({ stageNumber, data, skippedStages = [] }: { stageNumber: number; data: Record<string, unknown>; skippedStages?: number[] }) {
  switch (stageNumber) {
    case 1:
      return <Stage1Content data={data} />;
    case 2:
      return <Stage2Content data={data} />;
    case 3:
      return <Stage3Content data={data} />;
    case 4:
      return <Stage4Content data={data} />;
    case 5:
      return <Stage5Content data={data} />;
    case 6:
      return <Stage6Content data={data} />;
    case 7:
      return <Stage7Content data={data} />;
    case 8:
      return <Stage8Content data={data} />;
    case 9:
      return <Stage9Content data={data} />;
    case 10:
      return <Stage10Content data={data} skippedStages={skippedStages} />;
    default:
      return <p className="text-gray-500">阶段数据待加载...</p>;
  }
}

// ═══════════ Stage 1: 需求锚定 ═══════════
function Stage1Content({ data }: { data: Record<string, unknown> }) {
  const dims = ["who", "what", "why", "where"] as const;
  const labels = { who: "目标用户 (WHO)", what: "核心痛点 (WHAT)", why: "市场合规 (WHY)", where: "产品协同 (WHERE)" };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">四维定位卡片</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {dims.map(dim => {
          const item = (data as any)[dim];
          return (
            <div key={dim} className="rounded-xl border border-amber-100 bg-white p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{labels[dim]}</span>
                {item?.locked && (
                  <span className="rounded bg-accent-100 px-1.5 py-0.5 text-[10px] text-accent-700">🔒 已锁定</span>
                )}
              </div>
              <p className="text-sm text-gray-800">{item?.description || "—"}</p>
            </div>
          );
        })}
      </div>
      {(data as any).category && (
        <div className="grid grid-cols-3 gap-3 border-t pt-3 text-sm">
          <div><span className="text-gray-500">品类：</span>{(data as any).category}</div>
          <div><span className="text-gray-500">剂型：</span>{(data as any).dosage_form}</div>
          <div><span className="text-gray-500">价格带：</span>{(data as any).price_range}</div>
        </div>
      )}
    </div>
  );
}

// ═══════════ Stage 2: 品类扫描 ═══════════
function Stage2Content({ data }: { data: Record<string, unknown> }) {
  const competitors = (data as any).competitors as any[] | undefined;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">竞品六维审计矩阵</h3>
      {competitors && competitors.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500">
                <th className="pb-2">品牌</th>
                <th className="pb-2">产品</th>
                <th className="pb-2">价格</th>
                <th className="pb-2">成分数</th>
                <th className="pb-2">铁律审计分</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 font-medium">{c.brand}</td>
                  <td className="py-2 text-gray-600">{c.product}</td>
                  <td className="py-2 text-gray-600">{c.price}</td>
                  <td className="py-2 text-center">{c.ingredients_count}</td>
                  <td className="py-2">
                    <span className={`font-mono ${c.audit_score >= 6 ? "text-accent-600" : c.audit_score >= 4 ? "text-amber-600" : "text-red-600"}`}>
                      {c.audit_score}/10
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400">竞品数据待扫描...</p>
      )}

      {(data as any).pathway_gaps && (
        <div className="border-t pt-3">
          <h4 className="mb-2 text-sm font-medium text-gray-600">结构性机会</h4>
          <div className="grid gap-2 sm:grid-cols-3">
            <GapCard title="通路空位" items={(data as any).pathway_gaps} color="blue" />
            <GapCard title="剂量空位" items={(data as any).dosage_gaps} color="amber" />
            <GapCard title="叙事空位" items={(data as any).narrative_gaps} color="purple" />
          </div>
        </div>
      )}
    </div>
  );
}

function GapCard({ title, items, color }: { title: string; items: string[]; color: string }) {
  const colors = {
    blue: "border-blue-200 bg-blue-50",
    amber: "border-amber-200 bg-amber-50",
    purple: "border-purple-200 bg-purple-50",
  };
  return (
    <div className={`rounded-lg border p-3 ${colors[color as keyof typeof colors]}`}>
      <h5 className="mb-1.5 text-xs font-medium text-gray-600">{title}</h5>
      <ul className="space-y-1 text-xs text-gray-700">
        {items?.map((item, i) => <li key={i}>• {item}</li>)}
      </ul>
    </div>
  );
}

// ═══════════ Stage 3: 三层交付物 ═══════════
function Stage3Content({ data }: { data: Record<string, unknown> }) {
  const layers = ["layer1", "layer2", "layer3"];
  const icons = ["📋", "🧬", "💡"];
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-700">三层交付物</h3>
      {layers.map((key, i) => {
        const layer = (data as any)[key];
        if (!layer) return null;
        return (
          <div key={key} className="flex items-start gap-3 rounded-xl border border-amber-100 p-3">
            <span className="text-xl">{icons[i]}</span>
            <div>
              <h4 className="font-medium text-gray-800">第{i + 1}层：{layer.title}</h4>
              <p className="mt-0.5 text-sm text-gray-600">{layer.summary}</p>
            </div>
            <span className="ml-auto shrink-0 rounded bg-accent-100 px-2 py-0.5 text-xs text-accent-700">
              {layer.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════ Stage 4: 通路推导 ═══════════
function Stage4Content({ data }: { data: Record<string, unknown> }) {
  const pathways = (data as any).final_pathways as any[] | undefined;
  const sources = (data as any).sources as any[] | undefined;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">通路架构（6步法推导结果）</h3>
      {sources && (
        <div className="rounded-xl bg-brand-50/50 border border-brand-100 p-3">
          <h4 className="mb-1 text-xs font-medium text-gray-500">权威来源（≥2篇）</h4>
          <ul className="space-y-0.5 text-xs text-gray-600">
            {sources.map((s, i) => <li key={i}>📄 {s.title} [{s.type}]</li>)}
          </ul>
        </div>
      )}
      {pathways && (
        <div className="space-y-2">
          {pathways.map((p, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-amber-100 p-3">
              <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold ${
                p.tier === "core" ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-600"
              }`}>
                {p.id} · {p.tier === "core" ? "核心" : "辅助"}
              </span>
              <div>
                <span className="font-medium text-gray-800">{p.name}</span>
                <p className="text-xs text-gray-500">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════ Stage 5: 候选成分库 ═══════════
function Stage5Content({ data }: { data: Record<string, unknown> }) {
  const candidates = (data as any).candidates as any[] | undefined;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">候选成分库 + 剂量分级</h3>
      {candidates && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500">
                <th className="pb-2">成分</th>
                <th className="pb-2">通路</th>
                <th className="pb-2">拟用/有效</th>
                <th className="pb-2">剂量分级</th>
                <th className="pb-2">三色</th>
                <th className="pb-2">状态</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, i) => (
                <tr key={i} className={`border-b last:border-0 ${c.excluded ? "opacity-50 line-through" : ""}`}>
                  <td className="py-2 font-medium">{c.name}</td>
                  <td className="py-2 text-gray-600">{c.pathway}</td>
                  <td className="py-2 font-mono text-xs">{c.dose_proposed}/{c.dose_effective}mg</td>
                  <td className="py-2 text-center">{c.grade}</td>
                  <td className="py-2 text-center">{c.color}</td>
                  <td className="py-2 text-xs">
                    {c.excluded ? (
                      <span className="text-red-500">排除：{c.reason}</span>
                    ) : (
                      <span className="text-accent-600">入选</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════ Stage 6: 合规前置 ═══════════
function Stage6Content({ data }: { data: Record<string, unknown> }) {
  const results = (data as any).results as any[] | undefined;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">合规前置审查 — 三市场验证</h3>
      {results && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-gray-500">
              <th className="pb-2">成分</th>
              <th className="pb-2">香港</th>
              <th className="pb-2">内地</th>
              <th className="pb-2">跨境</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2 font-medium">{r.name}</td>
                <td className="py-2">{r.hk}</td>
                <td className="py-2">{r.mainland}</td>
                <td className="py-2">{r.cross_border}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {(data as any).all_passed && (
        <div className="rounded-lg bg-accent-50 p-3 text-sm text-accent-700">
          ✅ 全部成分合规通过 — 可进入Stage 7配方定型
        </div>
      )}
    </div>
  );
}

// ═══════════ Stage 7: 配方定型 ═══════════
function Stage7Content({ data }: { data: Record<string, unknown> }) {
  const formula = (data as any).final_formula;
  if (!formula) return <p className="text-gray-400">配方定型数据待生成...</p>;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">{formula.name}</h3>
      
      {/* Three color summary */}
      <div className="flex gap-4 text-sm">
        <span className="rounded bg-green-50 px-2 py-1 text-green-700">🟢 {formula.three_color_summary.green}</span>
        <span className="rounded bg-yellow-50 px-2 py-1 text-yellow-700">🟡 {formula.three_color_summary.yellow}</span>
        <span className="rounded bg-red-50 px-2 py-1 text-red-700">🔴 {formula.three_color_summary.red}</span>
        <span className="ml-auto text-gray-500">拮抗：{formula.antagonism}</span>
      </div>

      {/* Formula table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-gray-500">
            <th className="pb-2">成分</th>
            <th className="pb-2">剂量</th>
            <th className="pb-2">通路</th>
            <th className="pb-2">三色</th>
            <th className="pb-2">七问</th>
          </tr>
        </thead>
        <tbody>
          {formula.ingredients.map((ing: any, i: number) => (
            <tr key={i} className="border-b last:border-0">
              <td className="py-2 font-medium">{ing.name}</td>
              <td className="py-2 font-mono text-xs">{ing.dose}</td>
              <td className="py-2 text-gray-600">{ing.pathway}</td>
              <td className="py-2 text-center">{ing.color}</td>
              <td className="py-2 text-center text-xs text-gray-500">{ing.q_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════ Stage 8: 体感审计 ═══════════
function Stage8Content({ data }: { data: Record<string, unknown> }) {
  const scores = (data as any).scores;
  if (!scores) return <p className="text-gray-400">体感审计数据待生成...</p>;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">体感审计 4.0 + 4.5</h3>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { label: "生物利用率", value: scores.bioavailability },
          { label: "剂量充分性", value: scores.dose_sufficiency },
          { label: "证据链完整", value: scores.evidence_chain },
          { label: "体感时间线", value: scores.sensory_timeline },
          { label: "口服独占值", value: scores.oral_exclusive },
          { label: "总分", value: scores.total },
        ].map((s, i) => (
          <div key={i} className="rounded-lg border p-3 text-center">
            <div className={`text-2xl font-bold ${s.value >= 7 ? "text-accent-600" : s.value >= 5 ? "text-amber-600" : "text-red-600"}`}>
              {s.value}
            </div>
            <div className="mt-1 text-[10px] text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
      <div className={`rounded-lg p-3 text-sm ${
        scores.total >= 7 ? "bg-accent-50 text-accent-700" : scores.total >= 5 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
      }`}>
        判定：{(data as any).verdict === "pass" ? "🟢 直接通过（≥7分）" : (data as any).verdict === "conditional" ? "🟡 可修正通过（5-6分）" : "🔴 强制重构（≤4分）"}
      </div>
    </div>
  );
}

// ═══════════ Stage 9: 全链路工程 ═══════════
function Stage9Content({ data }: { data: Record<string, unknown> }) {
  const cost = (data as any).cost;
  const sop = (data as any).sop;
  const safety = (data as any).safety;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">全链路工程交付</h3>
      
      {cost && (
        <div className="rounded-xl border border-amber-100 p-4">
          <h4 className="mb-2 text-sm font-medium text-gray-600">💰 成本核算</h4>
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div><span className="text-gray-500">日原料成本：</span>¥{cost.ingredients_daily_cost}</div>
            <div><span className="text-gray-500">出厂/盒：</span>¥{cost.total_per_box}</div>
            <div><span className="text-gray-500">建议零售：</span>{cost.suggested_retail}</div>
            <div><span className="text-gray-500">毛利率：</span>{cost.margin}</div>
          </div>
        </div>
      )}

      {sop && (
        <div className="rounded-xl border border-amber-100 p-4">
          <h4 className="mb-2 text-sm font-medium text-gray-600">🏭 生产工艺SOP</h4>
          <div className="mb-2 text-sm text-gray-700">剂型：{sop.dosage_form}</div>
          <ol className="list-inside list-decimal space-y-1 text-sm text-gray-600">
            {sop.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      )}

      {safety && (
        <div className="rounded-xl border border-amber-100 p-4">
          <h4 className="mb-2 text-sm font-medium text-gray-600">🛡️ 安全性验证</h4>
          <div className="flex items-center gap-2 text-sm">
            <span>总体等级：{safety.overall_grade}</span>
            {safety.all_safe && <span className="text-accent-600">全部安全</span>}
          </div>
          {safety.mandatory_labels && (
            <div className="mt-2 text-xs text-gray-500">
              标签必标：{safety.mandatory_labels.join(" / ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════ Stage 10: 客户提报（预览模式） ═══════════
function Stage10Content({ data, skippedStages = [] }: { data: Record<string, unknown>; skippedStages?: number[] }) {
  const chapters = (data as any).chapters as any[] | undefined;
  const hasSkipped = skippedStages.length > 0;

  return (
    <div className="space-y-5">
      {/* Document Preview Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">11章McKinsey客户提报文档</h3>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-[11px] font-medium text-brand-700">
          仅供预览 · 不可下载
        </span>
      </div>

      {/* Skipped Review Warning */}
      {hasSkipped && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
          <span className="text-amber-600">⚠️</span>
          <span className="text-amber-800">
            本方案包含未经人工审核的内容（跳过了阶段 {skippedStages.join("、")} 的审核）
          </span>
        </div>
      )}

      {/* Document Preview with Watermark */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Watermark overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="rotate-[-25deg] select-none text-center">
            <p className="text-4xl font-black text-gray-100/80 sm:text-5xl">预览版</p>
            <p className="mt-1 text-sm font-medium text-gray-200/80">完整版请联系配方师团队</p>
          </div>
        </div>

        {/* Chapter List */}
        <div className="relative p-5">
          <div className="mb-4 border-b border-gray-100 pb-4">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">FORMULATOR AI SYSTEM</p>
              <h4 className="mt-1 text-lg font-bold text-gray-900">客户提报方案</h4>
              <p className="mt-0.5 text-xs text-gray-500">11章 McKinsey 框架 · V2.0</p>
            </div>
          </div>

          {chapters ? (
            <div className="space-y-1.5">
              {chapters.map((ch, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-amber-100 p-2.5 text-sm">
                  <span className="shrink-0 rounded bg-brand-100 px-2 py-0.5 text-xs font-mono text-brand-700">
                    {ch.num}
                  </span>
                  <span className="flex-1 text-gray-800">{ch.title}</span>
                  <span className={`shrink-0 text-xs ${ch.status === "generated" ? "text-accent-600" : "text-gray-400"}`}>
                    {ch.status === "generated" ? "✅ 已生成" : "⏳ 待生成"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {["封面", "01 一页纸决策摘要", "02 市场机会", "03 品类洞察", "04 目标用户", "05 系统解法", "06 核心配方与差异化壁垒", "07 临床验证与功效交付", "08 营销符号体系", "09 商业化路径", "10 合规与风险", "11 功效交付承诺"].map((title, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-amber-100 p-2.5 text-sm">
                  <span className="shrink-0 rounded bg-brand-100 px-2 py-0.5 text-xs font-mono text-brand-700">
                    {i === 0 ? "封面" : String(i).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-gray-800">{title}</span>
                  <span className="shrink-0 text-xs text-accent-600">✅ 已生成</span>
                </div>
              ))}
            </div>
          )}

          {/* Blurred content teaser */}
          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <div className="select-none blur-[3px]">
              <p className="text-sm text-gray-600">一页纸决策摘要：本产品针对产后6月-5年女性盆底松弛/漏尿/性功能下降人群，采用"四维联动"创新通路架构，整合盆底支撑力、肌力、泌尿舒适、黏膜润泽四大维度，以全剂量品牌原料实现竞品空白区间的差异化占位...</p>
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs text-gray-400">—— 内容已模糊化处理，联系团队获取完整文档 ——</span>
            </div>
          </div>
        </div>
      </div>

      {/* No Download + CTA */}
      <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-orange-50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100">
            <span className="text-lg">📄</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">获取完整方案文档</h4>
            <p className="mt-1 text-sm text-gray-600">
              完整的11章客户提报文档需由配方师团队审核确认后提供。联系我们获取可交付版本。
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:shadow-md">
                联系配方师团队
              </button>
              <span className="text-xs text-gray-400">
                {hasSkipped ? "⚠️ 跳过审核的项目需补充审核后提供" : "审核已通过，可安排文档交付"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
