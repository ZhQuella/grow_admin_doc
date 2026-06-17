---
title: 路由与菜单
lang: zh-CN
---

# 路由与菜单

Grow Admin 采用 **静态基础路由 + 接口驱动动态路由** 的模式。登录后进入 Home 布局，业务页面作为 Home 的**子路由**渲染在 `home.vue` 的 `<router-view />` 中；侧边菜单与路由共用同一份接口数据，但职责分离：**目录节点只负责菜单展示，叶子节点才注册为可访问路由**。

## 设计理念：为什么动静分离？

### 中后台路由的两种本质

| 类型 | 例子 | 谁决定 | 是否随权限变 |
|------|------|--------|--------------|
| 框架路由 | 登录、Home 布局 | 前端约定 | 否 |
| 业务路由 | 工作台、设置、报表 | 后端权限 / 菜单 | 是 |

**全静态**：每加一个菜单项都要发版，权限与前端路由表强耦合。  
**全动态**：连登录页都等接口，首屏慢，离线开发困难。

Grow Admin 选择 **骨架静态 + 业务动态**：

```
静态：/ 、/home          ← 应用一定能启动、能登录、能展示布局
动态：/home/workspace…   ← 登录后按接口注入，与权限系统对齐
```

### 为什么业务路由是 Home 的子路由？

```
/home                 ← Layout、侧栏、设置抽屉只挂载一次
  └─ /home/workspace  ← 仅 <router-view /> 区域切换
```

好处：

- **布局状态不丢失**（菜单折叠、主题）随子路由切换保留
- **权限重置**时只清动态子路由，Home 壳不动
- **面包屑、标签页**等有稳定的父级锚点

### 为什么菜单和路由同源却分开处理？

后端通常返回**一棵树**（含目录与页面），但：

- **Vue Router** 只需要可导航的叶子路径
- **侧边菜单** 需要完整树形（含不可点击的目录）

一份数据、`flatten` 给 Router、`tree` 给 Menu——避免维护两套接口导致「菜单有、路由无」的 bug。

### 为什么配置与组件要分离？

`route-config` 只有 JSON 元数据，`.vue` 留在前端映射：

| 角色 | 职责 |
|------|------|
| 后端 / Mock | 「有哪些页面、叫什么、图标是什么」 |
| 前端 | 「这个 name 对应哪个组件文件」 |

后端不应也不需知道 `.vue` 路径；前端组件重构不影响接口契约。

## 架构概览

```
业务包路由配置（apps-workspace/route-config）
        ↓  Mock / 真实接口  GET /api/menu/list
apps-home/registerDynamicRoutes.ts
        ├─ flatten → router.addRoute('Home', route)   ← 仅叶子节点
        └─ tree    → authStore.backMenuList            ← 保留树形结构
        ↓
rock-layouts/menu（MenuTreeNode 递归渲染）
        ↓ 点击叶子菜单
router.push('/home/xxx')  ← 通过 IoC 获取 router 实例
        ↓
home.vue <router-view /> 渲染业务页面
```

| 层级 | 路由路径 | 说明 |
|------|----------|------|
| 根 | `/` | Login（静态，`whiteRoute: true`） |
| 布局 | `/home` | Home 布局壳（静态，`isBasic: true`） |
| 业务 | `/home/workspace`、`/home/settings` | 动态注册的 Home 子路由 |

## 路由实例的获取方式

**业务代码与布局组件不直接 `import { useRouter } from 'vue-router'`**，统一通过 `@grow-admin-rock/middleware-router` + IoC 获取：

### 为什么不用 `useRouter()`？

| 考量 | 说明 |
|------|------|
| 包依赖 | `rock-layouts` 是框架包，不应强依赖 `vue-router` composable |
| 实例一致 | 动态 `addRoute` 与菜单 `push` 必须用同一个 router 实例 |
| 架构一致 | 与 HTTP、RouteOperator 等服务一样走 IOC，便于测试替换 |

`useRouter()` 依赖 Vue 组件 setup 上下文；布局、工具函数可能在不同上下文中执行，**服务定位比 composable 更稳定**。

```typescript
import { Lib as routeLib } from '@grow-admin-rock/middleware-router'
import { resolveByKeyOrThrow } from '@grow-admin-rock/ioc'

const router = resolveByKeyOrThrow(routeLib.types.RouteTable).router

router.push('/home/workspace')
router.addRoute('Home', childRoute)
```

宿主应用在 `sample/src/plugin/initIoc.ts` 末尾挂载路由：

```typescript
const router = diKT(routeLib.types.RouteTable).router
app.use(router)
await router.isReady()
```

::: info 为何在宿主挂载路由
`middleware-router` 的 `library.ts` 中 `app.use(router)` 被注释（避免守卫失效），因此路由实例由 IOC 创建后，**必须在宿主 `initIoc.ts` 中手动挂载**。
:::

宿主路由文件 `sample/src/routers/router.ts` 当前为**空数组**，所有路由由业务 Library 注册，该文件仅作宿主级扩展点。

