# AI智能获客平台

AI智能获客平台是一个面向外贸企业的开源 SaaS 原型，目标是把客户搜索、线索核验、联系方式补全、英文开发信生成和 CRM 跟进集中到一个工作台里。

当前版本：`v0.11.0`

## 核心模块

- 仪表盘：展示客户、线索、商机、待办、转化率和 AI 推荐跟进。
- AI获客中心：预留智能搜索、高级搜客、线索发现、批量开发、多渠道获客等入口。
- 社媒线索：预留 LinkedIn、Facebook、TikTok 公开线索入口。
- 客户管理：客户列表、公海池、客户分类看板。
- 营销中心：邮件营销、WhatsApp、社媒营销和自动化流程。
- 数据分析：客户分析、销售分析和获客效率分析。
- 系统设置：API Key、团队、系统参数和数据管理。

## v0.11 更新

- 修复登录页、侧边栏、仪表盘首屏中文乱码。
- 优化演示模式入口，没有 Supabase 配置也能进入工作台查看效果。
- 重写仪表盘演示数据，让推荐理由、跟进建议和最近动态更贴近外贸获客场景。
- 修复网页标题和 README 乱码。
- 保留 Supabase 正式账号登录接口，后续配置数据库后可以继续接入正式登录。

## 预留获客 API

```text
POST /api/integrations/lead-search
```

请求示例：

```json
{
  "product": "custom cabinets",
  "country": "Australia",
  "customerType": "Builder + Designer",
  "quantity": 20,
  "provider": "auto",
  "query": "Australia custom cabinets builder contact"
}
```

当前默认使用 mock provider，方便开源项目直接运行。后续接入 Google、SerpAPI、Bing 或其他数据服务时，可以替换 `src/lib/integrations/lead-search-provider.ts` 中的实现。

## 预留 OpenAI API

```text
POST /api/integrations/openai
```

请求示例：

```json
{
  "task": "write_email",
  "prompt": "Write a short English outreach email for an Australian kitchen company.",
  "context": {
    "product": "custom cabinets",
    "customerType": "Kitchen Company"
  }
}
```

没有配置 `OPENAI_API_KEY` 时接口会返回 mock 内容；配置后可以在 `src/lib/integrations/openai-provider.ts` 中接入真实 OpenAI SDK 或 HTTP API。

## 快速开始

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm run dev
```

打开：

```text
http://localhost:5000
```

## 检查代码

```bash
corepack pnpm run ts-check
corepack pnpm run lint:build
corepack pnpm run build
```

## 环境变量

复制 `.env.example` 为 `.env.local`，按需填写：

```text
OPENAI_API_KEY=
LEAD_SEARCH_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
