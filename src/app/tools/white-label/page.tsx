"use client";

import { useState } from "react";

const PRODUCTS = [
  {
    id: "WL-001",
    name: "口服美白提亮粉",
    category: "美白",
    form: "粉剂 5.8g/条",
    spec: "30条/盒",
    keyIngredients: "GSH 500mg + Fernblock® 240mg + 虾青素 12mg",
    pathways: 3,
    ingredientCount: 9,
    moq: "1000盒",
    leadTime: "30天",
    certifications: ["GMP", "ISO22000", "HACCP"],
    markets: ["香港", "跨境"],
    highlight: "三核一锚配方 · 零🔴 · 8/9成分100%RCT剂量",
    price: "询价",
  },
  {
    id: "WL-002",
    name: "女性私密微生态胶囊",
    category: "私密护理",
    form: "胶囊 600mg/粒",
    spec: "60粒/瓶",
    keyIngredients: "Cran-Max® PAC + GR-1/RC-14乳杆菌 + 乳铁蛋白",
    pathways: 4,
    ingredientCount: 7,
    moq: "500瓶",
    leadTime: "25天",
    certifications: ["GMP", "ISO22000"],
    markets: ["香港", "内地", "跨境"],
    highlight: "四层防线 · 专利菌株 · 三市场合规",
    price: "询价",
  },
  {
    id: "WL-003",
    name: "盆底生态营养粉",
    category: "盆底健康",
    form: "粉剂 6.2g/条",
    spec: "30条/盒",
    keyIngredients: "盆力得® + Peptan® IIm 5g + CoQ10 200mg",
    pathways: 4,
    ingredientCount: 8,
    moq: "800盒",
    leadTime: "35天",
    certifications: ["GMP", "ISO22000", "HACCP"],
    markets: ["香港"],
    highlight: "四维联动 · 全品牌原料 · 全通路覆盖",
    price: "询价",
  },
  {
    id: "WL-004",
    name: "口服祛痘净透饮",
    category: "祛痘",
    form: "口服液 50ml/瓶",
    spec: "10瓶/盒",
    keyIngredients: "锌 15mg + 益生菌100亿CFU + 姜黄素 500mg",
    pathways: 3,
    ingredientCount: 6,
    moq: "1000盒",
    leadTime: "28天",
    certifications: ["GMP", "ISO22000"],
    markets: ["香港", "跨境"],
    highlight: "皮脂调控+肠肌轴+抗炎三通路 · 即饮便携",
    price: "询价",
  },
  {
    id: "WL-005",
    name: "胶原抗衰口服粉",
    category: "胶原",
    form: "粉剂 7g/条",
    spec: "30条/盒",
    keyIngredients: "Peptan® F 5000mg + 弹性蛋白肽 + CoQ10 + VC",
    pathways: 3,
    ingredientCount: 7,
    moq: "800盒",
    leadTime: "30天",
    certifications: ["GMP", "ISO22000", "HACCP"],
    markets: ["香港", "内地", "跨境"],
    highlight: "5g全剂量胶原 + 弹性蛋白双效 · 法国Rousselot品牌",
    price: "询价",
  },
  {
    id: "WL-006",
    name: "女性泌尿舒护片",
    category: "泌尿健康",
    form: "片剂 800mg/片",
    spec: "60片/瓶",
    keyIngredients: "Cran-Max® + D-甘露糖 2g + 维生素D3",
    pathways: 3,
    ingredientCount: 5,
    moq: "500瓶",
    leadTime: "25天",
    certifications: ["GMP", "ISO22000"],
    markets: ["香港", "跨境"],
    highlight: "双重抗黏附 + 免疫屏障 · Cochrane循证路线",
    price: "询价",
  },
];

const CATEGORIES = ["全部", "美白", "私密护理", "盆底健康", "祛痘", "胶原", "泌尿健康"];

export default function WhiteLabelPage() {
  const [filter, setFilter] = useState("全部");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const filtered = filter === "全部" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  const selected = PRODUCTS.find(p => p.id === selectedProduct);

  return (
    <div className="h-full overflow-y-auto bg-gray-50/30 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">贴牌产品目录</h2>
            <p className="text-sm text-gray-500">共 {filtered.length} 款成品配方 · 已通过全链路验证 · 可直接OEM贴牌</p>
          </div>
          <div className="flex items-center gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs transition ${
                  filter === cat ? "bg-brand-100 text-brand-700 font-medium" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.map(product => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
              className={`cursor-pointer rounded-2xl border bg-white p-5 transition hover:shadow-md ${
                selectedProduct === product.id ? "border-brand-300 ring-1 ring-brand-200" : "border-gray-200 hover:border-brand-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-brand-100 px-2 py-0.5 text-[10px] font-mono font-bold text-brand-700">{product.id}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{product.highlight}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-700">可贴牌</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">{product.form}</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">{product.spec}</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">{product.ingredientCount}种成分</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">{product.pathways}条通路</span>
                {product.markets.map(m => (
                  <span key={m} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">{m}</span>
                ))}
              </div>

              {selectedProduct === product.id && (
                <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-[10px] text-gray-500">核心成分</div>
                      <div className="mt-0.5 text-sm text-gray-800">{product.keyIngredients}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500">MOQ / 交期</div>
                      <div className="mt-0.5 text-sm text-gray-800">{product.moq} / {product.leadTime}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500">认证</div>
                      <div className="mt-0.5 flex gap-1">
                        {product.certifications.map(c => (
                          <span key={c} className="rounded bg-accent-100 px-1.5 py-0.5 text-[10px] font-medium text-accent-700">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:shadow-md">
                      询价 / 索取样品
                    </button>
                    <button className="rounded-xl border border-brand-200 px-5 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50">
                      查看完整配方表
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
    </div>
  );
}
