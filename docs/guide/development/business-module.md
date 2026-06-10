---
title: 业务模块开发
lang: zh-CN
---

# 业务模块开发

Grow Admin 的业务功能以独立 npm 包形式存放在 `DesignCornerstone/` 目录下，通过 Library 约定接入宿主应用。本文以 `cornerstone-apps-login` 为例说明开发流程。

## 模块结构

```
DesignCornerstone/cornerstone-apps-login/
├── index.ts              # 包入口
├── library.ts            # Library 声明
├── package.json          # 依赖声明
└── src/
    ├── index.ts          # 模块导出
    ├── routes/
    │   ├── index.ts      # 路由定义
    │   └── guard.ts      # 路由守卫
    ├── pages/
    │   └── login.vue     # 登录页面
    ├── usage.ts          # 模块使用工具
    └── constant.ts       # 常量
```

## 声明 Library

`library.ts` 是模块与宿主之间的契约：

```typescript
import * as pack from './package.json';
import { install } from '@grow-admin-rock/base-package';
import { RouteList } from '#/routes';

export const Lib = {
  install,
  name: pack.name,
  version: pack.version,
  routes: RouteList,
};
```

`install` 函数（来自 `@grow-admin-rock/base-package`）会自动将 `routes` 注册到 `AppContext`。

## 定义路由

```typescript
import { t } from '@grow-admin-rock/locale';

const LOGIN_ROUTE: RouteRecordItem = {
  path: '/login',
  name: 'Login',
  component: () => import('../pages/login.vue'),
  meta: {
    title: t('routes.basic.login'),
    whiteRoute: true,   // 白名单路由，无需权限
    isBasic: true,      // 基础路由
  },
};

export const RouteList: RouteRecordItem[] = [LOGIN_ROUTE];
```

路由 `meta` 字段说明：

| 字段 | 说明 |
|------|------|
| `isBasic` | `true` 时注册为 `basicRoutes`（如登录页） |
| `whiteRoute` | 白名单路由，跳过权限校验 |
| `title` | 页面标题，支持国际化 |

## 编写页面

业务页面只使用 `Grow*` 契约组件：

```vue
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
import { Lib as appsLoginLib } from '@grow-admin-cornerstone/apps-login';

// 装配顺序
app
  .use(IocPlugin, iocOptions)
  .use(infrastructureLib, appContext)
  .use(routeLib, appContext)
  .use(appsLoginLib, appContext)    // ← 业务模块
  .use(componentsLib, appContext);
```

业务模块**不需要**自行安装组件驱动，依赖宿主应用完成初始化。

## 创建新业务模块

1. 在 `DesignCornerstone/` 下创建新目录，如 `cornerstone-apps-dashboard`
2. 初始化 `package.json`，包名遵循 `@grow-admin-cornerstone/<module-name>`
3. 创建 `library.ts`，声明 `routes` 和可选的 `module`（IOC 绑定）
4. 在 `pnpm-workspace.yaml` 中确认 `DesignCornerstone/*` 已包含
5. 在宿主的 `package.json` 中添加 workspace 依赖
6. 在 `initIoc.ts` 中 `.use(newLib, appContext)`

### 带 IOC 绑定的模块

如果模块需要提供 IOC 服务（如 Store、Service），可以声明 `module`：

```typescript
import { AsyncIocModule } from '@grow-admin-rock/ioc';
import { toPackage } from '@grow-admin-rock/base-package';

export const Lib = toPackage({
  name: '@grow-admin-cornerstone/apps-dashboard',
  version: '1.0.0',
  types: Beans,
  module: new AsyncIocModule(async (bind) => {
    bind(Beans.DashboardService).to(DashboardService);
  }),
  routes: RouteList,
});
```

## 开发规范

| ✅ 推荐 | ❌ 禁止 |
|---------|---------|
| 使用 `Grow*` 契约组件编写页面 | 直接 import 三方 UI 组件 |
| 通过 `library.ts` 声明路由 | 在宿主中硬编码业务路由 |
| peer 依赖 `@grow-admin-rock/components` | 业务模块安装/切换驱动 |
| 路由守卫放在模块 `src/routes/guard.ts` | 在宿主中编写业务守卫逻辑 |

## 下一步

- [局部覆盖组件库](/guide/development/local-override)
- [DesignCornerstone 包说明](/guide/packages/design-cornerstone)
