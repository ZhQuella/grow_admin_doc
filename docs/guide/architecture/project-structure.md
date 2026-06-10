---
title: 项目结构
lang: zh-CN
---

# 项目结构

Grow Admin 采用 pnpm Monorepo 管理，按职责分为四个顶层目录。

## 顶层目录

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
├── rock-infrastructure/               # HTTP 请求基础设施
├── rock-middleware-router/            # 路由与菜单中间件
├── rock-settings/                     # 项目设置（主题、布局）
├── rock-state/                        # Pinia 状态管理封装
├── rock-locale/                       # 国际化
├── rock-hooks/                        # 通用 Hooks
├── rock-utils/                        # 工具函数（含 VueUse 重导出）
└── rock-styles/                       # 全局样式
```

## DesignCornerstone — 业务模块层

`DesignCornerstone`（砥柱）存放可独立开发的业务功能模块，以 `@grow-admin-cornerstone/*` 发布。

```
DesignCornerstone/
└── cornerstone-apps-login/    # 登录模块（示例）
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
2. 装配所有 IOC 模块（基础设施、路由、业务模块、契约组件）
3. 提供 `projectSetting.ts` 全局配置
4. 注册宿主级路由

```
sample/
├── src/
│   ├── main.ts                    # 入口
│   ├── App.vue                    # 根组件（Provider 包裹）
│   ├── projectSetting.ts          # 项目配置
│   ├── init-components-driver.ts  # 驱动初始化
│   ├── plugin/initIoc.ts          # IOC 装配
│   ├── routers/router.ts          # 宿主路由
│   └── components/DriverDemo.vue  # 驱动演示
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
│  驱动选择 · 模块装配 · 全局配置 · 路由    │
├─────────────────────────────────────────┤
│         DesignCornerstone（业务）        │
│  apps-login · 未来更多业务模块           │
├─────────────────────────────────────────┤
│           DesignRock（框架核心）          │
│  IOC · 契约组件 · 驱动 · 基础设施 · 路由  │
├─────────────────────────────────────────┤
│            configs（构建配置）            │
│  Vite · TSConfig · 自动导入 · CSS 预处理  │
└─────────────────────────────────────────┘
```

**依赖方向**：`sample` → `DesignCornerstone` → `DesignRock` → `configs`，不允许反向依赖。

## 下一步

- [IOC 模块化架构](/guide/architecture/ioc) — 了解 Library 如何装配
- [组件驱动架构](/guide/architecture/component-driver) — 了解 Grow* 组件与驱动桥接
- [包说明](/guide/packages/design-rock) — 查看每个包的详细职责
