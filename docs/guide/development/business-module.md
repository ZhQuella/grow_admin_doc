---
title: 业务模块开发
lang: zh-CN
---

# 业务模块开发

Grow Admin 的业务功能以独立 npm 包形式存放在 `DesignCornerstone/` 目录下，通过 Library 约定接入宿主应用。本文以 `cornerstone-apps-login` 和 `cornerstone-apps-workspace` 为例说明开发流程。

## 模块结构

当前业务模块按职责分为三类：

| 模块 | 职责 |
|------|------|
| `apps-login` | 登录页、登录 API、Token 写入 |
| `apps-home` | Home 布局壳、**路由守卫**、动态路由注册 |
| `apps-workspace` | 业务页面、路由配置与组件映射 |

### apps-login 结构

```
DesignCornerstone/cornerstone-apps-login/
├── index.ts
├── library.ts
├── package.json
└── src/
    ├── routes/
    │   ├── index.ts
    │   └── guard.ts
    ├── pages/Login/
    └── components/
        ├── LoginThemeSwitch/
        └── LoginLanguageSwitch/
```

### apps-workspace 结构

```
DesignCornerstone/cornerstone-apps-workspace/
├── index.ts
├── library.ts
├── package.json
└── src/
    ├── routes/
    │   ├── config.ts     # 可序列化树形配置（Mock 安全）
    │   └── index.ts      # 组件映射
    └── pages/
        ├── workspace.vue
        └── settings.vue
```

业务模块**不需要**自行安装驱动，依赖宿主应用完成初始化。

### 宿主启动顺序（README 最小示例）

`sample/src/plugin/initIoc.ts` 中顺序必须保持（完整列表见 [IOC 模块化](/guide/architecture/ioc)）：

```typescript
await installComponentDriver(app, appContext);  // 1. 安装驱动
app
  .use(IocPlugin, iocOptions)
  .use(infrastructureLib, appContext)
  .use(routeLib, appContext)
  .use(appsLoginLib, appContext)
  .use(componentsLib, appContext);              // 2. 注册 Grow 组件
await appContext.load(app);
```

### 业务页面示例（apps-login）

```vue
<!-- DesignCornerstone/cornerstone-apps-login/src/pages/... -->
<script lang="ts" setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-8">
    <GrowInput v-model="username" placeholder="用户名" />
    <GrowInput v-model="password" type="password" placeholder="密码" />
    <GrowButton type="primary">登录</GrowButton>
  </div>
</template>
```

## 声明 Library

`library.ts` 是模块与宿主之间的契约：

```typescript
import * as pack from './package.json'
import { install } from '@grow-admin-rock/base-package'
import { RouteList } from '#/routes'

export const Lib = {
  install,
  name: pack.name,
  version: pack.version,
  routes: RouteList,
}
```

`apps-home` 额外在 `onSetup` 中注册路由守卫：

```typescript
export const Lib = {
  install,
  name: pack.name,
  version: pack.version,
  routes: RouteList,
  onSetup() {
    createAuthGuard()
  },
}
```

`apps-workspace` 的 `routes: []`，业务子路由由 `apps-home` 动态注入。

## 定义路由

### 静态路由（登录 / Home 布局）

```typescript
// apps-login: 登录页
const LOGIN_ROUTE: RouteRecordItem = {
  path: '/',
  name: 'Login',
  component: () => import('../pages/Login/index.vue'),
  meta: {
    title: t('routes.basic.login'),
    whiteRoute: true,
    isBasic: true,
  },
}

// apps-home: 布局壳
const HOME_ROUTE: RouteRecordItem = {
  path: '/home',
  name: 'Home',
  component: () => import('../pages/home.vue'),
  meta: { title: '首页', isBasic: true },
}
```

路由 `meta` 字段说明：

| 字段 | 说明 |
|------|------|
| `isBasic` | `true` 时注册为 `basicRoutes`（如登录页、Home 布局） |
| `whiteRoute` | 白名单路由，跳过权限校验 |
| `title` | 页面标题，支持国际化 |

### 动态路由（业务页面）

业务页面采用**配置与组件分离**模式，详见 [路由与菜单](/guide/architecture/routing-and-menu)。

**步骤 1** — 在 `config.ts` 中定义树形配置：

```typescript
export const WORKSPACE_ROUTE_CONFIGS: WorkspaceRouteConfig[] = [
  {
    path: 'workspace-catalog',
    name: 'WorkspaceCatalog',
    meta: { title: '工作区' },
    children: [
      { path: 'workspace', name: 'Workspace', meta: { title: '工作台' } },
      { path: 'settings', name: 'WorkspaceSettings', meta: { title: '设置中心' } },
    ],
  },
]
```

**步骤 2** — 在 `index.ts` 中注册组件映射：

