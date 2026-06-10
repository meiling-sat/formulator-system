# Formulator System — 部署指南

## 架构概述

```
┌─────────────────────────────────────────────────┐
│                  Vercel (托管)                    │
├─────────────────────────────────────────────────┤
│  Next.js 14 App                                  │
│  ├── /app (前端页面)                             │
│  ├── /api/chat (AI 对话 → Claude/OpenAI)        │
│  └── localStorage (客户端数据持久化)             │
├─────────────────────────────────────────────────┤
│  环境变量:                                       │
│  - ANTHROPIC_API_KEY 或 OPENAI_API_KEY           │
│  - AI_PROVIDER (anthropic/openai)                │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│  Claude API / OpenAI API (外部)                  │
│  配方师推理 · 方案生成 · 品类分析                │
└─────────────────────────────────────────────────┘
```

## 快速部署到 Vercel

### 前提条件
1. GitHub 账号
2. Vercel 账号 (https://vercel.com)
3. Claude API Key 或 OpenAI API Key

### 步骤

#### 1. 推送代码到 GitHub
```bash
cd formulator-system
git init
git add .
git commit -m "Initial commit - Formulator System"
git remote add origin https://github.com/YOUR_USERNAME/formulator-system.git
git push -u origin main
```

#### 2. 在 Vercel 导入项目
1. 登录 https://vercel.com
2. 点击 "Add New → Project"
3. 导入你的 GitHub 仓库
4. Framework 自动检测为 Next.js

#### 3. 配置环境变量
在 Vercel 项目设置 → Environment Variables 中添加：

| Key | Value | 说明 |
|-----|-------|------|
| `AI_PROVIDER` | `anthropic` | 或 `openai` |
| `ANTHROPIC_API_KEY` | `sk-ant-xxx...` | Anthropic API Key |
| `OPENAI_API_KEY` | `sk-xxx...` | OpenAI API Key (如用 OpenAI) |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-20250514` | 可选，指定模型 |

#### 4. 部署
点击 Deploy，等待构建完成。Vercel 会自动分配一个 `.vercel.app` 域名。

## 本地开发

```bash
# 安装依赖
npm install

# 复制环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 API Key

# 启动开发服务器
npm run dev
# 访问 http://localhost:3100
```

## API Key 获取

### Claude (推荐)
1. 访问 https://console.anthropic.com/
2. 注册/登录
3. 进入 API Keys 页面
4. 创建新的 Key

### OpenAI
1. 访问 https://platform.openai.com/api-keys
2. 注册/登录
3. 创建新的 Key

## 自定义域名

在 Vercel 项目设置 → Domains 中添加你的域名，按提示配置 DNS。

## 未来升级路径

| 功能 | 当前 | 下一步 |
|------|------|--------|
| 数据存储 | localStorage | Supabase PostgreSQL |
| 用户认证 | 无 | Supabase Auth / NextAuth |
| 文件上传 | 无 | Vercel Blob / S3 |
| AI 模型 | 单模型 | 多模型切换 + 本地模型 |
| 协作 | 单用户 | 多用户 + 权限 |
