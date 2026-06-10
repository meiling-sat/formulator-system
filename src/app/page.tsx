"use client";

import { useFormulatorStore } from "@/lib/store";
import { getStageNumber, STAGES } from "@/lib/state-machine";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import GlobalSidebar from "@/components/global-sidebar";


const QUICK_ACTIONS = [
  { icon: "🧪", label: "新建配方项目", desc: "启动10阶段标准化开发流程" },
  { icon: "📊", label: "品类扫描", desc: "竞品分析 + 通路空位识别" },
  { icon: "📋", label: "客户提报", desc: "生成11章McKinsey风格方案" },
  { icon: "🔬", label: "成分查询", desc: "搜索候选成分 + 证据链" },
];

export default function ProjectListPage() {
  const { projects, addProject } = useFormulatorStore();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    setShowNewProject(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInputSubmit();
    }
  };

  const handleQuickAction = (label: string) => {
    if (label === "新建配方项目") {
      setShowNewProject(true);
    }
  };

  return (
    <div className="flex h-screen">
      <GlobalSidebar />

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {showNewProject ? (
          <NewProjectForm
            onCancel={() => setShowNewProject(false)}
            onCreate={(name, code) => {
              addProject(name, code);
              setShowNewProject(false);
              setInputValue("");
            }}
            initialName={inputValue}
          />
        ) : (
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Hero Section */}
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
              {/* Centered Brand */}
              <div className="mb-12 text-center">
                <h1 className="text-5xl font-bold tracking-tight text-gray-900">Formulator</h1>
                <p className="mt-3 text-base text-gray-400">10阶段标准化配方开发 · 状态机驱动</p>
              </div>

              {/* Input Area */}
              <div className="w-full max-w-2xl">
                <div className="rounded-2xl border border-amber-100 bg-white px-4 py-3 shadow-sm transition focus-within:border-brand-400 focus-within:shadow-md">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入产品需求，开始配方开发..."
                    rows={2}
                    className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition hover:bg-gray-50">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        附件
                      </button>
                      <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition hover:bg-gray-50">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        Agent
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">10阶段SOP</span>
                      <button
                        onClick={handleInputSubmit}
                        disabled={!inputValue.trim()}
                        className={`rounded-full p-2 transition ${inputValue.trim() ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-gray-100 text-gray-300"}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {QUICK_ACTIONS.map(action => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.label)}
                      className="group flex flex-col items-start rounded-xl border border-amber-100/80 bg-white p-3.5 text-left transition hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-sm"
                    >
                      <span className="mb-2 text-xl">{action.icon}</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-brand-700">{action.label}</span>
                      <span className="mt-0.5 text-xs text-gray-400">{action.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== Editorial Bottom Section ===== */}
            <div className="mt-4">
              {/* Divider */}
              <div className="mx-auto flex max-w-3xl items-center gap-4 px-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <span className="text-xs font-medium tracking-widest text-gray-300">FORMULATOR SYSTEM</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              </div>

              {/* Magazine-style Feature Section */}
              <div className="relative mt-8 overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/80 to-yellow-50">
                {/* Background decorative elements */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl" />
                <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-orange-100/30 blur-3xl" />
                <div className="pointer-events-none absolute right-12 top-8 text-[180px] font-black leading-none text-amber-100/50 select-none">
                  10
                </div>

                <div className="relative px-8 py-12 sm:px-12 lg:px-16">
                  {/* Header */}
                  <div className="mb-10 flex items-end justify-between">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600/70">Release The Power of Formula</p>
                      <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                        释放<span className="text-amber-600">配方</span>的力量
                      </h2>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
                        从需求锚定到客户提报，10个阶段环环相扣，每一步都有AI循证引擎驱动
                      </p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="ml-auto text-amber-500/60">
                        <path d="M8 40L40 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        <path d="M18 8H40V30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-1 text-xs font-medium text-gray-400">EVIDENCE-BASED</p>
                    </div>
                  </div>

                  {/* Stage Cards - Editorial Grid */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { num: "01", title: "需求锚定", en: "DEMAND", desc: "四维定位 · 品类×剂型×市场×协同", accent: "from-amber-500 to-orange-500" },
                      { num: "02", title: "品类扫描", en: "SCANNING", desc: "竞品拆解 · 通路空位 · 叙事空位识别", accent: "from-orange-500 to-red-400" },
                      { num: "03", title: "三层交付", en: "DELIVERABLES", desc: "需求确认 · 理论基础 · 消费者迷思", accent: "from-yellow-500 to-amber-500" },
                      { num: "04", title: "通路推导", en: "PATHWAY", desc: "自上而下6步 · 口服可干预性筛选", accent: "from-amber-600 to-yellow-500" },
                      { num: "05", title: "成分擂台", en: "ARENA", desc: "六维评分PK · 决选+落选全记录", accent: "from-orange-600 to-amber-500" },
                      { num: "06", title: "合规审查", en: "COMPLIANCE", desc: "逐成分三地合规 · 宣称边界锁定", accent: "from-red-400 to-orange-400" },
                    ].map(stage => (
                      <div
                        key={stage.num}
                        className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-sm transition hover:bg-white hover:shadow-lg hover:shadow-amber-100/50"
                      >
                        <div className="pointer-events-none absolute -right-2 -top-2 text-6xl font-black text-gray-100/60 transition group-hover:text-amber-100/80 select-none">
                          {stage.num}
                        </div>
                        <div className="relative">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stage.en}</p>
                          <h3 className="mt-1 text-lg font-bold text-gray-800">{stage.title}</h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{stage.desc}</p>
                          <div className={`mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r ${stage.accent} transition-all group-hover:w-20`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Row - Larger Feature Cards */}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white">
                      <div className="pointer-events-none absolute -right-4 -top-4 text-8xl font-black text-white/10 select-none">07</div>
                      <div className="pointer-events-none absolute bottom-3 right-3 opacity-20">
                        <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                          <path d="M8 40L40 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M18 8H40V30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <span className="rounded-lg bg-white/20 px-2 py-1 text-[10px] font-bold backdrop-blur-sm">STAGE 07-08</span>
                          <span className="text-xs text-white/60">FORMULA + AUDIT</span>
                        </div>
                        <h3 className="mt-3 text-2xl font-black">配方定型 × 体感审计</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/80">七问审计 · 三色通行证 · 拮抗排查 · 七铁律验证</p>
                        <div className="mt-4 flex items-center gap-4 text-xs text-white/60">
                          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-green-300" />绿色通过</span>
                          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-yellow-300" />黄色放行</span>
                          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-300" />红色标注</span>
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-orange-300/40 bg-gradient-to-br from-amber-700 to-yellow-800 p-6 text-white">
                      <div className="pointer-events-none absolute -right-4 -top-4 text-8xl font-black text-white/10 select-none">10</div>
                      <div className="pointer-events-none absolute bottom-3 right-3 opacity-15">
                        <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" />
                          <path d="M24 14V24L30 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <span className="rounded-lg bg-white/20 px-2 py-1 text-[10px] font-bold backdrop-blur-sm">STAGE 09-10</span>
                          <span className="text-xs text-white/60">ENGINEERING + REPORT</span>
                        </div>
                        <h3 className="mt-3 text-2xl font-black">工程交付 × 客户提报</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/80">成本核算 · 生产SOP · 安全验证 · 11章McKinsey方案</p>
                        <div className="mt-4 flex items-center gap-6 text-xs text-white/60">
                          <div>
                            <span className="text-2xl font-black text-white/90">11</span>
                            <span className="ml-1">章节</span>
                          </div>
                          <div>
                            <span className="text-2xl font-black text-white/90">3</span>
                            <span className="ml-1">KPI</span>
                          </div>
                          <div>
                            <span className="text-2xl font-black text-white/90">8</span>
                            <span className="ml-1">维安全</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats Bar */}
                  <div className="mt-8 flex items-center justify-between border-t border-amber-200/40 pt-6">
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-3xl font-black text-gray-800">10</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Stages</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-gray-800">7</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Questions</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-gray-800">3</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Solutions</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-amber-600">AI</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Powered</p>
                      </div>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                      <span className="text-xs text-gray-400">FIRST OF ALL, EVIDENCE MAKES ME INSPIRED</span>
                      <span className="text-xs font-medium text-gray-300">|</span>
                      <span className="text-xs font-bold text-amber-600/70">V3.5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-amber-800 to-yellow-900 px-8 py-6 sm:px-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-200">
                        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-50">Formulator AI System</p>
                      <p className="text-[10px] text-amber-300/60">Evidence-Based Formula Development Platform</p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-6 text-xs text-amber-200/50 sm:flex">
                    <span>循证指数 ≥30</span>
                    <span>协同密度 ≥1.5</span>
                    <span>安全净值 ≥60%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ===== New Project Form ===== */

const DOSAGE_FORM_OPTIONS = [
  "粉剂（条装冲饮）",
  "胶囊（硬胶囊）",
  "软胶囊",
  "片剂",
  "晶球直服",
  "口服液（瓶装）",
  "软糖",
  "泡腾片",
];

const MARKET_OPTIONS = [
  { value: "hk", label: "🇭🇰 香港" },
  { value: "mainland", label: "🇨🇳 中国内地" },
  { value: "cross_border", label: "🌐 跨境电商" },
  { value: "sea", label: "🌏 东南亚" },
  { value: "global", label: "🌍 全球" },
];

const PRICE_RANGE_OPTIONS = [
  "HKD 198-298（入门级）",
  "HKD 298-398（主流级）",
  "HKD 398-598（中高端）",
  "HKD 598-898（高端）",
  "HKD 898+（奢华级）",
  "待定",
];

const CATEGORY_CODE_MAP: Record<string, string> = {
  "口服美白提亮": "WHT",
  "口服祛痘净透": "ACN",
  "口服胶原抗衰": "COL",
  "女性私密微生态": "MEC",
  "女性盆底健康": "PEL",
  "女性UTI防护": "UTI",
  "口服助眠": "SLP",
  "口服护肝": "LIV",
  "口服关节养护": "JNT",
};

const EFFICACY_OPTIONS = [
  "美白提亮", "淡斑", "抗氧化", "抗糖化",
  "祛痘控油", "抗炎", "皮脂调节", "肠-皮轴修复",
  "胶原合成", "抗皱", "弹性恢复", "光老化修复",
  "私密菌群平衡", "黏膜屏障修复", "pH调节",
  "盆底支撑", "肌力恢复", "泌尿舒适", "黏膜润泽",
  "UTI防护", "抗粘附", "膀胱保护",
  "助眠", "GABA调节", "褪黑素",
  "护肝", "解酒", "肝细胞修复",
];

const EXPERIENCE_FORMULAS = [
  {
    id: "exp-wht-001",
    name: "口服美白提亮配方 V2.0",
    code: "FV-WHT-001",
    category: "口服美白提亮",
    ingredients: ["谷胱甘肽", "维生素C", "虾青素", "烟酰胺", "L-半胱氨酸"],
    status: "已验证",
    score: 8.5,
  },
  {
    id: "exp-acn-001",
    name: "口服祛痘净透配方 V5.0",
    code: "FV-ACN-001",
    category: "口服祛痘净透",
    ingredients: ["锌", "乳铁蛋白", "益生菌LGG", "烟酰胺", "DIM"],
    status: "已验证",
    score: 8.2,
  },
  {
    id: "exp-col-001",
    name: "口服胶原抗衰配方 V3.0",
    code: "FV-COL-001",
    category: "口服胶原抗衰",
    ingredients: ["胶原蛋白肽", "维生素C", "虾青素", "透明质酸钠", "辅酶Q10"],
    status: "已验证",
    score: 8.8,
  },
  {
    id: "exp-pel-001",
    name: "女性盆底生态营养配方 V1.2",
    code: "FV-PELVIC-001",
    category: "女性盆底健康",
    ingredients: ["盆力得®", "维生素C", "蔓越莓PAC", "D-甘露糖", "透明质酸钠", "乳酸菌GR-1"],
    status: "开发中",
    score: 8.2,
  },
  {
    id: "exp-mec-001",
    name: "女性私密微生态配方 V7.0",
    code: "FV-MEC-002",
    category: "女性私密微生态",
    ingredients: ["乳酸菌GR-1+RC-14", "蔓越莓PAC", "透明质酸钠", "维生素D3"],
    status: "已验证",
    score: 8.6,
  },
];

function NewProjectForm({
  onCancel,
  onCreate,
  initialName,
}: {
  onCancel: () => void;
  onCreate: (name: string, code: string) => void;
  initialName: string;
}) {
  const { projects } = useFormulatorStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: initialName,
    category: "",
    dosageForm: "",
    priceRange: "",
    markets: [] as string[],
    efficacies: [] as string[],
    specifiedIngredients: [] as string[],
    ingredientInput: "",
    selectedFormula: null as typeof EXPERIENCE_FORMULAS[0] | null,
    description: "",
  });

  const autoCode = (() => {
    if (!form.category) return "";
    const prefix = CATEGORY_CODE_MAP[form.category] || "NEW";
    const existing = projects.filter(p => p.code.startsWith(`FV-${prefix}-`)).length;
    return `FV-${prefix}-${String(existing + 1).padStart(3, "0")}`;
  })();

  const updateForm = (key: string, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const getCategoryEfficacies = (cat: string) => {
    if (cat.includes("美白")) return ["美白提亮", "淡斑", "抗氧化", "抗糖化"];
    if (cat.includes("祛痘")) return ["祛痘控油", "抗炎", "皮脂调节", "肠-皮轴修复"];
    if (cat.includes("胶原")) return ["胶原合成", "抗皱", "弹性恢复", "光老化修复"];
    if (cat.includes("私密")) return ["私密菌群平衡", "黏膜屏障修复", "pH调节"];
    if (cat.includes("盆底")) return ["盆底支撑", "肌力恢复", "泌尿舒适", "黏膜润泽"];
    if (cat.includes("UTI")) return ["UTI防护", "抗粘附", "膀胱保护"];
    if (cat.includes("助眠")) return ["助眠", "GABA调节", "褪黑素"];
    if (cat.includes("护肝")) return ["护肝", "解酒", "肝细胞修复"];
    return [];
  };

  const handleCategorySelect = (cat: string) => {
    updateForm("category", cat);
    updateForm("efficacies", getCategoryEfficacies(cat));
    if (!form.name) {
      updateForm("name", `${cat}配方`);
    }
    setTimeout(() => setStep(1), 300);
  };

  const handleAddIngredient = () => {
    const val = form.ingredientInput.trim();
    if (val && !form.specifiedIngredients.includes(val)) {
      updateForm("specifiedIngredients", [...form.specifiedIngredients, val]);
      updateForm("ingredientInput", "");
    }
  };

  const handleRemoveIngredient = (ing: string) => {
    updateForm("specifiedIngredients", form.specifiedIngredients.filter(i => i !== ing));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.category) return;
    const code = autoCode || "FV-NEW-001";
    onCreate(form.name.trim(), code);
  };

  const CATEGORY_CARDS = [
    { value: "口服美白提亮", icon: "✨", desc: "GSH/VC/光保护" },
    { value: "口服祛痘净透", icon: "🧴", desc: "控油/抗炎/屏障" },
    { value: "口服胶原抗衰", icon: "💎", desc: "胶原合成/弹性" },
    { value: "女性私密微生态", icon: "🌸", desc: "菌群/pH/屏障" },
    { value: "女性盆底健康", icon: "🏋️", desc: "盆底/肌力/润泽" },
    { value: "女性UTI防护", icon: "🛡️", desc: "抗粘附/膀胱" },
    { value: "口服助眠", icon: "🌙", desc: "GABA/放松" },
    { value: "口服护肝", icon: "�", desc: "解酒/保护" },
    { value: "口服关节养护", icon: "🦴", desc: "关节/抗炎" },
  ];

  const stepTitles = ["选择品类方向", "配置项目信息", "成分与偏好", "确认创建"];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header with progress */}
      <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
            )}
            <div>
              <h2 className="text-base font-semibold text-gray-900">{stepTitles[step]}</h2>
              <p className="text-xs text-gray-400">
                {step === 0 && "这将决定通路知识库和功效方向"}
                {step === 1 && "完善项目基本信息"}
                {step === 2 && "可选：指定成分或加载经验配方"}
                {step === 3 && "确认后进入10阶段标准开发流程"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {autoCode && (
              <span className="rounded-lg bg-brand-50 px-2.5 py-1 font-mono text-xs font-medium text-brand-700">{autoCode}</span>
            )}
            <button onClick={onCancel} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 flex gap-1.5">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-brand-500" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-6 py-8">

          {/* === Step 0: Category Selection === */}
          {step === 0 && (
            <div className="grid grid-cols-3 gap-3">
              {CATEGORY_CARDS.map(card => (
                <button
                  key={card.value}
                  onClick={() => handleCategorySelect(card.value)}
                  className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all hover:border-brand-400 hover:shadow-md ${
                    form.category === card.value
                      ? "border-brand-500 bg-brand-50 shadow-sm"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="text-3xl transition-transform group-hover:scale-110">{card.icon}</span>
                  <span className="text-sm font-medium text-gray-800">{card.value}</span>
                  <span className="text-[10px] text-gray-400">{card.desc}</span>
                </button>
              ))}
            </div>
          )}

          {/* === Step 1: Project Details === */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Selected category badge */}
              <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2">
                <span className="text-lg">{CATEGORY_CARDS.find(c => c.value === form.category)?.icon}</span>
                <span className="text-sm font-medium text-brand-800">{form.category}</span>
                <button onClick={() => setStep(0)} className="ml-auto text-xs text-brand-500 hover:text-brand-700">更换</button>
              </div>

              {/* Project Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">项目名称</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => updateForm("name", e.target.value)}
                  placeholder="例：女性口服美白提亮配方"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition hover:border-brand-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Dosage Form */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">剂型偏好</label>
                <div className="flex flex-wrap gap-2">
                  {DOSAGE_FORM_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateForm("dosageForm", form.dosageForm === opt ? "" : opt)}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                        form.dosageForm === opt
                          ? "border-brand-500 bg-brand-50 font-medium text-brand-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-brand-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-400">可在后续阶段调整</p>
              </div>

              {/* Target Markets */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">目标市场</label>
                <div className="flex flex-wrap gap-2">
                  {MARKET_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        const markets = form.markets.includes(opt.value)
                          ? form.markets.filter(v => v !== opt.value)
                          : [...form.markets, opt.value];
                        updateForm("markets", markets);
                      }}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                        form.markets.includes(opt.value)
                          ? "border-brand-500 bg-brand-50 font-medium text-brand-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-brand-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-400">多选，影响合规前置审查</p>
              </div>

              {/* Price Range */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">目标价格带</label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGE_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateForm("priceRange", form.priceRange === opt ? "" : opt)}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                        form.priceRange === opt
                          ? "border-brand-500 bg-brand-50 font-medium text-brand-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-brand-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === Step 2: Efficacy & Ingredients === */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Auto-selected efficacies */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">核心功效诉求</label>
                <p className="mb-2 text-xs text-gray-400">已根据品类自动选中，可增减</p>
                <div className="flex flex-wrap gap-1.5">
                  {EFFICACY_OPTIONS.map(e => {
                    const isRecommended = getCategoryEfficacies(form.category).includes(e);
                    if (!isRecommended && !form.efficacies.includes(e)) return null;
                    return (
                      <button
                        key={e}
                        type="button"
                        onClick={() => {
                          const effs = form.efficacies.includes(e)
                            ? form.efficacies.filter(v => v !== e)
                            : [...form.efficacies, e];
                          updateForm("efficacies", effs);
                        }}
                        className={`rounded-full border px-2.5 py-1 text-xs transition ${
                          form.efficacies.includes(e)
                            ? "border-brand-500 bg-brand-50 font-medium text-brand-700"
                            : "border-gray-200 text-gray-400 hover:border-brand-300"
                        }`}
                      >
                        {e}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specified Ingredients */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">指定配料（选填）</label>
                <p className="mb-2 text-xs text-gray-400">客户指定必须包含的成分，将在配方设计中优先纳入</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.ingredientInput}
                    onChange={e => updateForm("ingredientInput", e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddIngredient(); } }}
                    placeholder="输入成分名称，回车添加..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition hover:border-brand-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                  <button onClick={handleAddIngredient} className="shrink-0 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200">
                    添加
                  </button>
                </div>
                {form.specifiedIngredients.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.specifiedIngredients.map(ing => (
                      <span key={ing} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                        {ing}
                        <button onClick={() => handleRemoveIngredient(ing)} className="ml-0.5 rounded-full p-0.5 text-brand-400 transition hover:bg-brand-100 hover:text-brand-600">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Experience Formulas */}
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">调用经验配方（选填）</label>
                <p className="mb-3 text-xs text-gray-400">从历史配方中加载成分组合作为起点</p>
                <div className="space-y-2">
                  {EXPERIENCE_FORMULAS.filter(f => !form.category || f.category === form.category).map(formula => (
                    <div
                      key={formula.id}
                      className={`cursor-pointer rounded-xl border p-3 transition ${
                        form.selectedFormula?.id === formula.id
                          ? "border-brand-500 bg-brand-50 ring-1 ring-brand-200"
                          : "border-gray-200 bg-white hover:border-brand-300 hover:shadow-sm"
                      }`}
                      onClick={() => {
                        updateForm("selectedFormula", formula);
                        updateForm("specifiedIngredients", Array.from(new Set([...form.specifiedIngredients, ...formula.ingredients])));
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">{formula.name}</span>
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">{formula.code}</span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {formula.ingredients.map(ing => (
                              <span key={ing} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">{ing}</span>
                            ))}
                          </div>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          formula.status === "已验证" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        }`}>{formula.status}</span>
                      </div>
                    </div>
                  ))}
                  {form.category && EXPERIENCE_FORMULAS.filter(f => f.category === form.category).length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center">
                      <p className="text-sm text-gray-400">该品类暂无经验配方</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* === Step 3: Confirmation === */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/60 to-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl">{CATEGORY_CARDS.find(c => c.value === form.category)?.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{form.name || form.category}</h3>
                    <span className="font-mono text-sm text-brand-600">{autoCode}</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex gap-3 border-t border-brand-100 pt-3">
                    <span className="w-20 shrink-0 text-gray-400">品类</span>
                    <span className="font-medium text-gray-800">{form.category}</span>
                  </div>
                  {form.dosageForm && (
                    <div className="flex gap-3">
                      <span className="w-20 shrink-0 text-gray-400">剂型</span>
                      <span className="text-gray-700">{form.dosageForm}</span>
                    </div>
                  )}
                  {form.markets.length > 0 && (
                    <div className="flex gap-3">
                      <span className="w-20 shrink-0 text-gray-400">市场</span>
                      <span className="text-gray-700">{form.markets.map(m => MARKET_OPTIONS.find(o => o.value === m)?.label).join("、")}</span>
                    </div>
                  )}
                  {form.priceRange && (
                    <div className="flex gap-3">
                      <span className="w-20 shrink-0 text-gray-400">价格带</span>
                      <span className="text-gray-700">{form.priceRange}</span>
                    </div>
                  )}
                  {form.efficacies.length > 0 && (
                    <div className="flex gap-3">
                      <span className="w-20 shrink-0 text-gray-400">功效</span>
                      <div className="flex flex-wrap gap-1">
                        {form.efficacies.map(e => (
                          <span key={e} className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">{e}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {form.specifiedIngredients.length > 0 && (
                    <div className="flex gap-3">
                      <span className="w-20 shrink-0 text-gray-400">指定成分</span>
                      <div className="flex flex-wrap gap-1">
                        {form.specifiedIngredients.map(ing => (
                          <span key={ing} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">{ing}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {form.selectedFormula && (
                    <div className="flex gap-3">
                      <span className="w-20 shrink-0 text-gray-400">参考配方</span>
                      <span className="text-gray-700">{form.selectedFormula.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">创建后将进入 <strong>10阶段标准开发流程</strong></p>
                <p className="mt-1 text-xs text-gray-400">需求锚定 → 品类扫描 → 三层交付物 → 通路推导 → 成分筛选 → 合规 → 定型 → 审计 → 工程 → 提报</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {step > 0 && (
        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-white px-6 py-3">
          {step < 3 ? (
            <>
              {step === 2 && (
                <button
                  onClick={() => setStep(3)}
                  className="mr-auto text-xs text-gray-400 hover:text-gray-600"
                >
                  跳过，直接确认
                </button>
              )}
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !form.name.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                继续
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              创建项目
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}
          <button onClick={onCancel} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-500 transition hover:bg-gray-100">
            取消
          </button>
        </div>
      )}
    </div>
  );
}

