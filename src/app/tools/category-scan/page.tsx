"use client";

import { useState } from "react";

// Category-specific competitive data
const CATEGORY_DATA: Record<string, { competitors: any[]; insights: string[] }> = {
  "口服美白": {
    competitors: [
      { brand: "POLA", product: "White Shot Inner Lock", price: "¥4,860", market: "日本", keyIngredients: "南洋杉提取物、甜瓜SOD", dose: "2粒/日", highlight: "独家抗糖化机理" },
      { brand: "FANCL", product: "White Force", price: "¥2,280", market: "日本", keyIngredients: "L-胱氨酸240mg、VC", dose: "6粒/日", highlight: "维生素协同美白" },
      { brand: "Transino", product: "White C Clear", price: "¥2,860", market: "日本", keyIngredients: "L-胱氨酸240mg、VC1000mg、B族", dose: "4粒/日", highlight: "OTC药品级，日本药妆店NO.1" },
      { brand: "HAKU", product: "Inner Mellow White", price: "HKD 580", market: "香港", keyIngredients: "GSH 250mg、虾青素4mg", dose: "2粒/日", highlight: "资生堂集团，品牌溢价" },
      { brand: "Swisse", product: "Radiant Skin", price: "HKD 298", market: "香港", keyIngredients: "血橙、VC、葡萄籽", dose: "1片/日", highlight: "大众渠道，价格亲民" },
      { brand: "Heliocare", product: "Oral Capsules", price: "HKD 420", market: "香港", keyIngredients: "Fernblock® 480mg", dose: "2粒/日", highlight: "皮肤科渠道，光保护定位" },
    ],
    insights: [
      "日本市场以L-胱氨酸+VC为主流，但GSH类新品增长快",
      "香港市场品牌原料溢价明显（Fernblock®、Astaxanthin）",
      "价格带：日本¥2,000-5,000 / 香港HKD 280-600",
      "竞品普遍缺乏\"双重源头截流\"系统性通路设计",
      "口服光保护（Fernblock®/白番茄）是增长最快细分",
    ],
  },
  "口服胶原": {
    competitors: [
      { brand: "明治", product: "Amino Collagen Premium", price: "¥3,240", market: "日本", keyIngredients: "鱼胶原5000mg、CoQ10、VC", dose: "1勺/日", highlight: "日本销量NO.1胶原粉" },
      { brand: "FANCL", product: "Deep Charge Collagen", price: "¥1,944", market: "日本", keyIngredients: "HTC胶原肽、VC", dose: "6粒/日", highlight: "专利HTC胶原" },
      { brand: "资生堂", product: "The Collagen EXR", price: "¥4,320", market: "日本", keyIngredients: "鱼胶原1000mg、辅酶Q10、莲子", dose: "1瓶/日", highlight: "口服液，高端定位" },
      { brand: "Laneige", product: "Collagen Drink", price: "HKD 480", market: "香港", keyIngredients: "鱼胶原3000mg、弹性蛋白", dose: "1瓶/日", highlight: "韩系品牌加持" },
      { brand: "Vida Glow", product: "Natural Marine Collagen", price: "HKD 620", market: "香港", keyIngredients: "海洋胶原肽2.5g", dose: "1条/日", highlight: "澳洲网红品牌" },
    ],
    insights: [
      "日本市场胶原肽平均剂量5000mg+，香港市场普遍偏低(1000-3000mg)",
      "高端趋势：从单纯胶原→胶原+抗氧化+辅酶Q10协同",
      "价格带：日本¥1,500-4,500 / 香港HKD 380-650",
      "竞品普遍缺乏'刺激自生胶原'通路设计，仅为外源补充",
      "缺乏RCT级临床验证是行业通病",
    ],
  },
  "私密护理": {
    competitors: [
      { brand: "DHC", product: "女性乳酸菌", price: "¥1,620", market: "日本", keyIngredients: "嗜酸乳杆菌、蔓越莓", dose: "2粒/日", highlight: "大众价位，日本药妆" },
      { brand: "AXXZIA", product: "Inner Beauty Flora", price: "¥5,400", market: "日本", keyIngredients: "专利乳酸菌KT-11、蔓越莓PAC", dose: "1粒/日", highlight: "高端定位" },
      { brand: "Femelle", product: "私密益生菌", price: "HKD 380", market: "香港", keyIngredients: "GR-1/RC-14乳杆菌", dose: "1粒/日", highlight: "专利菌株" },
      { brand: "Ellura", product: "UTI Prevention", price: "HKD 450", market: "香港", keyIngredients: "PAC 36mg(A-type)", dose: "1粒/日", highlight: "Cochrane验证" },
      { brand: "YourFlora", product: "女性私密胶囊", price: "HKD 320", market: "香港", keyIngredients: "混合乳酸菌50亿CFU", dose: "1粒/日", highlight: "本地品牌" },
    ],
    insights: [
      "日本市场分层明确：大众(DHC)vs高端(AXXZIA)",
      "香港市场以功能性菌株为卖点(GR-1/RC-14)",
      "PAC 36mg(A-type)已成为UTI预防的金标准",
      "竞品普遍为单一益生菌路线，缺乏多通路协同",
      "市场空白：无产品整合'菌群+黏膜+免疫'三维防线",
    ],
  },
};