## 静态路由注册

各业务模块通过 `Lib.routes` 在 IOC 加载时注册到 `AppContext`：

```typescript
// cornerstone-apps-home/src/routes/index.ts
const HOME_ROUTE: RouteRecordItem = {
  path: '/home',
  name: 'Home',
  component: () => import('../pages/home.vue'),
  meta: { title: '首页', isBasic: true },
  // 注意：业务子路由不在此静态声明，由接口动态注入
}

export const RouteList: RouteRecordItem[] = [HOME_ROUTE]
```

| `meta` 字段 | 含义 |
|-------------|------|
| `isBasic: true` | 基础路由，应用启动时写入 router，重置路由时不会被移除 |
| `whiteRoute: true` | 白名单路由（如 Login），未登录可访问 |

## 动态路由注册

动态路由在**用户已登录且首次进入受保护页面时**完成，核心逻辑位于 `cornerstone-apps-home/src/routes/registerDynamicRoutes.ts`：

```typescript
export async function registerDynamicRoutes() {
  const { menuList } = await getMenuList()

  flattenWorkspaceRouteConfigs(menuList).forEach((config) => {
    const route = resolveWorkspaceRoute(config)
    router.addRoute('Home', route)
  })

  authStore.setBackMenuList(toMenuList(menuList))
}
```

**路由守卫**（`cornerstone-apps-home/src/routes/guard.ts`）保证注册时机正确——必须在导航完成前注册，否则直接访问 `/home/workspace` 会因路由不存在而无法匹配：

```typescript
if (!authStore.getIsDynamicAddedRoute) {
  await registerDynamicRoutes()
  authStore.setDynamicAddedRoute(true)
  next({ path: to.fullPath, query: to.query, hash: to.hash, replace: true })
  return
}
```

::: warning 注册时机
不可仅在 `home.vue` 的 `onMounted` 中注册路由：若用户直接访问子路由 URL，Home 组件尚未挂载，动态路由永远不会被添加。
:::

### 守卫与 Bootstrap：为何两处都能注册路由？

| 机制 | 触发时机 | 解决什么问题 |
|------|----------|--------------|
| **路由守卫** | 首次进入受保护路由之前 | 用户直链 `/home/workspace` 时，导航发生前路由必须已存在 |
| **useAppBootstrap** | Home 组件 `onMounted` 之后 | 拉取数据时展示 PageLoading，优化进入首页的体验 |

两者通过 `authStore.isDynamicAddedRoute` 去重。**守卫保证正确性，Bootstrap 保证体验**——这是刻意设计的职责分离，而非重复代码。

## 业务包路由配置（apps-workspace）

业务模块维护**两份配置**，职责分离：

| 文件 | 职责 | 是否含 `.vue` 组件 |
|------|------|-------------------|
| `src/routes/config.ts` | 可序列化的树形菜单/路由元数据，供 Mock 与接口返回 | ❌ |
| `src/routes/index.ts` | 本地 `component` 映射 + `resolveWorkspaceRoute()` | ✅ |

**树形配置示例**（`config.ts`）：

```typescript
export const WORKSPACE_ROUTE_CONFIGS: WorkspaceRouteConfig[] = [
  {
    path: 'workspace-catalog',
    name: 'WorkspaceCatalog',
    icon: 'ant-design:folder-outlined',
    meta: { title: '工作区' },
    children: [
      {
        path: 'workspace',
        name: 'Workspace',
        icon: 'ant-design:appstore-outlined',
        meta: { title: '工作台' },
      },
      {
        path: 'settings',
        name: 'WorkspaceSettings',
        meta: { title: '设置中心' },
      },
    ],
  },
]
```

**组件映射**（`routes/index.ts`）——API 只返回元数据，组件在客户端解析：

```typescript
const WORKSPACE_COMPONENTS: Record<string, GrowRouteComponent> = {
  Workspace: () => import('../pages/workspace.vue'),
  WorkspaceSettings: () => import('../pages/settings.vue'),
}
```

Mock 通过子路径导出引用纯配置，避免 vite-plugin-mock 打包 `.vue` 文件：

```typescript
// sample/mock/routers.ts
import { WORKSPACE_ROUTE_CONFIGS } from '@grow-admin-cornerstone/apps-workspace/route-config'

// GET /api/menu/list → { menuList: WORKSPACE_ROUTE_CONFIGS }
```

## 路由与菜单的关系

同一份接口数据，`registerDynamicRoutes` 处理后产生两种结构：

| 用途 | 数据结构 | 处理方式 |
|------|----------|----------|
| Vue Router | 扁平叶子路由 | `flattenWorkspaceRouteConfigs()` → `addRoute('Home', route)` |
| 侧边菜单 | 树形 `Menu[]` | `toMenuList()` → `authStore.backMenuList` |

**字段映射规则**（`toMenuItem`）：

