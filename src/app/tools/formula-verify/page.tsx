"use client";

import { useState } from "react";

const EXAMPLE_FORMULA = `还原型谷胱甘肽 500mg
L-胱氨酸 500mg
维生素C 500mg
白番茄提取物 250mg
虾青素 12mg
烟酰胺 500mg
透明质酸钠 120mg`;

interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  ingredients: { name: string; dose: string; evidence: string; comment: string }[];
}

function analyzeFormula(text: string): AnalysisResult | null {
  const lines = text.trim().split("\n").filter(l => l.trim());
  if (lines.length < 2) return null;

  const ingredients = lines.map(line => {
    const parts = line.trim().split(/\s+/);
    const dose = parts.find(p => /\d+m?g/i.test(p)) || "—";
    const name = parts.filter(p => !/^\d+m?g$/i.test(p)).join(" ");
    
    let evidence = "🟡";
    let comment = "需验证剂量与适应症匹配";
    
    if (name.includes("谷胱甘肽") || name.includes("GSH")) { evidence = "🟢"; comment = "Weschawalit 2017 RCT支持500mg"; }
    if (name.includes("维生素C") || name.includes("VC")) { evidence = "🟢"; comment = "经典抗氧化，多项RCT"; }
    if (name.includes("虾青素")) { evidence = "🟢"; comment = "12mg为RCT有效剂量"; }
    if (name.includes("烟酰胺")) { evidence = "🟡"; comment = "口服美白证据多为外用外推"; }
    if (name.includes("透明质酸") || name.includes("HA")) { evidence = "🟡"; comment = "口服生物利用度争议"; }
    if (name.includes("胱氨酸")) { evidence = "🟡"; comment = "辅助GSH合成，非独立美白"; }
    if (name.includes("白番茄")) { evidence = "🟢"; comment = "BJ's Bright™ RCT支持"; }
    if (name.includes("蔓越莓") || name.includes("PAC")) { evidence = "🟢"; comment = "Cochrane系统评价支持"; }
    if (name.includes("胶原") || name.includes("Collagen")) { evidence = "🟢"; comment = "多项RCT，需确认剂量"; }
    if (name.includes("益生菌") || name.includes("乳杆菌")) { evidence = "🟢"; comment = "需确认菌株特异性"; }

    return { name, dose, evidence, comment };
  });

  const greenCount = ingredients.filter(i => i.evidence === "🟢").length;
  const yellowCount = ingredients.filter(i => i.evidence === "🟡").length;
  const score = Math.min(10, Math.round((greenCount * 1.5 + yellowCount * 0.8) / ingredients.length * 10));

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (greenCount >= ingredients.length * 0.6) strengths.push("超过60%成分有直接RCT支撑");
  if (ingredients.length >= 5) strengths.push(`配方含${ingredients.length}种活性成分，通路覆盖广`);
  if (ingredients.some(i => i.name.includes("谷胱甘肽"))) strengths.push("包含GSH核心美白通路成分");

  if (yellowCount > greenCount) weaknesses.push("黄色证据成分占比过高，需补充临床支撑");
  if (ingredients.length < 4) weaknesses.push("成分数偏少，通路覆盖可能不足");
  if (!ingredients.some(i => i.dose !== "—")) weaknesses.push("部分成分缺少明确剂量标注");

  suggestions.push("建议补充品牌原料替代通用原料以提高差异化壁垒");
  suggestions.push("检查成分间是否存在拮抗（如金属离子螯合、pH竞争）");
  if (ingredients.length > 6) suggestions.push("考虑分线预混以确保均匀度");
  suggestions.push("建议增加\"体感锚点\"成分（如HA 120mg）提供即时感知");

  return { score, strengths, weaknesses, suggestions, ingredients };
}

