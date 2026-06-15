# SkillHuoke

SkillHuoke 是一个开源的外贸 AI 获客与客户运营系统原型，面向外贸工厂、SOHO、外贸团队和服务商。它把“输入产品和市场 -> 生成客户开发工作流 -> 输出客户池、联系方式状态、AI 评分、开发信、WhatsApp 话术、CRM 跟进和 CSV 导出”做成一个可直接运行的网页工具。

> 当前版本是无需数据库、无需安装依赖的本地 MVP。它适合做产品演示、业务流程验证和后续 SaaS 系统开发起点。

## 当前版本

```text
V1.6 - 试运营 UI、可操作工作台、客户池和跟进流程打磨
```

## 核心功能

- 输入产品、国家、客户类型和数量
- 自动生成搜索关键词
- 展示工作流运行步骤
- 生成客户池表格
- 展示公司官网、国家、城市、客户类型和来源链接
- 标注 WhatsApp / 电话 / 邮箱 / LinkedIn 状态
- AI 匹配评分和优先级
- 生成英文开发信
- 生成 WhatsApp 开场白
- CRM 状态和跟进备注
- 导出当前筛选客户 CSV
- 浏览器本地保存客户 CRM 状态和跟进备注
- 内置首次开发、二次跟进、报价邀请 3 套英文模板
- 导出中文字段 CSV，适合 Excel 打开
- 手动录入真实客户并进入同一个客户池
- 导入 Excel 另存为 CSV 的真实客户名单
- 按官网或公司名 + 国家去重，保留已有 CRM 跟进状态
- 客户详情显示数据质量、缺失字段和建议动作
- 支持客户标签和跟进记录时间线
- 手动录入和 CSV 导入时提示需要核验的数据字段
- 更明亮的 SaaS 工作台界面、表格、标签和客户详情视觉
- 客户真实性评分：公司、联系方式、联系人、LinkedIn、业务匹配和风险信号
- 自动生成搜索关键词和运行步骤
- 开发动作建议：优先开发、先核验再开发、补全资料、暂缓开发
- 按客户类型推荐 Owner / Procurement / Project / Design / Sourcing 等联系人
- 按风险信号生成官网表单、LinkedIn 人员搜索、WhatsApp 核验等动作
- 为每个客户生成更自然的英文开场判断
- 预留 Google Custom Search / SerpAPI / Bing / 邮箱线索 API 接入结构
- 生成 LinkedIn、Facebook、TikTok 公开页面搜索指令
- 修复英文开发信和 WhatsApp 话术中的中文产品词
- 支持 Google Custom Search / Bing / SerpAPI 前端测试入口
- 搜索结果进入候选池，可一键加入客户池并标记为“搜索发现”
- 搜索失败时提示本地后端和 API Key 配置问题
- 新增本地后端 `/api/search`，搜索密钥放在 `.env`，不再暴露在前端页面
- 后端会尝试解析官网首页、联系页面、关于我们页面，提取公开邮箱、电话、即时通讯和领英
- 搜索候选客户加入客户池时，会同步带入已解析的公开联系方式，并继续标记为需要人工核验
- 搜索源支持自动选择，默认优先使用 SerpAPI，然后尝试必应，最后尝试谷歌
- 单一搜索源失败时，后端会自动降级到下一个已配置的搜索源
- 本地后端会读取 Windows 系统代理，也支持 `SKILLHUOKE_PROXY` 手动指定代理
- 为每条搜索候选客户生成真实性评分、联系方式可信度、客户等级和推荐结论
- 自动识别社媒帖子、目录页等噪音结果并降低优先级
- 搜索结果卡片展示推荐理由、风险提醒和下一步跟进建议
- 一键加入客户池时同步写入评分和跟进建议
- 支持后端批量获客任务队列，会按产品、国家、客户类型自动生成多组搜索关键词
- 批量任务会记录每个关键词的运行状态、发现数量、过滤数量、去重数量和失败原因
- 自动过滤 D 级噪音结果，按官网域名去重，把 A/B/C 级结果沉淀到候选客户池
- 前端支持一键把全部候选客户加入 CRM 客户池
- V1.6 页面隐藏内部迭代标签和暂未实现的商业功能入口，只保留可解释、可操作、可试运营的功能

## 快速开始

### 在线演示

开启 GitHub Pages 后，可以通过仓库的 Pages 地址直接访问：

```text
https://wyang8187-lgtm.github.io/SkillHuoke/
```

### 方式一：直接打开

打开：

```text
index.html
```

在 Windows 上可以直接双击：

```text
C:\Users\w2775\Documents\找客\SkillHuoke\index.html
```

### 方式二：本地后端服务

如果你希望使用联网搜索和官网联系页面解析，先在项目根目录创建 `.env`：

