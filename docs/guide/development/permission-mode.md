---
title: 权限模式
lang: zh-CN
---

# 权限模式

Grow Admin 通过 **`permissionMode`** 决定登录后动态菜单与路由从哪里来、如何拼装。角色信息只挂在 `UserInfo.roles` 上（用 `role.value` 做白名单匹配），**没有**单独的「ROLE 权限模式」枚举项。

本文说明三种模式的设计动机、配置方式、开发步骤与常见踩坑。更偏「路由结构本身」的内容见 [路由与菜单](/guide/architecture/routing-and-menu)。

## 设计理念：为什么要三种模式？

| 模式 | 适合谁 | 核心假设 |
|------|--------|----------|
| **BACK** | 菜单完全由后台管理系统下发 | 「有哪些页面」以后端为准，前端只提供组件映射 |
| **FRONT** | 前端写死路由表，按登录角色裁剪 | 无菜单接口或接口不可用，也能开发演示 |
| **MIXTURE** | 基础能力前端兜底，运营菜单后端扩展 | 同名冲突时以后端为准，避免双份数据互相覆盖错乱 |

**为什么去掉旧的 ROLE / ROUTE_MAPPING？**

- 角色过滤是横切能力，不是「菜单来源」；应挂在 FRONT / MIXTURE 的前端树上，而不是再占一个模式名。
- `ROUTE_MAPPING` 语义模糊，已重命名为更直观的 **FRONT**（前端路由表）。

**为什么 MIXTURE 同名整条用后端？**

合集时若字段级 merge，极易出现「title 来自前端、path 来自后端」的半成品节点。约定：**同名节点整条以后端为准**，`children` 再递归合集——行为可预期，调试成本更低。

## 三种模式对照

| 枚举 | 值 | 路由注册数据 | authStore 写入 | 侧栏最终展示 |
|------|-----|--------------|----------------|--------------|
| `PermissionModeEnum.BACK` | `BACK` | 仅 `GET /api/menu/list` | `backMenuList` | `backMenuList`（按 `sort`） |
| `PermissionModeEnum.FRONT` | `FRONT` | `toFeatRouteConfigs()` → 角色过滤 | `frontMenuList` | `frontMenuList`（按 `sort`） |
| `PermissionModeEnum.MIXTURE` | `MIXTURE` | 前端（先过滤）∪ 后端合集 | 两边都写；路由用合集 | `mergeTreesByName(front, back)` |

```
BACK     → getMenuList() ──────────────────────────→ backMenuList + 注册路由
FRONT    → toFeatRouteConfigs → filterByRoles ─────→ frontMenuList + 注册路由
MIXTURE  → front(过滤) ∪ back → mergeTreesByName ─→ 合集注册路由
           （同时仍分别写入 frontMenuList / backMenuList）
```

核心实现：`cornerstone-apps-home/src/routes/registerDynamicRoutes.ts`。

## 如何配置

### 1. 切换模式（必做）

宿主静态配置：

```typescript
// sample/src/projectSetting.ts
import { PermissionModeEnum } from '@grow-admin-rock/constants'

export const projectSetting: ProjectSetting = {
  permissionMode: PermissionModeEnum.MIXTURE, // BACK | FRONT | MIXTURE
  // ...
}
```

### 2. 启动同步（已内置）

`sample/src/initAppConfig.ts` 每次启动都会把 `permissionMode` 从 `projectSetting` 同步进 `useAppConfig()`：

```typescript
appConfig.$patch({
  lockTime: mappedConfig.lockTime,
  useLockPage: mappedConfig.useLockPage,
  permissionMode: configuredMode, // 以配置文件为准
})
```

因此：**改 `projectSetting.ts` 即可切换模式**，不必依赖设置抽屉持久化字段。

### 3. 模式变更与本地缓存

框架用 `LAST_PERMISSION_MODE` 记录上次成功应用的模式。若与当前配置不一致：

1. 清空菜单 / 标签相关状态（`clearPermissionRelatedCaches`）
2. 动态路由层调用 `resetRouter()`
3. 守卫若发现目标 URL 在新模式下不可达，则 `next({ name: 'Home' })`，避免旧书签白屏

| 存储 | Key（带 `createStorageName` 前缀） | 说明 |
|------|-----------------------------------|------|
| localStorage | `__LAST_PERMISSION_MODE` | 上次生效模式 |
| sessionStorage | `__TAB` | 标签页；模式变更时清除 |
| localStorage | `__APP_CONFIG` | 应用配置；`permissionMode` 仍以 projectSetting 覆盖 |

实现：`rock-state/src/modules/permissionModeCache.ts`、`registerDynamicRoutes`、`guard.ts`。

### 4. 运行时读取模式

```typescript
import { Lib as routeLib } from '@grow-admin-rock/middleware-router'
import { resolveByKeyOrThrow } from '@grow-admin-rock/ioc'

const menuState = resolveByKeyOrThrow(routeLib.types.MenuState)
menuState.isBackMode()
menuState.isFrontMode()
menuState.isMixtureMode()
menuState.getPermissionMode()
```

