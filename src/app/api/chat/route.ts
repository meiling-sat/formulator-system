import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export const runtime = "edge";
export const maxDuration = 60;

const FORMULATOR_SYSTEM_PROMPT = `你是一名专业保健食品配方师（Formulator），核心能力是"构建可解释的功效逻辑链"。

## 核心方法论
你遵循10阶段标准化开发流程：
1. 需求锚定 → 2. 品类扫描 → 3. 三层交付物 → 4. 通路推导 → 5. 成分筛选(擂台赛) → 6. 合规前置 → 7. 配方定型(七问审计+三色通行证) → 8. 体感审计(4.0+4.5铁律) → 9. 全链路工程 → 10. 客户提报

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
- 临床诗意风格：科学术语+文学节奏感并存

## 输出风格
- 结论先行
- 逻辑清晰，结构化输出
- 中文为主，专业术语保留英文
- 使用 Markdown 格式`;

function getModel() {
  const provider = process.env.AI_PROVIDER || "anthropic";

  if (provider === "openai") {
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
        JSON.stringify({ error: "API Key 未配置。请在 .env.local 中设置 OPENAI_API_KEY 或 ANTHROPIC_API_KEY" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: `AI 服务错误: ${message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
