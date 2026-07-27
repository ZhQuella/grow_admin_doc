---
title: 项目结构
lang: zh-CN
---

# 项目结构

Grow Admin 采用 pnpm Monorepo 管理，按职责分为四个顶层目录。

::: tip 先读设计理念
若你想了解「为什么要这样分层」，建议先阅读 [架构设计理念](/guide/architecture/design-philosophy)。
:::

## 设计理念：为什么分层？

传统 Vue Admin 把所有代码放在 `src/` 下，短期开发快，长期会遇到：

- 框架代码与业务代码混在一起，升级框架牵一发动全身
- 业务模块无法拆成独立包给其他项目用
- 构建配置在每个子项目里复制粘贴

Grow Admin 用 **Rock（框架）/ Cornerstone（业务）/ sample（宿主）/ configs（工具链）** 四层切开，并规定**单向依赖**。

| 设计决策 | 原因 | 好处 |
|----------|------|------|
| Rock 不含业务页面 | 框架应可复用于不同行业 | 升级 Rock 不碰业务 |
| Cornerstone 按能力分包 | 登录、首页、工作区独立演进 | 团队可并行开发 |
| sample 只做装配 | 选型属于项目，不属于框架 | 同一套 Rock 适配多客户 |
| configs 共享构建 | Vite/TS 配置应一致 | 改一处，全仓生效 |

**磐石（Rock）与砥柱（Cornerstone）** 的命名也体现这一点：Rock 是稳定基座，Cornerstone 是承载业务的支柱，宿主把二者组合成完整应用。

## 顶层目录

与 README 一致的核心结构：

```
grow_admin/
├── DesignRock/              # 框架核心层
│   ├── rock-components/     # 契约组件（Grow* 前缀）
│   ├── rock-layouts/        # 布局壳（设置抽屉、菜单、标签页等）
│   ├── rock-state/          # 应用状态（主题、配置持久化）
│   ├── rock-styles/         # 全局样式与 CSS 变量
│   ├── rock-component-driver/              # 驱动桥接基础包
│   ├── rock-component-driver-element-plus/   # Element Plus 驱动
│   ├── rock-component-driver-naive/          # Naive UI 驱动
│   ├── rock-component-driver-antdv/          # Ant Design Vue 驱动
│   ├── rock-ioc/            # 依赖注入
│   ├── rock-code-sandbox/   # 在线代码编辑与沙箱预览
│   ├── rock-designer/       # 低代码页面设计器
│   ├── rock-report-designer/# 报表设计器
│   └── ...
├── DesignCornerstone/       # 业务模块层
│   ├── cornerstone-apps-login/     # 登录模块
│   ├── cornerstone-apps-home/      # 首页（布局 + 动态路由）
│   ├── cornerstone-apps-workspace/ # 工作区（页面 + 路由配置）
│   ├── cornerstone-apps-sandbox/   # 代码沙箱演示
│   └── cornerstone-apps-designer/  # 页面 / 报表设计器演示
├── configs/                 # 共享构建配置（含 UnoCSS 主题色映射）
└── sample/                  # 宿主示例应用
```

仓库内还有 `scripts/`、`package.json`、`pnpm-workspace.yaml`、`turbo.json` 等，用于 Monorepo 与构建调度。

```
grow_admin/
├── DesignRock/              # 框架核心层（磐石）
├── DesignCornerstone/       # 业务模块层（砥柱）
├── configs/                 # 共享构建配置
├── sample/                  # 宿主示例应用
├── scripts/                 # 构建脚本
├── package.json             # 根工作区配置
├── pnpm-workspace.yaml      # 工作区声明
└── turbo.json               # Turbo 并行构建配置
```

## DesignRock — 框架核心层

`DesignRock`（磐石）存放与具体业务无关的框架基础设施，所有包以 `@grow-admin-rock/*` 发布。

```
DesignRock/
├── rock-ioc/                          # IOC 依赖注入容器
├── rock-base-package/                 # Library 基座与 AppContext
├── rock-types/                        # 全局 TypeScript 类型
├── rock-constants/                    # 枚举与常量
├── rock-components/                   # Grow* 契约组件
├── rock-component-driver/             # 组件驱动桥接基础包
├── rock-component-driver-element-plus/  # Element Plus 驱动
├── rock-component-driver-naive/         # Naive UI 驱动
├── rock-component-driver-antdv/         # Ant Design Vue 驱动
├── rock-layouts/                      # 布局壳（主题设置抽屉、菜单、标签页等）
├── rock-infrastructure/               # HTTP 请求基础设施
├── rock-middleware-router/            # 路由与菜单中间件
├── rock-settings/                     # 项目设置（主题、布局）
├── rock-state/                        # Pinia 状态管理封装
├── rock-locale/                       # 国际化
├── rock-hooks/                        # 通用 Hooks
├── rock-utils/                        # 工具函数（含 VueUse 重导出）
├── rock-styles/                       # 全局样式
├── rock-code-sandbox/                 # 在线代码编辑与 Vue SFC 沙箱预览
├── rock-designer/                     # 低代码页面设计器
└── rock-report-designer/              # 报表设计器（ECharts + 网格布局）
```