```text
GOOGLE_SEARCH_API_KEY=你的谷歌搜索API密钥
GOOGLE_SEARCH_CX=你的谷歌搜索引擎编号
BING_SEARCH_API_KEY=你的必应搜索API密钥
SERPAPI_API_KEY=你的SerpAPI密钥
```

至少配置一个搜索源即可。建议优先配置 `SERPAPI_API_KEY`，因为当前 Google Custom Search JSON API 对新项目可能存在访问限制。

如果你的电脑需要代理才能访问海外 API，可以在 `.env` 里加：

```text
SKILLHUOKE_PROXY=http://127.0.0.1:10808
```

不填也可以，后端会尽量读取 Windows 系统代理。然后运行：

```bash
npm start
```

然后打开：

```text
http://127.0.0.1:4174
```

如果只想打开纯静态演示，不启用后端搜索：

```bash
npm run start:static
```

## 使用方式

在页面的“输入你的工作流指令”中填写：

```text
产品：全屋定制、橱柜、衣柜、木门、家具出口
目标国家：澳洲
客户类型：Builder + Designer + Kitchen Company + Importer
数量：50
联系方式优先级：即时通讯 > 电话 > 邮箱 > 领英
```

点击 `运行工作流`，页面会生成客户池、关键词、步骤状态、评分、CRM 状态和开发话术。

## 项目结构

```text
SkillHuoke/
  README.md
  index.html
  LICENSE
  package.json
  .env.example
  server/
    contact-parser.mjs
    contact-parser.test.mjs
    search-service.mjs
    search-service.test.mjs
    search-server.mjs
  src/
    index.html
    styles.css
    app.js
    v02-tools.js
    v02-tools.mjs
    v02-tools.test.mjs
    v03-tools.js
    v03-tools.mjs
    v03-tools.test.mjs
    v04-tools.js
    v04-tools.mjs
    v04-tools.test.mjs
    v10-tools.js
    v10-tools.mjs
    v10-tools.test.mjs
    v11-tools.js
    v11-tools.mjs
    v11-tools.test.mjs
    v12-tools.js
    v12-tools.mjs
    v12-tools.test.mjs
    v12b-search.js
    v12b-search.mjs
    v12b-search.test.mjs
    workflow-engine.js
    workflow-engine.mjs
    workflow-engine.test.mjs
  docs/
    产品说明.md
    工作流说明.md
    数据字段说明.md
    开发路线.md
  workflows/
    lead-development-workflow.template.json
    外贸客户自动开发工作流模板.md
  examples/
    australia-cabinet-leads.csv
  scripts/
    serve.mjs
```

## 数据质量规则

SkillHuoke 的核心原则是：宁可标注“未公开 / 需核验”，也不编造联系方式。

- 不编造 WhatsApp
- 不把所有电话自动当 WhatsApp
- 不编造邮箱
- 不编造联系人
- 每条客户数据尽量保留官网或来源链接
- 开发信和 WhatsApp 话术必须人工确认后再发送

## 当前限制

当前版本是本地 MVP。它已经支持本地后端联网搜索和公开联系页面解析，但还不是完整的云端自动化获客系统：

- GitHub Pages 静态演示不包含后端搜索，需要本地运行 `npm start`
- 搜索密钥需要你自己配置到 `.env`
- 只解析公开网页，不绕过登录、验证码、付费墙或平台限制
- 不会自动发送邮件或 WhatsApp
- 不包含登录、团队权限、数据库
- 客户数据是基于工作流模板生成的演示数据

后续可以升级为完整 SaaS：

- Next.js 前端
- Node.js / FastAPI 后端
- PostgreSQL 数据库
- OpenAI 接口
- 搜索和数据源接入
- 邮箱草稿和 WhatsApp Business API

## 开源协议

MIT License

## V1.6 后续版本定位

| 阶段 | 版本 | 目标状态 | 商业化判断 |
| --- | --- | --- | --- |
| 试运营展示版 | V1.6-V1.8 | 页面专业、工作台可用、能跑样例和部分真实搜索 | 可以演示，不适合收费 |
| 小范围试用版 | V2.0 | 真实搜索、客户池、导入导出、跟进记录、基础稳定性 | 可以给熟人或小客户试用 |
| 内测商业版 | V2.5 | 账号、数据库、团队数据、搜索额度、错误处理、日志 | 可以低价试收费 |
| 正式商业版 | V3.0 | 登录权限、套餐、支付、稳定后端、客户数据安全、部署监控 | 可以正式卖 |
| 增长版 SaaS | V3.5+ | 多团队、多市场模板、自动任务、AI 优化、统计报表 | 可以规模化运营 |

V1.6 当前只聚焦试运营展示版：主程序清晰、前端/后端/共享规则分层、工作台能演示，暂不加入账号、支付、数据库和正式商业部署能力。
