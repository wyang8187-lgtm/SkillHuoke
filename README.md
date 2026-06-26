# AI Lead Platform

AI Lead Platform 是一个面向外贸获客、客户池管理和营销跟进的开源 SaaS 原型。项目基于 Next.js 16、React 19、shadcn/ui、Tailwind CSS 和 Supabase，适合继续开发成类似 SkillHuoke 的 AI 智能获客平台。

当前整理版本：`v0.10.1`

## 核心模块

- 仪表盘：客户、线索、商机、任务和转化数据概览
- AI 获客中心：智能搜索、高级搜索、线索发现、批量开发、多渠道获客
- 社媒线索：LinkedIn、Facebook、TikTok 公开线索入口
- 客户管理：客户列表、公海池、客户分类看板
- 线索池：线索录入、分配、转客户
- 营销中心：邮件营销、WhatsApp、自动化流程
- 数据分析：客户分析、销售分析、获客效率分析
- 系统设置：API Key、团队、系统参数、数据导入导出

## 预留获客 API 接口

项目已预留统一获客搜索接口：

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

返回会包含候选客户、联系方式可信度、评分、风险信号和下一步建议。当前默认使用 mock provider，方便开源项目直接运行；以后接 Google、SerpAPI、Bing 或其他数据服务时，只需要替换 `src/lib/integrations/lead-search-provider.ts` 中的 provider 实现。

## 预留 OpenAI API 接口

项目也预留统一 OpenAI 接口：

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

当前没有配置 `OPENAI_API_KEY` 时会返回 mock 内容；配置后可在 `src/lib/integrations/openai-provider.ts` 中接入真实 OpenAI SDK 或 HTTP API。

## 本次整理内容

- 将项目包名整理为 `ai-lead-platform`
- 将版本整理为 `0.10.1`
- 增加 MIT 开源协议
- 增加 `.env.example`
- 增加统一获客搜索 API 接口层
- 增加统一 OpenAI API 接口层
- 将启动脚本改成 Windows/macOS/Linux 都可直接运行的 Next.js 命令
- 修复乱码 README 和设计说明文档
- 调整 lint 配置，使生成型原型代码可以通过发布前检查

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

复制 `.env.example` 为 `.env.local`，然后按需填写：

```text
COZE_SUPABASE_URL=
COZE_SUPABASE_ANON_KEY=
COZE_SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
GOOGLE_SEARCH_API_KEY=
GOOGLE_SEARCH_CX=
SERPAPI_API_KEY=
BING_SEARCH_API_KEY=
```

当前项目没有内置真实密钥。上传 GitHub 前请确认 `.env.local`、`.env`、`node_modules`、`.next` 不要提交。

## 当前限制

- 多数 AI/搜索接口仍是演示或模拟逻辑，需要接入真实搜索源和 LLM 服务
- Supabase 相关接口需要配置数据库环境变量后才能完整运行
- 部分页面文案来自生成过程，后续建议统一做中文文案校对
- 社媒获客仅建议解析公开页面，不应绕过登录、验证码或平台限制

## 建议路线

1. v0.11：统一中文文案，修复页面乱码，完成基础可演示版本
2. v0.12：接入真实搜索服务，加入客户真实性评分和联系方式可信度
3. v0.13：完善客户池、线索池、CRM 跟进和 CSV/Excel 导出
4. v0.14：接入邮件模板、WhatsApp 模板和多轮跟进记录
5. v1.0：增加部署说明、数据库迁移、权限模型和正式发布文档

## License

MIT