```typescript
const WORKSPACE_COMPONENTS: Record<string, GrowRouteComponent> = {
  Workspace: () => import('../pages/workspace.vue'),
  WorkspaceSettings: () => import('../pages/settings.vue'),
}
```

**步骤 3** — Mock 引用纯配置（不含 `.vue`）：

```typescript
import { WORKSPACE_ROUTE_CONFIGS } from '@grow-admin-cornerstone/apps-workspace/route-config'
// GET /api/menu/list → { menuList: WORKSPACE_ROUTE_CONFIGS }
```

## 编写页面

业务页面只使用 `Grow*` 契约组件：

```vue
<script lang="ts" setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-8">
    <GrowInput v-model="username" placeholder="用户名" />
    <GrowInput v-model="password" type="password" placeholder="密码" />
    <GrowButton type="primary">登录</GrowButton>
  </div>
</template>
```

## 声明依赖

在业务模块 `package.json` 中：

```json
{
  "name": "@grow-admin-cornerstone/apps-login",
  "peerDependencies": {
    "vue": "~3.3.4",
    "@grow-admin-rock/components": "workspace:*"
  },
  "devDependencies": {
    "@grow-admin-rock/components": "workspace:*"
  }
}
```

::: warning 不要依赖三方 UI 库
业务模块只 peer 依赖 `@grow-admin-rock/components`，不直接依赖 `element-plus` / `naive-ui` / `ant-design-vue`。
:::

## 宿主接入

在 `sample/src/plugin/initIoc.ts` 中注册模块：

```typescript
import { Lib as appsLoginLib } from '@grow-admin-cornerstone/apps-login'
import { Lib as appsHomeLib } from '@grow-admin-cornerstone/apps-home'
import { Lib as appsWorkspaceLib } from '@grow-admin-cornerstone/apps-workspace'

app
  .use(IocPlugin, iocOptions)
  .use(infrastructureLib, appContext)
  .use(stateLib, appContext)
  .use(localeLib, appContext)
  .use(mockLib, appContext)
  .use(routeLib, appContext)
  .use(appsLoginLib, appContext)
  .use(appsHomeLib, appContext)
  .use(appsWorkspaceLib, appContext)
  .use(componentsLib, appContext)
```

业务模块**不需要**自行安装组件驱动，依赖宿主应用完成初始化。

## 新增业务页面

以在 `apps-workspace` 中新增页面为例：

1. 新建 `src/pages/xxx.vue`
2. 在 `src/routes/config.ts` 追加树形节点
3. 在 `src/routes/index.ts` 的 `WORKSPACE_COMPONENTS` 添加 `name → import()` 映射
4. Mock 自动生效（`sample/mock/routers.ts` 引用 `route-config`）
5. 重新登录验证

## 创建新业务模块

1. 在 `DesignCornerstone/` 下创建新目录，如 `cornerstone-apps-dashboard`
2. 初始化 `package.json`，包名遵循 `@grow-admin-cornerstone/<module-name>`
3. 创建 `library.ts`，声明 `routes` 和可选的 `module`（IOC 绑定）
4. 在 `pnpm-workspace.yaml` 中确认 `DesignCornerstone/*` 已包含
5. 在宿主的 `package.json` 中添加 workspace 依赖
6. 在 `initIoc.ts` 中 `.use(newLib, appContext)`

若业务页面需动态注册，参考 `apps-workspace` 的配置分离模式。

### 带 IOC 绑定的模块

如果模块需要提供 IOC 服务（如 Store、Service），可以声明 `module`：

```typescript
import { AsyncIocModule } from '@grow-admin-rock/ioc'
import { toPackage } from '@grow-admin-rock/base-package'

export const Lib = toPackage({
  name: '@grow-admin-cornerstone/apps-dashboard',
  version: '1.0.0',
  types: Beans,
  module: new AsyncIocModule(async (bind) => {
    bind(Beans.DashboardService).to(DashboardService)
  }),
  routes: RouteList,
})
```

## 开发规范

| ✅ 推荐 | ❌ 禁止 |
|---------|---------|
| 使用 `Grow*` 契约组件编写页面 | 直接 import 三方 UI 组件 |
| 通过 `library.ts` 声明路由 | 在宿主中硬编码业务路由 |
| peer 依赖 `@grow-admin-rock/components` | 业务模块安装/切换驱动 |
| 路由守卫放在模块 `src/routes/guard.ts` | 在宿主中编写业务守卫逻辑 |
| 动态路由配置与组件映射分离 | 在 Mock 中 import `.vue` 文件 |
| 通过 IoC 获取 router 实例 | 直接 `import { useRouter } from 'vue-router'` |

## 下一步

- [路由与菜单](/guide/architecture/routing-and-menu) — 动态路由注册详解
- [局部覆盖组件库](/guide/development/local-override)
- [DesignCornerstone 包说明](/guide/packages/design-cornerstone)