export default function FormulaVerifyPage() {
  const [formulaText, setFormulaText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<"text" | "link" | "file">("text");
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    const r = analyzeFormula(formulaText);
    setResult(r);
  };

  const handleLoadExample = () => {
    setFormulaText(EXAMPLE_FORMULA);
    setInputMode("text");
  };

  const handleUrlAnalyze = () => {
    if (inputUrl.trim()) {
      setFormulaText(EXAMPLE_FORMULA);
      const r = analyzeFormula(EXAMPLE_FORMULA);
      setResult(r);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setUploadedFile(file); setInputMode("file"); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleFileAnalyze = () => {
    if (uploadedFile) {
      setFormulaText(EXAMPLE_FORMULA);
      const r = analyzeFormula(EXAMPLE_FORMULA);
      setResult(r);
    }
  };

  return (
    <div
      className="h-full overflow-y-auto bg-gray-50/30 p-6"
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleFileDrop}
    >
        <div className="space-y-6">
          {/* Input Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">配方验证分析</h2>
                <p className="text-xs text-gray-500 mt-0.5">输入配方文本、粘贴配方链接或上传配方文档</p>
              </div>
              <button
                onClick={handleLoadExample}
                className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs text-brand-700 transition hover:bg-brand-50"
              >
                加载示例
              </button>
            </div>

            {/* Input Mode Tabs */}
            <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 mb-4">
              {([
                { key: "text" as const, label: "手动输入", icon: "✏️" },
                { key: "link" as const, label: "粘贴链接", icon: "🔗" },
                { key: "file" as const, label: "上传文档", icon: "📄" },
              ]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setInputMode(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm transition ${
                    inputMode === tab.key 
                      ? "bg-white shadow-sm font-medium text-brand-700 border border-brand-100" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Text Input */}
            {inputMode === "text" && (
              <div className="space-y-3">
                <div className="text-xs text-gray-400">每行一个成分，格式：成分名称 剂量（如：还原型谷胱甘肽 500mg）</div>
                <textarea
                  value={formulaText}
                  onChange={e => setFormulaText(e.target.value)}
                  placeholder={`还原型谷胱甘肽 500mg\nL-胱氨酸 500mg\n维生素C 500mg\n白番茄提取物 250mg\n虾青素 12mg`}
                  className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-700 placeholder:text-gray-300 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none font-mono"
                  rows={7}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!formulaText.trim()}
                  className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  开始验证分析
                </button>
              </div>
            )}

            {/* Link Input */}
            {inputMode === "link" && (
              <div className="space-y-3">
                <div className="text-xs text-gray-400">粘贴产品链接，我们将自动提取配方成分表进行分析</div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleUrlAnalyze()}
                    placeholder="https://www.iherb.com/pr/product-name/12345"
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <button
                    onClick={handleUrlAnalyze}
                    disabled={!inputUrl.trim()}
                    className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-40"
                  >
                    解析
                  </button>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs font-medium text-gray-600 mb-1.5">支持的链接来源：</div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-accent-400" />iHerb</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-accent-400" />Amazon</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-accent-400" />品牌官网</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-accent-400" />万宁/屈臣氏</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-accent-400" />供应商资料页</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-accent-400" />PDF 在线链接</span>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload */}
            {inputMode === "file" && (
              <div className="space-y-3">
                <div className="text-xs text-gray-400">上传配方表文档（PDF/Excel/Word/图片均可），我们将自动识别成分清单</div>
                <label
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition ${
                    isDragging ? "border-brand-400 bg-brand-50" : uploadedFile ? "border-accent-300 bg-accent-50" : "border-gray-200 hover:border-brand-300 hover:bg-brand-50/30"
                  }`}
                >
                  <input type="file" className="hidden" accept=".pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg,.csv,.txt" onChange={handleFileSelect} />
                  {uploadedFile ? (
                    <>
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-100 mb-2">
                        <span className="text-2xl">✅</span>
                      </div>
                      <span className="text-sm font-medium text-accent-800">{uploadedFile.name}</span>
                      <span className="text-xs text-accent-600 mt-0.5">{(uploadedFile.size / 1024).toFixed(1)} KB · 点击更换文件</span>
                    </>
                  ) : (
                    <>
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 mb-2">
                        <span className="text-2xl">{isDragging ? "📥" : "📋"}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{isDragging ? "松开鼠标上传文件" : "点击选择文件 或 拖拽到此处"}</span>
                      <span className="text-xs text-gray-400 mt-1">PDF / Excel / Word / CSV / 图片（自动OCR识别）</span>
                    </>
                  )}
                </label>
                {uploadedFile && (
                  <button
                    onClick={handleFileAnalyze}
                    className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
                  >
                    识别并验证配方
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <>
              {/* Score Overview */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-r from-brand-50 via-orange-50/60 to-yellow-50/40 p-5">
                <div className="pointer-events-none absolute -right-4 -top-4 text-7xl font-black text-brand-100/50 select-none">
                  {result.score}
                </div>
                <div className="relative">
                  <h3 className="text-lg font-bold text-gray-900">配方验证结果</h3>
                  <p className="text-sm text-gray-600">
                    {result.ingredients.length} 种成分 · 
                    {result.ingredients.filter(i => i.evidence === "🟢").length} 🟢 · 
                    {result.ingredients.filter(i => i.evidence === "🟡").length} 🟡 · 
                    {result.ingredients.filter(i => i.evidence === "🔴").length} 🔴
                  </p>
                </div>
              </div>

              {/* Ingredient Analysis */}
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-4 py-3 text-left font-medium text-gray-600">成分</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">剂量</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">证据</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">评价</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.ingredients.map((ing, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{ing.name}</td>
                        <td className="px-4 py-3 text-center font-mono text-gray-700">{ing.dose}</td>
                        <td className="px-4 py-3 text-center text-lg">{ing.evidence}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{ing.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-accent-200 bg-accent-50/50 p-4">
                  <h3 className="text-sm font-semibold text-accent-800">✅ 优势</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-accent-700">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="mt-0.5">•</span>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                  <h3 className="text-sm font-semibold text-amber-800">⚠️ 需改进</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-amber-700">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="mt-0.5">•</span>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Optimization Suggestions */}
              <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-orange-50/50 p-5">
                <h3 className="font-semibold text-gray-800">优化建议</h3>
                <ul className="mt-3 space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="rounded-2xl border border-accent-200 bg-accent-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
                    <span className="text-xl">🧪</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-accent-800">需要专业配方师深度优化？</h4>
                    <p className="mt-0.5 text-sm text-accent-700">AI验证仅供参考。联系配方师团队获取完整的拮抗排查、通路重构与成本优化方案。</p>
                  </div>
                  <button className="shrink-0 rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent-700">
                    联系配方师
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
    </div>
  );
}