const AVAILABLE_CATEGORIES = Object.keys(CATEGORY_DATA);

export default function CategoryScanPage() {
  const [inputCategory, setInputCategory] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<"text" | "link" | "file">("text");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [marketFilter, setMarketFilter] = useState<"all" | "日本" | "香港">("all");
  const [isDragging, setIsDragging] = useState(false);

  const data = selectedCategory ? CATEGORY_DATA[selectedCategory] : null;
  const competitors = data?.competitors.filter(c => marketFilter === "all" || c.market === marketFilter) ?? [];

  const handleSearch = () => {
    const match = AVAILABLE_CATEGORIES.find(c => inputCategory.includes(c) || c.includes(inputCategory));
    if (match) setSelectedCategory(match);
    else if (inputCategory) setSelectedCategory(AVAILABLE_CATEGORIES[0]);
  };

  const handleUrlSubmit = () => {
    if (inputUrl.trim()) setSelectedCategory(AVAILABLE_CATEGORIES[0]);
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

  const handleFileSubmit = () => {
    if (uploadedFile) setSelectedCategory(AVAILABLE_CATEGORIES[0]);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50/30 p-6">
        {!selectedCategory ? (
          /* Landing / Multi-input */
          <div className="flex h-full items-center justify-center"
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
          >
            <div className="w-full max-w-lg">
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-orange-100">
                  <span className="text-3xl">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">品类竞品分析</h2>
                <p className="mt-2 text-sm text-gray-500">输入品类关键词、粘贴竞品链接或上传资料，获取日本与香港市场深度分析</p>
              </div>

              {/* Input Mode Tabs */}
              <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 mb-4">
                {([
                  { key: "text" as const, label: "输入品类", icon: "✏️" },
                  { key: "link" as const, label: "粘贴链接", icon: "🔗" },
                  { key: "file" as const, label: "上传文档", icon: "📄" },
                ]).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setInputMode(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm transition ${
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

              {/* Input Area */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                {inputMode === "text" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">你的产品品类是什么？</label>
                      <p className="text-xs text-gray-400 mt-0.5">输入品类关键词，我们将匹配日本与香港竞品数据</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputCategory}
                        onChange={e => setInputCategory(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSearch()}
                        placeholder="例如：口服美白、胶原蛋白、私密护理..."
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      />
                      <button
                        onClick={handleSearch}
                        disabled={!inputCategory.trim()}
                        className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-40"
                      >
                        分析
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-gray-400">快速选择：</span>
                      {AVAILABLE_CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className="rounded-full border border-brand-200 bg-brand-50/50 px-3 py-1 text-xs text-brand-700 transition hover:bg-brand-100"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {inputMode === "link" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">粘贴竞品产品链接</label>
                      <p className="text-xs text-gray-400 mt-0.5">支持 iHerb、Amazon、品牌官网等产品页面链接</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={inputUrl}
                        onChange={e => setInputUrl(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleUrlSubmit()}
                        placeholder="https://www.iherb.com/pr/..."
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      />
                      <button
                        onClick={handleUrlSubmit}
                        disabled={!inputUrl.trim()}
                        className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-40"
                      >
                        解析
                      </button>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                      <div className="font-medium text-gray-600 mb-1">支持的链接类型：</div>
                      <div className="grid grid-cols-2 gap-1">
                        <span>• iHerb 产品页</span>
                        <span>• Amazon 产品页</span>
                        <span>• 品牌独立站</span>
                        <span>• 万宁/屈臣氏</span>
                      </div>
                    </div>
                  </div>
                )}

                {inputMode === "file" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">上传竞品资料或成分表</label>
                      <p className="text-xs text-gray-400 mt-0.5">支持 PDF、Excel、图片、Word 格式</p>
                    </div>
                    <label
                      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition ${
                        isDragging ? "border-brand-400 bg-brand-50" : uploadedFile ? "border-accent-300 bg-accent-50" : "border-gray-200 hover:border-brand-300 hover:bg-brand-50/30"
                      }`}
                    >
                      <input type="file" className="hidden" accept=".pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileSelect} />
                      {uploadedFile ? (
                        <>
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 mb-2">
                            <span className="text-xl">✅</span>
                          </div>
                          <span className="text-sm font-medium text-accent-800">{uploadedFile.name}</span>
                          <span className="text-xs text-accent-600 mt-0.5">{(uploadedFile.size / 1024).toFixed(1)} KB · 点击更换文件</span>
                        </>
                      ) : (
                        <>
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 mb-2">
                            <span className="text-xl">{isDragging ? "📥" : "📄"}</span>
                          </div>
                          <span className="text-sm text-gray-600">{isDragging ? "松开鼠标上传" : "点击选择文件或拖拽到此处"}</span>
                          <span className="text-xs text-gray-400 mt-1">PDF / Excel / Word / 图片</span>
                        </>
                      )}
                    </label>
                    {uploadedFile && (
                      <button
                        onClick={handleFileSubmit}
                        className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
                      >
                        开始分析
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCategory} · 竞品分析报告</h2>
                <p className="text-sm text-gray-500">
                  {marketFilter === "all" ? "日本+香港" : marketFilter}市场 · {competitors.length} 款竞品
                </p>
              </div>
              <div className="flex items-center gap-2">
                {(["all", "日本", "香港"] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMarketFilter(m)}
                    className={`rounded-lg px-3 py-1.5 text-xs transition ${
                      marketFilter === m ? "bg-brand-100 text-brand-700 font-medium" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {m === "all" ? "🌏 全部" : m === "日本" ? "🇯🇵 日本" : "🇭🇰 香港"}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50"
                >
                  换品类
                </button>
              </div>
            </div>

            {/* Competitor Table */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gradient-to-r from-brand-50/50 to-orange-50/30">
                    <th className="px-4 py-3 text-left font-medium text-gray-600">品牌</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">产品</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">核心成分</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">用法</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">市场</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">价格</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((comp, i) => (
                    <tr key={i} className="border-b border-gray-50 transition hover:bg-brand-50/30">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{comp.brand}</div>
                        <div className="text-[10px] text-gray-400">{comp.highlight}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{comp.product}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px]">{comp.keyIngredients}</td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">{comp.dose}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                          comp.market === "日本" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                        }`}>{comp.market === "日本" ? "🇯🇵" : "🇭🇰"} {comp.market}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-gray-800">{comp.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Market Insights */}
            {data && (
              <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-orange-50/50 p-5">
                <h3 className="font-semibold text-gray-800">市场洞察与结构性空位</h3>
                <ul className="mt-3 space-y-2">
                  {data.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5 shrink-0 text-brand-500">●</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-2xl border border-accent-200 bg-accent-50 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
                  <span className="text-xl">💡</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-accent-800">需要定制化竞品深度分析？</h4>
                  <p className="mt-0.5 text-sm text-accent-700">联系配方师团队获取包含专利分析、供应链对比、价格策略的完整竞品报告</p>
                </div>
                <button className="shrink-0 rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent-700">
                  联系团队
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