`MenuState` 内部读的是 `useAppConfig().permissionMode`。

## MIXTURE 合集规则

`mergeTreesByName(frontList, backList)`（`rock-state/src/modules/mergeTreesByName.ts`）：

1. **先铺前端**，再叠后端
2. 后端出现**新 name**：追加
3. 后端与前端**同名**：整条节点采用后端数据；两边的 `children` **再按 name 递归合集**
4. 结果按 **`sort` 升序**（缺省 `0`）

侧栏在 MIXTURE 下也会再次 `mergeTreesByName(frontMenuList, backMenuList)`，与注册路由用的合集规则一致。

### 演示约定（sample）

| name | 来源 | 用途 |
|------|------|------|
| `MixtureDemoCatalog` | 两端可共存 | 目录「权限演示」 |
| `MixtureFrontDemo` | 仅前端 `FEAT_FRONT_ONLY_*` | 验证「前端独有」进合集 |
| `MixtureBackDemo` | 仅后端 workspace + Mock | 验证「后端独有」进合集 |

建议顶层 `sort`：Dashboard `10`、功能示例 `20`、权限演示 `30`、外部页面 `40`。

::: tip 前端独有项不要进 Mock
`FEAT_FRONT_ONLY_MENU_LIST` / `FEAT_FRONT_ONLY_STRUCTURES` **不要**并进会返回给 `/api/menu/list` 的列表，否则 BACK / MIXTURE 后端侧也会带上「本应只存在于前端」的菜单。
:::

## FRONT / MIXTURE：角色过滤怎么配

### 角色从哪来

登录人角色来自 `UserInfo.roles`：

```typescript
roles: [{ name: 'Super Admin', value: 'super' }]
```

- Mock：`sample/mock/auth.ts`（登录）与用户信息接口需带回 `roles`
- 注册动态路由前：`registerDynamicRoutes` 会确保 `userStore` 有用户信息，再取 `roles.map(r => r.value)`

::: warning 没有 roles 会怎样？
FRONT / MIXTURE 会对前端树做过滤。若 `roles` 为空或缺失，白名单交集为空，**前端菜单可能被滤空**（MIXTURE 仍可能只剩后端树）。
:::

### 白名单表

```typescript
// DesignCornerstone/cornerstone-apps-feat/src/routes/authority.ts
export const FEAT_ROUTE_AUTHORITY: Record<string, string[]> = {
  FeatCatalog: ['super', 'minor'],
  OpenSubpage: ['super'],
  MixtureDemoCatalog: ['super', 'minor'],
  MixtureFrontDemo: ['super', 'minor'],
  Child: ['super'], // 隐藏子路由也要配
}
```

规则（与参考项目一致）：

| 规则 | 行为 |
|------|------|
| name 未配置 | **无权限** |
| 叶子节点 | `roles` 与白名单有交集才保留 |
| 有 children | 先过滤子级；子级非空则保留父级（即使父级自身未匹配也可因「还有子菜单」保留） |

工具函数：`filterConfigsByRoles`、`canAccessRouteByRoles`。

**BACK 模式**不使用该表过滤接口菜单。隐藏路由 `FEAT_HIDDEN_ROUTES` 在 FRONT / MIXTURE 下会按角色过滤；BACK 下默认注册隐藏路由（不做角色裁剪）。

## 前端路由表：如何开发（FRONT / MIXTURE）

前端完整配置 = **展示信息** + **结构**，由 `toFeatRouteConfigs()` 合并。

### 相关文件

| 文件 | 职责 |
|------|------|
| `apps-feat/src/routes/menuList.ts` | `FEAT_MENU_LIST`：title / icon / sort / 可见性（可与 BACK Mock 共用） |
| 同上 | `FEAT_FRONT_ONLY_MENU_LIST`：仅前端展示项 |
| `apps-feat/src/routes/config.ts` | `FEAT_ROUTE_STRUCTURES` / `FEAT_FRONT_ONLY_STRUCTURES`：path、componentKey |
| `apps-feat/src/routes/mergeMenu.ts` | `mergeFeatMenuWithStructure` / `toFeatRouteConfigs` |
| `apps-feat/src/routes/authority.ts` | 角色白名单 |
| `apps-feat/src/routes/index.ts` | 组件映射、`resolveFeatRoute` |
| `apps-feat/src/pages/**` | 页面组件 |

### 新增一个需鉴权的前端页面（推荐步骤）

1. **写页面** — `apps-feat/src/pages/xxx/xxx.vue`（组件 `name` 需与缓存约定一致时，再配 `componentName` 映射）
2. **结构** — 在 `FEAT_ROUTE_STRUCTURES`（或 `FEAT_FRONT_ONLY_STRUCTURES`）增加：

```typescript
{
  path: 'my-page',
  name: 'MyPage',
  componentKey: 'MyPage',
}
```

