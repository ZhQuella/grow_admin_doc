---
title: DesignCornerstone 业务层
lang: zh-CN
---

# DesignCornerstone 业务层包说明

`DesignCornerstone`（砥柱）存放可独立开发、按需装配的业务功能模块。所有包以 `@grow-admin-cornerstone/*` 命名。

## 设计理念

- **与框架核心解耦**：业务模块不依赖具体 UI 库，只使用 `Grow*` 契约组件
- **Library 约定接入**：通过 `library.ts` 声明路由、IOC 模块等能力
- **宿主统一装配**：组件驱动由宿主应用初始化，业务模块无需关心
- **独立演进**：每个模块可独立版本管理、独立测试

## 当前模块

| 包名 | 说明 | 状态 |
|------|------|------|
| `@grow-admin-cornerstone/apps-login` | 账号登录模块 | 可用 |
| `@grow-admin-cornerstone/apps-home` | 登录后首页布局壳 + 动态路由注册 | 可用 |
| `@grow-admin-cornerstone/apps-workspace` | 工作区示例业务页（路由配置 + 页面） | 可用 |
| `@grow-admin-cornerstone/apps-sandbox` | 代码沙箱演示（编辑器 / 依赖 / 预览） | 可用 |
| `@grow-admin-cornerstone/apps-designer` | 页面 / 报表 / 数据库建模 / 数据准备 / 数据清洗 / 流程引擎演示 | 可用 |

---

## @grow-admin-cornerstone/apps-login

账号登录业务模块，提供登录页面与认证路由守卫。

### 目录结构

```
cornerstone-apps-login/
├── index.ts
├── library.ts
├── package.json
└── src/
    ├── index.ts
    ├── routes/
    │   ├── index.ts      # 登录路由定义
    │   └── guard.ts      # 认证路由守卫
    ├── pages/
    │   └── Login/        # 登录页面
    ├── components/
    │   ├── LoginThemeSwitch/
    │   └── LoginLanguageSwitch/
    ├── usage.ts
    └── constant.ts
```

### 路由

| 路径 | 名称 | 说明 |
|------|------|------|
| `/` | `Login` | 登录页（`isBasic: true`，`whiteRoute: true`） |

### 导出

```typescript
export { Lib } from './library'
export { createAuthGuard } from './src/routes/guard'  // 占位实现，实际守卫在 apps-home
export { useLoginEvent, useLoginSuccess } from './src'
```

::: info 认证守卫归属
真正的路由守卫（Token 校验、动态路由触发）在 **`apps-home`**，不在本模块。详见 [认证与登录](/guide/development/authentication)。
:::

---

## @grow-admin-cornerstone/apps-home

登录后的首页布局模块，提供 Home 布局壳、路由守卫与动态路由注册。

### 目录结构

```
cornerstone-apps-home/
├── index.ts
├── library.ts
├── package.json
└── src/
    ├── routes/
    │   ├── index.ts                  # Home 静态路由
    │   ├── guard.ts                  # 登录守卫 + 动态路由触发
    │   └── registerDynamicRoutes.ts  # 拉取菜单、注册子路由
    ├── api/
    │   └── routers.ts                # getMenuList() 接口
    └── pages/
        ├── home.vue                  # 布局壳（Teleport 挂载菜单）
        └── use/useAppBootstrap.ts
```

### 路由

| 路径 | 名称 | 说明 |
|------|------|------|
| `/home` | `Home` | 首页布局壳（`isBasic: true`） |

### 核心职责

- 在 `onSetup` 中注册 `createAuthGuard()` 路由守卫
- 登录后首次进入受保护路由时，调用 `registerDynamicRoutes()` 拉取菜单并注册子路由
- 将完整树形菜单写入 `authStore.backMenuList`，供 `rock-layouts` 侧边栏渲染

详见 [路由与菜单](/guide/architecture/routing-and-menu)。

---

## @grow-admin-cornerstone/apps-workspace

工作区示例业务模块，演示**路由配置与组件映射分离**的模式。

### 目录结构

```
cornerstone-apps-workspace/
├── index.ts
├── library.ts
├── package.json
└── src/
    ├── routes/
    │   ├── config.ts     # 可序列化树形菜单/路由元数据（Mock 安全导出）
    │   └── index.ts      # 组件映射 + resolveWorkspaceRoute()
    └── pages/
        ├── workspace.vue
        └── settings.vue
```

### 导出

```typescript
// 主入口
export { WORKSPACE_ROUTE_CONFIGS, flattenWorkspaceRouteConfigs, resolveWorkspaceRoute } from './src/routes'

// 子路径导出（供 Mock 引用，避免打包 .vue）
import { WORKSPACE_ROUTE_CONFIGS } from '@grow-admin-cornerstone/apps-workspace/route-config'
```

### 路由配置模式

| 文件 | 职责 | 含 `.vue` 组件 |
|------|------|---------------|
| `config.ts` | 树形菜单/路由元数据，供接口与 Mock 返回 | ❌ |
| `index.ts` | `WORKSPACE_COMPONENTS` 映射 + `resolveWorkspaceRoute()` | ✅ |

`library.ts` 中 `routes: []`，业务子路由不由静态注册，而是通过 `apps-home` 动态注入。

---

## 宿主接入

```typescript
import { Lib as appsLoginLib } from '@grow-admin-cornerstone/apps-login'
import { Lib as appsHomeLib } from '@grow-admin-cornerstone/apps-home'
import { Lib as appsWorkspaceLib } from '@grow-admin-cornerstone/apps-workspace'

app
  .use(appsLoginLib, appContext)
  .use(appsHomeLib, appContext)
  .use(appsWorkspaceLib, appContext)
```

## 创建新业务模块

### 1. 创建目录

