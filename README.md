# SkillHuoke

SkillHuoke 是一个开源的外贸 AI 获客与客户运营系统原型，面向外贸工厂、SOHO、外贸团队和服务商。它把“输入产品和市场 -> 生成客户开发工作流 -> 输出客户池、联系方式状态、AI 评分、开发信、WhatsApp 话术、CRM 跟进和 CSV 导出”做成一个可直接运行的网页工具。

> 当前版本是无需数据库、无需安装依赖的本地 MVP。它适合做产品演示、业务流程验证和后续 SaaS 系统开发起点。

## 当前版本

```text
v1.1 - 开发动作建议增强，包含联系人推荐、风险动作和更自然的英文开场判断
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
- 搜索策略生成：Google / LinkedIn 关键词、来源类型和核验规则
- 开发动作建议：优先开发、先核验再开发、补全资料、暂缓开发
- 从 v0.6 到 v1.0 的核心获客逻辑已整合为预览版
- 按客户类型推荐 Owner / Procurement / Project / Design / Sourcing 等联系人
- 按风险信号生成官网表单、LinkedIn 人员搜索、WhatsApp 核验等动作
- 为每个客户生成更自然的英文开场判断

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

### 方式二：本地网页服务

如果你希望用本地网址访问：

```bash
npm start
```

然后打开：

```text
http://127.0.0.1:4174
```

## 使用方式

在页面的“输入你的工作流指令”中填写：

```text
产品：全屋定制、橱柜、衣柜、木门、家具出口
目标国家：澳洲
客户类型：Builder + Designer + Kitchen Company + Importer
数量：50
联系方式优先级：WhatsApp > 电话 > 邮箱 > LinkedIn
```

点击 `运行工作流`，页面会生成客户池、关键词、步骤状态、评分、CRM 状态和开发话术。

## 项目结构

```text
SkillHuoke/
  README.md
  index.html
  LICENSE
  package.json
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

当前版本是本地 MVP，不是真正联网自动搜索系统：

- 不会自动访问 Google 或 LinkedIn
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