3. **展示** — 在对应 `menuList` 增加 title、icon、`menuType`、`sort` 等
4. **映射** — `routes/index.ts` 的 components 表：`MyPage: () => import('...')`
5. **权限** — `FEAT_ROUTE_AUTHORITY.MyPage = ['super']`
6. **验证** — `permissionMode` 设为 `FRONT` 或 `MIXTURE`，用带对应 `roles.value` 的账号登录

::: warning 侧栏只显示 name？
FRONT 必须走 `toFeatRouteConfigs()`（合并 menuList 的 title/icon），不要只拿 structure 填默认 title。合并失败（menu 与 structure 的 name 对不上）会直接抛错。
:::

## 后端菜单：如何开发（BACK / MIXTURE）

与原先动态路由一致，只是「谁消费」由模式决定：

1. 业务包维护可序列化配置（如 `apps-workspace/src/routes/config.ts`）+ 组件映射（`index.ts`）
2. Mock 或真实接口 `GET /api/menu/list` 返回树
3. `registerDynamicRoutes` 在 BACK / MIXTURE 中 `fetchBackConfigs()` 拉取

MOCK 示例：`sample/mock/routers.ts` / `sample/mock/menuList.ts`。

新增后端独有页（如 `MixtureBackDemo`）：只加进 workspace 配置与 Mock，**不要**放进 `FEAT_FRONT_ONLY_*`。

## 侧栏与默认首页怎么读菜单

### 取当前生效菜单

```typescript
import { useAuthMenuList, useAuthStore } from '@grow-admin-rock/state'

const menus = useAuthMenuList()          // 响应式
const list = useAuthStore().getMenuList  // getter
```

内部 `resolveActiveMenuList`：

- BACK → `sortTreesBySort(backMenuList)`
- FRONT → `sortTreesBySort(frontMenuList)`
- MIXTURE → `mergeTreesByName(frontMenuList, backMenuList)`

布局菜单组件应使用上述 API，而不是写死读 `backMenuList`。

### 默认打开页

注册结束后 `registerHomeIndexRedirect(menus)`：

1. 优先 `defaultShow: true` 的可导航菜单（`menuType === MENU`，path 以 `/` 开头，非浏览器新开）
2. 否则：第一个**目录**向下找第一个可导航叶子
3. 再否则：整树回退第一个可导航菜单

实现：`resolveDefaultMenuRedirect`（`rock-state/tabStore.ts`）。可在菜单配置里设 `defaultShow: true` 指定首页。

## 与路由守卫的协作

`apps-home/src/routes/guard.ts`：

| 场景 | 行为 |
|------|------|
| 未登录访问受保护页 | 跳转 Login，带 `redirect` |
| 已登录且动态路由未注册 | `registerDynamicRoutes()` → 标记已注册 |
| 本次注册检测到模式变更，或 `to` 不可达 | `next({ name: 'Home', replace: true })` |
| 否则 | `next` 原目标（replace 重试一次以应用新路由表） |

「不可达」判定：resolve 后的末级匹配不能是 `Home` / `HomeIndexRedirect` / `Login` 等空壳。

## 关键文件索引

| 文件 | 职责 |
|------|------|
| `rock-constants/src/appEnum.ts` | `PermissionModeEnum` |
| `sample/src/projectSetting.ts` | 配置入口 |
| `sample/src/initAppConfig.ts` | 启动同步与模式变更清缓存 |
| `apps-home/.../registerDynamicRoutes.ts` | 按模式注册路由 / 写菜单 |
| `apps-home/.../guard.ts` | 触发注册；防白屏回退 Home |
| `apps-feat/.../authority.ts` | 前端角色白名单 |
| `apps-feat/.../mergeMenu.ts` | `toFeatRouteConfigs` |
| `rock-state/.../authStore.ts` | `back`/`front` 列表与 `useAuthMenuList` |
| `rock-state/.../mergeTreesByName.ts` | 合集与 sort |
| `rock-state/.../permissionModeCache.ts` | 模式缓存 |
| `middleware-router/.../MenuState.ts` | `isBackMode` / `isFrontMode` / `isMixtureMode` |

## 开发自检清单

1. 分别将 `permissionMode` 设为 BACK / FRONT / MIXTURE，刷新后侧栏与可访问 URL 符合上表预期。
2. FRONT：改 `FEAT_ROUTE_AUTHORITY` 去掉某角色后，该菜单消失；未配置的 name 不可见。
3. MIXTURE：能同时看到「仅前端」「仅后端」演示项；同名节点展示与 path 以后端为准。
4. 从 BACK 改到 FRONT（或反之）后，旧标签 / 旧 URL 不应白屏，应回到默认首页。
5. 用户信息含 `roles[].value`；缺 roles 时 FRONT 前端树为空可复现并理解原因。
6. 新增页：structure / menuList / 组件映射 / authority（如需）四处对齐，name 字符串一致。

## 下一步

- [路由与菜单](/guide/architecture/routing-and-menu) — 静态 / 动态路由与菜单树
- [认证与登录](/guide/development/authentication) — Token、守卫、登录流程
- [项目配置](/guide/development/project-setting) — `projectSetting` 全量字段
- [Mock 数据](/guide/development/mock) — `/menu/list` 与登录 Mock
