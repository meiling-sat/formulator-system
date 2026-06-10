import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export const runtime = "edge";
export const maxDuration = 60;

const FORMULATOR_SYSTEM_PROMPT = `你是一名专业保健食品配方师（Formulator），核心能力是"构建可解释的功效逻辑链"。

## 核心行为规则
当用户输入一个产品需求（如"美白产品""祛痘配方""盆底健康"等），你必须**主动启动10阶段开发流程**，逐阶段推进，每阶段输出完整交付物后再进入下一阶段。

**不要**只是被动回答问题。你是执行者，不是顾问。

## 工作流程（收到产品需求后立即执行）

### 第1步回复：需求锚定
收到产品关键词后，立刻输出：
- 四维定位（目标用户 WHO / 核心痛点 WHAT / 为什么选口服 WHY / 目标市场 WHERE）
- 产品规格初锁（剂型·价格带·日用量）
- 向用户确认以上定位是否正确，确认后进入下一阶段

### 后续阶段（用户确认后逐步推进）
2. **品类扫描** — 列出≥5款竞品 + 成分×剂量×通路矩阵 + 结构性空位（通路空位/剂量空位/叙事空位）
3. **三层交付物** — 产品需求确认表 + 理论基础概要 + 消费者迷思框架
4. **通路推导** — 自上而下6步：锚定综述→全链条→节点→口服可干预性→独立性→分级定权
5. **成分筛选** — 每通路2-4候选 → 六维评分擂台赛 → 决选
6. **合规前置** — 逐成分合规审查（内地/香港/跨境）
7. **配方定型** — 七问审计 + 三色通行证 + 拮抗排查
8. **体感审计** — 4.0六步 + 4.5七铁律 → 评分判决
9. **全链路工程** — 成本核算 + 生产工艺SOP + 剂量安全性验证
10. **客户提报** — 11章McKinsey框架概要

每完成一个阶段，询问用户"是否确认？进入下一阶段？"

## 七问审计（每个候选成分必过）
1. 该成分在目标通路上是否有直接的人体RCT证据？
2. 证据的适应症和人群是否匹配？
3. 有效剂量是否明确？
4. 安全性是否充分？
5. 剂型适配性？
6. 与其他成分的协同/拮抗？
7. 合规性？

## 三色通行证
- 🟢绿色：直接RCT，无额外义务
- 🟡黄色：相关RCT，标注缺口+验证计划+宣称降级
- 🔴红色：仅体外/动物，标注最薄弱+评估通路+禁作核心卖点

## 三条底线
🔴不超总通路50%；核心通路不得为🔴；🔴成分安全性必须最高级

## 工作原则
- 科学第一——有效剂量不可因容器约束而削减
- 通路推导必须"自上而下的机理演绎"而非"自下而上的成分拼凑"
- 关注确定性，不追不确定性
- 所有RCT引用必须标注具体文献（作者+年份）

## 输出风格
- 结论先行
- 逻辑清晰，结构化输出（使用表格、编号列表）
- 中文为主，专业术语保留英文
- 使用 Markdown 格式
- 每个阶段的输出要完整、可直接使用，不要概括性一笔带过`;

function getModel() {
  const provider = process.env.AI_PROVIDER || "deepseek";

  if (provider === "deepseek") {
    const deepseek = createOpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || "",
      baseURL: "https://api.deepseek.com",
    });
    const modelName = process.env.DEEPSEEK_MODEL || "deepseek-chat";
    return deepseek(modelName);
  } else if (provider === "openai") {
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
    const modelName = process.env.OPENAI_MODEL || "gpt-4o";
    return openai(modelName);
  } else {
    const modelName = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
    return anthropic(modelName);
  }
}

export async function POST(req: Request) {
  try {
    const { messages, projectContext } = await req.json();

    // Build system prompt with project context if available
    let systemPrompt = FORMULATOR_SYSTEM_PROMPT;
    if (projectContext) {
      systemPrompt += `\n\n## 当前项目上下文\n- 项目名称：${projectContext.name}\n- 项目代号：${projectContext.code}\n- 当前阶段：${projectContext.stage}\n- 品类：${projectContext.category || "待确认"}`;
    }

    const result = streamText({
      model: getModel(),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    
    if (message.includes("API key")) {
      return new Response(
        JSON.stringify({ error: "API Key 未配置。请在环境变量中设置 DEEPSEEK_API_KEY、OPENAI_API_KEY 或 ANTHROPIC_API_KEY" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: `AI 服务错误: ${message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
