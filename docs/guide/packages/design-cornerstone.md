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
| `@grow-admin-cornerstone/apps-login` | 账号登录模块 | 开发中 |

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
    │   └── login.vue     # 登录页面
    ├── usage.ts
    └── constant.ts
```

### 路由

| 路径 | 名称 | 说明 |
|------|------|------|
| `/login` | `Login` | 登录页（`isBasic: true`，白名单路由） |

### 导出

```typescript
// 模块 Library
export { Lib } from './library';

// 用户 Store
export { useUserStore } from './src';

// 认证守卫
export { createAuthGuard } from './src/routes/guard';
```

### 宿主接入

```typescript
import { Lib as appsLoginLib, useUserStore } from '@grow-admin-cornerstone/apps-login';

app.use(appsLoginLib, appContext);
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
// library.ts
import { install } from '@grow-admin-rock/base-package';
import { RouteList } from '#/routes';

export const Lib = {
  install,
  name: '@grow-admin-cornerstone/apps-<name>',
  version: '0.0.0',
  routes: RouteList,
};
```

### 4. 宿主注册

在 `sample/package.json` 添加依赖，在 `initIoc.ts` 中 `.use(newLib, appContext)`。

## 命名规范

| 部分 | 规范 | 示例 |
|------|------|------|
| 目录名 | `cornerstone-apps-<功能>` | `cornerstone-apps-login` |
| 包名 | `@grow-admin-cornerstone/apps-<功能>` | `@grow-admin-cornerstone/apps-login` |
| 路由 | 模块内 `src/routes/index.ts` 定义 | `/login` |
| 页面 | 模块内 `src/pages/` 存放 | `login.vue` |

## 开发规范

| ✅ 推荐 | ❌ 禁止 |
|---------|---------|
| 使用 `Grow*` 契约组件 | 直接依赖三方 UI 库 |
| 路由守卫放在模块内 | 在宿主中编写业务守卫 |
| peer 依赖 `@grow-admin-rock/components` | 安装组件驱动 |
| 通过 `library.ts` 暴露能力 | 直接修改宿主代码添加业务逻辑 |

## 下一步

- [业务模块开发指南](/guide/development/business-module)
- [configs 构建配置](/guide/packages/configs)
