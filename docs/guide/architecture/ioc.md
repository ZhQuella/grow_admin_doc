---
title: IOC 模块化
lang: zh-CN
---

# IOC 模块化架构

Grow Admin 使用 [Inversify](https://inversify.io/) 实现依赖注入（IOC），所有功能模块以 **Library** 形式声明，由宿主应用统一装配。

## 核心概念

| 概念 | 说明 |
|------|------|
| `IocContainer` | 基于 Inversify 的 IOC 容器，管理所有服务的生命周期 |
| `AsyncIocModule` | 异步 IOC 模块，在容器加载时绑定服务 |
| `Library` | 模块的对外契约，包含 `install`、`module`、`routes`、`onSetup` 等钩子 |
| `AppContext` | 应用上下文，管理路由注册、IOC 模块列表、参数传递与生命周期钩子 |
| `diKT` / `di` | 从 IOC 容器中获取已注册服务的工具函数 |

## Library 契约

每个可装配的模块都实现 `Library` 接口，通过 `toPackage()` 或 `install` 函数接入：

```typescript
export const Lib: Library<typeof Beans> = toPackage({
  name: '@grow-admin-rock/components',
  version: '1.0.0',
  types: Beans,                          // IOC 服务标识符
  module: new AsyncIocModule(async (bind) => {
    bind(Beans.ComponentMap).toConstantValue(new ComponentMap());
  }),
  routes: RouteList,                     // 可选：路由列表
  onSetup: async (app, appContext) => {   // 可选：IOC 加载完成后执行
    // 注册全局组件、挂载插件等
  },
  beforeSetup: async (app, appContext) => { // 可选：IOC 加载前执行
  },
  priority: 0,                           // 可选：生命周期钩子优先级
});
```

### install 自动处理

`@grow-admin-rock/base-package` 提供的 `install` 函数会自动完成：

1. 将 `module`（AsyncIocModule）推入 `AppContext.iocModules`
2. 将 `beforeSetup` 注册为 IOC 加载前钩子
3. 将 `onSetup` 注册为 IOC 加载后钩子
4. 将 `routes` 注册到 `AppContext` 的路由表

## AppContext 生命周期

```
宿主创建 AppContext
    ↓
各 Library.install(app, appContext)    ← 收集 IOC 模块、路由、钩子
    ↓
appContext.load(app)
    ├── 绑定 APP_CONTEXT 到 IOC 容器
    ├── 执行 preObservers（beforeSetup 钩子）
    ├── container.loadAsync(...iocModules)  ← 加载所有 IOC 模块
    └── 执行 loadedObservers（onSetup 钩子）
```

### 路由分类

`AppContext.registerRoutes()` 根据 `meta.isBasic` 将路由分为两类：

| 类型 | 条件 | 用途 |
|------|------|------|
| `basicRoutes` | `meta.isBasic === true` | 基础路由（如登录页），不需要权限 |
| `appRoutes` | 其他 | 应用路由，需要权限与菜单 |

## 宿主装配顺序

`sample/src/plugin/initIoc.ts` 中的装配顺序**必须保持**：

```typescript
await installComponentDriver(app, appContext);  // 1. 安装组件驱动

app
  .use(IocPlugin, iocOptions)                   // 2. 安装 IOC 插件
  .use(infrastructureLib, appContext)          // 3. 基础设施（HTTP）
  .use(routeLib, appContext)                    // 4. 路由中间件
  .use(appsLoginLib, appContext)                 // 5. 业务模块
  .use(componentsLib, appContext);              // 6. 契约组件库

await appContext.load(app);                      // 7. 加载 IOC 容器

const router = diKT(routeLib.types.RouteTable).router;
app.use(router);                                 // 8. 挂载路由
await router.isReady();
```

::: warning 顺序敏感
组件驱动必须在 IOC 加载之前安装，因为 `componentsLib.onSetup` 依赖 `AppContext` 中的 `DriverComponentDictionary` 参数。
:::

## 创建业务模块

以 `cornerstone-apps-login` 为例，最小业务模块结构：

```
cornerstone-apps-login/
├── index.ts           # 导出入口
├── library.ts         # Library 声明
├── package.json       # peer 依赖 @grow-admin-rock/components
└── src/
    ├── routes/        # 模块路由
    └── pages/         # 模块页面
```

`library.ts` 示例：

```typescript
import { install } from '@grow-admin-rock/base-package';
import { RouteList } from '#/routes';

export const Lib = {
  install,
  name: '@grow-admin-cornerstone/apps-login',
  version: '1.0.0',
  routes: RouteList,
};
```

在宿主中接入：

```typescript
import { Lib as appsLoginLib } from '@grow-admin-cornerstone/apps-login';

app.use(appsLoginLib, appContext);
```

## 从 IOC 容器获取服务

```typescript
import { diKT, di } from '@grow-admin-rock/ioc';
import { Beans as routeBeans } from '@grow-admin-rock/middleware-router';

// 通过 types 标识符获取
const routeTable = diKT(routeBeans.RouteTable);
const router = routeTable.router;
```

## 开发规范

| ✅ 推荐 | ❌ 禁止 |
|---------|---------|
| 通过 Library 声明模块能力 | 在宿主中直接 import 业务模块内部实现 |
| 使用 `AppContext.registerParam` 传递跨模块参数 | 模块间通过全局变量通信 |
| 业务模块 peer 依赖 `@grow-admin-rock/components` | 业务模块直接依赖三方 UI 库 |
| 保持 `initIoc.ts` 中的装配顺序 | 在业务模块中自行安装驱动 |

## 下一步

- [组件驱动架构](/guide/architecture/component-driver)
- [业务模块开发](/guide/development/business-module)
