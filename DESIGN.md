# AI Lead Platform Design

## 产品定位

AI Lead Platform 是一个外贸 AI 获客与客户运营平台原型。目标用户是外贸工厂、SOHO 团队、外贸服务商和销售团队。平台希望把“找客户、判断客户、沉淀客户、生成开发信、持续跟进”做成一个可运营的系统。

## 核心用户流程

1. 输入产品、国家、客户类型和数量
2. 生成 Google、LinkedIn、Facebook、TikTok 等公开渠道搜索策略
3. 执行搜索或导入客户名单
4. 对客户进行真实性评分和联系方式可信度判断
5. 加入客户池或线索池
6. 生成邮件、WhatsApp、LinkedIn 开场话术
7. 进入 CRM 跟进、任务、商机和数据分析

## 预留 API 设计

平台统一通过 `/api/integrations/lead-search` 执行获客搜索。业务页面和任务队列不直接接触外部 API Key，只调用这个内部接口。

Provider 层位于：

```text
src/lib/integrations/lead-search-provider.ts
```

后续可在这里接入：

- Google Custom Search
- SerpAPI
- Bing Web Search
- LinkedIn/Facebook/TikTok 公开页面搜索服务
- 邮箱和官网联系人补全服务

OpenAI 能力统一通过 `/api/integrations/openai` 调用。页面不直接保存 OpenAI Key，所有密钥放在服务端环境变量里。

OpenAI Provider 层位于：

```text
src/lib/integrations/openai-provider.ts
```

后续可用于：

- 英文开发信生成
- WhatsApp 开场白生成
- 客户真实性评分解释
- 客户画像总结
- CRM 下一步动作建议

## 数据原则

- 不编造邮箱、WhatsApp、联系人和公司信息
- 电话不能默认等于 WhatsApp，需要单独标注“待核验”
- 公开网页提取的信息必须保留来源链接
- AI 评分只能作为优先级建议，不能替代人工确认
- 上传开源项目时不得包含真实密钥、客户隐私和内部数据

## 视觉方向

推荐使用更清爽的 SaaS 工作台风格：浅色为主，深色侧边栏可选，表格和筛选区域应优先保证可读性。获客任务、客户评分、风险信号、CRM 状态应使用稳定的标签体系。

## 后续升级建议

- 修复全部页面乱码和生成型占位文案
- 将 mock provider 替换为真实搜索服务适配层
- 抽离客户评分、去重、渠道判断为独立模块
- 增加数据库迁移和种子数据
- 增加端到端演示流程和部署文档