| 节点类型 | `Menu.path` | 是否注册路由 | 点击行为 |
|----------|-------------|-------------|----------|
| 目录（有 `children`） | `name` 字符串（如 `WorkspaceCatalog`） | ❌ | 展开/收起，不跳转 |
| 叶子（无 `children`） | 完整路径（如 `/home/workspace`） | ✅ | `router.push(path)` |

菜单状态存储在 `@grow-admin-rock/state` 的 `authStore.backMenuList`，侧边栏从该字段读取并渲染。

## 菜单渲染（rock-layouts）

`@grow-admin-rock/layouts` 的 `Menu` 组件从 `authStore.backMenuList` 读取数据，通过 `MenuTreeNode` **递归组件**渲染树形菜单：

```
Menu（menu.vue）
  └─ MenuTreeNode（递归）
       ├─ 有 children → GrowSubMenu（目录）
       └─ 无 children → GrowMenuItem（可点击菜单项）
```

Element Plus 的 `ElMenu` 要求 `SubMenu` / `MenuItem` 作为**直接子节点**，因此不可使用 `<template v-for>` 包裹，必须通过递归组件保证每个节点只有一个根元素。

这是 UI 库的实现约束，不是过度设计——用递归组件 `MenuTreeNode` 既满足 ElMenu 结构要求，又保持模板清晰。

菜单点击跳转同样通过 IoC 获取 router（**不依赖 vue-router 作为 layouts 的直接依赖**）：

```typescript
function handleMenuSelect(path: string) {
  if (!path.startsWith('/')) return
  resolveByKeyOrThrow(routeLib.types.RouteTable).router.push(path)
}
```

Home 页面通过 Teleport 将 Menu 挂载到布局插槽：

```vue
<!-- cornerstone-apps-home/src/pages/home.vue -->
<template #view>
  <router-view />
</template>

<Teleport to="#grow-menu">
  <Menu />
</Teleport>
```

## 新增业务页面流程

以在 `apps-workspace` 中新增页面为例：

1. **新建页面组件** — `src/pages/xxx.vue`
2. **更新树形配置** — 在 `src/routes/config.ts` 的 `children` 中追加节点（或新增目录）
3. **注册组件映射** — 在 `src/routes/index.ts` 的 `WORKSPACE_COMPONENTS` 中添加 `name → import()` 对应关系
4. **Mock 自动生效** — `sample/mock/routers.ts` 引用 `route-config`，无需额外修改
5. **重启/刷新** — 重新登录或清除 `isDynamicAddedRoute` 状态后验证

## 关键文件索引

| 文件 | 职责 |
|------|------|
| `cornerstone-apps-workspace/src/routes/config.ts` | 树形路由/菜单元数据（Mock 安全导出） |
| `cornerstone-apps-workspace/src/routes/index.ts` | 组件映射、`resolveWorkspaceRoute()` |
| `cornerstone-apps-home/src/routes/index.ts` | Home 静态路由 |
| `cornerstone-apps-home/src/routes/guard.ts` | 登录守卫 + 动态路由注册触发 |
| `cornerstone-apps-home/src/routes/registerDynamicRoutes.ts` | 拉取菜单、注册路由、写入 state |
| `cornerstone-apps-home/src/api/routers.ts` | `getMenuList()` 接口定义 |
| `sample/mock/routers.ts` | 开发环境 Mock 菜单接口 |
| `rock-layouts/src/menu/menu.vue` | 侧边菜单容器 |
| `rock-layouts/src/menu/MenuTreeNode.vue` | 菜单树递归节点 |
| `rock-state/src/modules/authStore.ts` | `backMenuList` 菜单状态 |
| `rock-middleware-router/` | 路由表 IoC 注册、`RouteOperator` |

## 开发自检清单

1. 登录后直接访问 `/home/workspace`，页面正常渲染（非空白、非跳转 Login）。
2. 侧边栏显示树形目录，目录节点点击不跳转，叶子节点点击切换路由。
3. 当前路由对应的菜单项高亮。
4. Mock 接口 `/api/menu/list` 返回的数据结构与 `config.ts` 一致。
5. 新增页面后，`WORKSPACE_COMPONENTS` 中存在对应 `name` 映射，否则 `resolveWorkspaceRoute` 会抛错。

## 路由操作器（RouteOperator）

`@grow-admin-rock/middleware-router` 提供 IOC 服务 `RouteOperator`，用于编程式导航：

| 方法 | 说明 |
|------|------|
| `go(opt, isReplace?)` | `router.push` / `replace` 封装 |
| `redo()` | 通过 `REDIRECT_NAME` 刷新当前路由 |

```typescript
import { diKT } from '@grow-admin-rock/ioc'
import { Lib as routeLib } from '@grow-admin-rock/middleware-router'

const operator = diKT(routeLib.types.RouteOperator)
operator.go({ name: 'Workspace' })
operator.redo()
```

## 下一步

- [架构设计理念](/guide/architecture/design-philosophy) — 路由设计在整体架构中的位置
- [认证与登录](/guide/development/authentication) — Token 与守卫细节
- [业务模块开发](/guide/development/business-module) — 创建新业务模块