## DesignCornerstone — 业务模块层

`DesignCornerstone`（砥柱）存放可独立开发的业务功能模块，以 `@grow-admin-cornerstone/*` 发布。

```
DesignCornerstone/
├── cornerstone-apps-login/      # 登录模块
├── cornerstone-apps-home/       # 登录后首页（布局壳 + 动态路由注册）
├── cornerstone-apps-workspace/  # 工作区业务页（路由配置 + 页面组件）
├── cornerstone-apps-sandbox/    # 代码沙箱演示（编辑器 / 依赖 / 预览）
└── cornerstone-apps-designer/   # 页面设计器 + 报表设计器演示
```

业务模块通过 Library 约定接入宿主应用，不自行安装组件驱动。

## configs — 共享构建配置

```
configs/
├── vite/                      # @grow-admin-config/vite — 统一 Vite 配置
├── tsconfig/                  # @grow-admin-config/tsconfig — 共享 TS 配置
├── grow-admin-autoimport/     # 自动导入插件
└── grow-admin-css-preprocess/ # CSS 预处理
```

## sample — 宿主示例应用

`sample` 是整个框架的宿主应用，负责：

1. 选择并加载组件库驱动
2. 装配所有 IOC 模块（基础设施、状态、国际化、路由、业务模块、契约组件）
3. 提供 `projectSetting.ts` 全局配置
4. 注册宿主级路由与 Mock 数据

```
sample/
├── src/
│   ├── main.ts                    # 入口
│   ├── App.vue                    # 根组件（Provider 包裹）
│   ├── projectSetting.ts          # 项目配置
│   ├── init-components-driver.ts  # 驱动初始化
│   ├── initAppConfig.ts           # projectSetting → useAppConfig 引导
│   ├── removeAppLoading.ts        # 首屏 loading 移除
│   ├── apis/infrastructure.ts     # GrowAxiosTransform / useRequest
│   └── plugin/initIoc.ts          # IOC 装配
├── mock/                          # 开发环境 Mock 接口
│   ├── auth.ts                    # POST /api/login
│   ├── routers.ts                 # GET /api/menu/list
│   └── login.ts                   # 验证码、手机登录等
├── vite.config.ts                 # Vite 配置
└── package.json
```

## 工作区声明

`pnpm-workspace.yaml` 定义了 Monorepo 的工作区范围：

```yaml
packages:
  - 'configs/*'
  - 'DesignRock/*'
  - 'DesignCornerstone/*'
  - 'sample'
  - 'scripts'
```

## 分层原则

```
┌─────────────────────────────────────────┐
│              sample（宿主）               │
│  驱动选择 · 模块装配 · 全局配置 · 路由 · Mock │
├─────────────────────────────────────────┤
│         DesignCornerstone（业务）        │
│  apps-login · apps-home · apps-workspace │
├─────────────────────────────────────────┤
│           DesignRock（框架核心）          │
│  IOC · 契约组件 · 驱动 · 基础设施 · 路由  │
├─────────────────────────────────────────┤
│            configs（构建配置）            │
│  Vite · TSConfig · 自动导入 · CSS 预处理  │
└─────────────────────────────────────────┘
```

**依赖方向**：`sample` → `DesignCornerstone` → `DesignRock` → `configs`，不允许反向依赖。

### 单向依赖解决什么问题？

若允许 `rock-components` import `apps-login` 的页面，框架就与具体业务焊死，无法：

- 单独发布 `@grow-admin-rock/components` 供第三方使用
- 在不含登录模块的轻量宿主中复用布局
- 写不依赖业务的单元测试

单向依赖是**架构纪律**：宁可多写一层 `Library` 导出，也不跨层引用。

## 下一步

- [架构设计理念](/guide/architecture/design-philosophy) — 整体设计动机与权衡

- [IOC 模块化架构](/guide/architecture/ioc) — 了解 Library 如何装配
- [路由与菜单](/guide/architecture/routing-and-menu) — 动态路由注册与侧边菜单
- [组件驱动架构](/guide/architecture/component-driver) — 了解 Grow* 组件与驱动桥接
- [包说明](/guide/packages/design-rock) — 查看每个包的详细职责
