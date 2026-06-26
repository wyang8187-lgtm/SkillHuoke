# AGENTS.md

## 项目概览

全屋定制行业AI获客智能体SaaS平台 - 面向国内全屋定制工厂的客户群体（全案设计师、建材外贸公司）。

### 核心定位
- **目标用户**：全屋定制工厂
- **客户群体**：全案设计师、建材外贸公司
- **核心价值**：AI智能获客、CRM客户管理、营销自动化

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **数据存储**: localStorage (模拟数据)

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   │   ├── login/          # 登录页面
│   │   ├── dashboard/      # 仪表盘
│   │   ├── acquisition/    # AI获客中心
│   │   │   ├── search/     # 智能搜索
│   │   │   ├── channels/   # 多渠道获客
│   │   │   └── auto/       # AI自动获客
│   │   ├── customers/      # 客户管理
│   │   │   ├── list/       # 客户列表
│   │   │   └── pool/       # 公海池
│   │   ├── marketing/      # 营销中心
│   │   │   ├── email/      # 邮件营销
│   │   │   ├── social/     # 社媒营销
│   │   │   ├── whatsapp/   # WhatsApp营销
│   │   │   └── automation/ # 自动化流程
│   │   ├── leads/          # 线索池
│   │   ├── opportunities/  # 商机管理
│   │   ├── team/           # 团队管理
│   │   ├── analytics/      # 数据分析
│   │   └── settings/       # 系统设置
│   ├── components/         # 组件
│   │   ├── ui/             # Shadcn UI 组件库
│   │   └── layout/         # 布局组件 (Sidebar, MainLayout)
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   ├── utils.ts        # 通用工具函数 (cn)
│   │   └── mock-data.ts    # 模拟数据管理
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts        # 核心业务类型
│   └── server.ts           # 自定义服务端入口
├── DESIGN.md               # 设计规范文档
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

## 开发规范

### 包管理规范
- **仅允许使用 pnpm** 作为包管理器
- 常用命令：
  - 安装依赖：`pnpm add <package>`
  - 安装开发依赖：`pnpm add -D <package>`
  - 安装所有依赖：`pnpm install`
  - 移除依赖：`pnpm remove <package>`

### 编码规范
- 默认按 TypeScript `strict` 心智写代码
- 禁止隐式 `any` 和 `as any`
- 函数参数、返回值应有明确类型标注
- 使用前必须先声明和导入
- 清理未使用的变量和导入

### Hydration 问题防范
- 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据
- 必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染
- 严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）

### next.config 配置规范
- 配置的路径不要写死绝对路径
- 必须使用 path.resolve(__dirname, ...)、import.meta.dirname 或 process.cwd() 动态拼接

## 核心功能模块

### 1. 仪表盘 (Dashboard)
- 数据概览卡片：今日新增线索、跟进中客户、成交客户、转化率
- 近7天线索趋势图
- 待跟进任务列表
- 最近客户动态流

### 2. AI获客中心
- **智能搜索**：关键词搜索 + 篮选 + 结果列表 + 一键添加客户池
- **多渠道获客**：Google/百度、抖音/小红书/微信、Instagram/Facebook、企查查/天眼查、展会名录、设计师平台
- **AI自动获客**：预设画像 + 7×24自动采集 + 决策人识别 + 自动入库通知

### 3. CRM客户管理
- **客户列表**：表格展示 + 搜索筛选排序 + 批量操作
- **客户详情**：基本信息 + 分级(A/B/C/D类) + 标签管理 + 跟进记录时间轴 + AI画像
- **公海池**：超期释放 + 认领机制 + 自定义规则

### 4. 营销自动化
- **邮件营销**：模板库 + AI写信 + 批量/定时发送 + 送达/打开/点击追踪
- **社媒营销**：账号管理 + 内容矩阵 + 批量发布 + 评论监控
- **WhatsApp**：批量发送 + 消息模板 + 自动回复
- **自动化流程**：多轮触达 + 触发条件 + 自动跟进提醒

### 5. 线索池
- 线索列表 + 转客户 + 分配 + 导入导出

### 6. 商机管理
- 商机管道漏斗 + 商机关联客户金额 + 输单分析

### 7. 团队管理
- 成员列表 + 角色权限 + 业绩看板 + 客户分配

### 8. 数据分析
- 渠道效果 + 转化漏斗 + 团队效率 + 营销ROI

### 9. 系统设置
- 企业设置 + 个人设置 + 通知设置 + 安全设置

## 数据模拟

使用 localStorage 模拟数据存储：
- `STORAGE_KEYS.leads` - 线索数据
- `STORAGE_KEYS.customers` - 客户数据
- `STORAGE_KEYS.opportunities` - 商机数据
- `STORAGE_KEYS.tasks` - 任务数据
- `STORAGE_KEYS.teamMembers` - 团队成员
- `STORAGE_KEYS.emailRecords` - 邮件记录
- `STORAGE_KEYS.campaigns` - 营销活动
- `STORAGE_KEYS.socialAccounts` - 社媒账号
- `STORAGE_KEYS.socialPosts` - 社媒内容

初始化函数：`initData()` - 首次访问时初始化默认数据
获取函数：`getData<T>(key)` - 获取指定类型数据
添加函数：`addData<T>(key, item)` - 添加新数据项

## UI 设计规范

详见 `DESIGN.md`

### 品牌色
- 主色蓝：`#3b82f6`
- 主色橙：`#f97316`
- 成功绿：`#22c55e`
- 警告红：`#ef4444`

### 深色主题色
- 背景主色：`#0f1419`
- 卡片背景：`#1a1f2c`
- 边框色：`#2d3548`
- 文字主色：`#f8fafc`
- 文字次要：`#94a3b8`
- 文字弱色：`#64748b`

## 常见问题修复

### Hydration 错误
- 检查是否在渲染中使用动态数据
- 使用 `useEffect` + `useState` 处理客户端数据
- 确保没有非法 HTML 嵌套

### 类型错误
- 检查导入路径是否正确
- 确保类型定义在 `src/types/index.ts` 中
- 检查组件 props 类型标注

### 导航问题
- 检查 `src/components/layout/sidebar.tsx` 中的路由配置
- 确保页面文件在正确的目录结构下