```bash
mkdir -p DesignCornerstone/cornerstone-apps-<name>/src/{routes,pages}
```

### 2. 初始化 package.json

```json
{
  "name": "@grow-admin-cornerstone/apps-<name>",
  "version": "0.0.0",
  "main": "index.ts",
  "peerDependencies": {
    "vue": "~3.3.4",
    "@grow-admin-rock/components": "workspace:*"
  },
  "devDependencies": {
    "@grow-admin-rock/components": "workspace:*"
  }
}
```

### 3. 声明 Library

```typescript
import { install } from '@grow-admin-rock/base-package'
import { RouteList } from '#/routes'

export const Lib = {
  install,
  name: '@grow-admin-cornerstone/apps-<name>',
  version: '0.0.0',
  routes: RouteList,
}
```

### 4. 宿主注册

在 `sample/package.json` 添加依赖，在 `initIoc.ts` 中 `.use(newLib, appContext)`。

若业务页面需动态注册，参考 `apps-workspace` 的配置分离模式，由 `apps-home` 的 `registerDynamicRoutes` 统一注入。

---

## @grow-admin-cornerstone/apps-sandbox

代码沙箱工具演示模块，基于 `@grow-admin-rock/code-sandbox`。

### 目录结构

```
cornerstone-apps-sandbox/
├── index.ts
├── library.ts
├── package.json
└── src/
    ├── index.ts
    ├── routes/
    │   ├── index.ts
    │   ├── menuList.ts      # 侧栏菜单：沙箱 / 工具 / 编辑器
    │   ├── mergeMenu.ts
    │   ├── config.ts
    │   └── route-config.ts
    └── pages/
        ├── sandbox-overview/     # 三分屏：编辑器 + 依赖 + 预览
        ├── code-sandbox-demo/    # 仅 GrowCodeSandbox
        └── code-editor-demo/     # 仅 GrowCodeEditor
```

### 菜单

| 标题 | 说明 |
|------|------|
| 沙箱工具 | `GrowCodeEditor` + `GrowCodeDeps` + `GrowCodeSandbox` |
| 代码沙箱 | 仅预览完整 Vue SFC |
| 代码编辑器 | 仅 Monaco 编辑器（可切换语言） |

### 导出

```typescript
export { Lib } from './library'
```

宿主装配后，菜单由模块 `menuList` 合并进侧栏。组件 API 见 [代码沙箱](/code-sandbox/)。

---

## @grow-admin-cornerstone/apps-designer

低代码设计器演示模块，基于 `@grow-admin-rock/designer`、`@grow-admin-rock/report-designer`、`@grow-admin-rock/schema-designer`、`@grow-admin-rock/data-prep`、`@grow-admin-rock/data-clean` 与 `@grow-admin-rock/process-engine`。

### 目录结构

```
cornerstone-apps-designer/
├── index.ts
├── library.ts
├── package.json
└── src/
    ├── index.ts
    ├── routes/
    │   ├── index.ts
    │   ├── menuList.ts
    │   ├── mergeMenu.ts
    │   ├── config.ts
    │   └── route-config.ts
    └── pages/
        ├── designer-playground/          # GrowDesigner 演示页
        ├── report-designer-playground/   # GrowReportDesigner 演示页
        ├── schema-designer-playground/   # GrowSchemaDesigner 演示页
        ├── data-prep-playground/         # GrowDataPrepDesigner 演示页
        ├── data-clean-playground/        # GrowDataCleanDesigner 演示页
        └── process-engine-playground/    # GrowProcessDesigner 演示页
```

### 菜单

| 标题 | 说明 |
|------|------|
| 低代码设计器 | 挂载 `GrowDesigner` 的拖拽设计画布 |
| 报表设计器 | 挂载 `GrowReportDesigner` 的图表看板设计器 |
| 数据库建模 | 挂载 `GrowSchemaDesigner` 的表结构建模画布 |
| 数据准备 | 挂载 `GrowDataPrepDesigner` 的 Dataset 分析建模画布 |
| 数据清洗 | 挂载 `GrowDataCleanDesigner` 的清洗流编排画布 |
| 流程引擎 | 挂载 `GrowProcessDesigner` 的业务流程编排画布 |

### 导出

```typescript
export { Lib } from './library'
```

完整能力见 [低代码设计器](/guide/designers/)、[页面设计器](/page-designer/)、[报表设计器](/report-designer/)、[数据库建模](/schema-designer/)、[数据准备](/data-prep/)、[数据清洗](/data-clean/)、[流程引擎](/process-engine/)。

## 命名规范

| 部分 | 规范 | 示例 |
|------|------|------|
| 目录名 | `cornerstone-apps-<功能>` | `cornerstone-apps-workspace` |
| 包名 | `@grow-admin-cornerstone/apps-<功能>` | `@grow-admin-cornerstone/apps-workspace` |
| 路由 | 模块内 `src/routes/index.ts` 定义 | `/home` |
| 页面 | 模块内 `src/pages/` 存放 | `workspace.vue` |

## 开发规范

| ✅ 推荐 | ❌ 禁止 |
|---------|---------|
| 使用 `Grow*` 契约组件 | 直接依赖三方 UI 库 |
| 路由守卫放在模块内 | 在宿主中编写业务守卫 |
| peer 依赖 `@grow-admin-rock/components` | 安装组件驱动 |
| 通过 `library.ts` 暴露能力 | 直接修改宿主代码添加业务逻辑 |
| 动态路由配置与组件映射分离 | 在 Mock 中 import `.vue` 文件 |

## 下一步

- [路由与菜单](/guide/architecture/routing-and-menu) — 动态路由注册机制
- [业务模块开发指南](/guide/development/business-module)
- [configs 构建配置](/guide/packages/configs)
