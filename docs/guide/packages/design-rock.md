---
title: DesignRock 核心层
lang: zh-CN
---

# DesignRock 核心层包说明

`DesignRock`（磐石）是 Grow Admin 的框架核心层，所有包以 `@grow-admin-rock/*` 命名，提供与具体业务无关的基础设施。

## 包总览

| 包名 | 职责 |
|------|------|
| `@grow-admin-rock/ioc` | IOC 依赖注入容器（基于 Inversify） |
| `@grow-admin-rock/base-package` | Library 基座、`AppContext`、模块 install 机制 |
| `@grow-admin-rock/types` | 全局 TypeScript 类型定义 |
| `@grow-admin-rock/constants` | 枚举与常量（主题、菜单、权限等） |
| `@grow-admin-rock/components` | `RockComponent` 枚举、`Grow*` 契约组件、`ComponentMap` |
| `@grow-admin-rock/component-driver` | 抽象驱动、`ComponentDriverProvider`、Builder API |
| `@grow-admin-rock/component-driver-element-plus` | Element Plus 组件映射（84 个） |
| `@grow-admin-rock/component-driver-naive` | Naive UI 组件映射（84 个） |
| `@grow-admin-rock/component-driver-antdv` | Ant Design Vue 组件映射（84 个） |
| `@grow-admin-rock/infrastructure` | HTTP 请求基础设施（Axios 封装） |
| `@grow-admin-rock/middleware-router` | 路由表、菜单状态、路由操作器 |
| `@grow-admin-rock/settings` | 项目设置（主题色、布局模式、暗色模式） |
| `@grow-admin-rock/state` | Pinia 状态管理封装 |
| `@grow-admin-rock/locale` | 国际化（i18n） |
| `@grow-admin-rock/hooks` | 通用 Hooks（设置、断点等） |
| `@grow-admin-rock/utils` | 工具函数（含 VueUse 重导出） |
| `@grow-admin-rock/styles` | 全局样式与 Reset CSS |

---

## @grow-admin-rock/ioc

基于 Inversify 的 IOC 容器封装。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `IocPlugin` | Vue 插件，挂载 IOC 容器 |
| `IocContainer` | IOC 容器类 |
| `AsyncIocModule` | 异步模块加载 |
| `diKT` / `di` | 服务获取工具 |
| `THROWN_HANDLER` | 异常处理标识 |

---

## @grow-admin-rock/base-package

Library 基座，定义模块接入契约。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `AppContext` | 应用上下文（路由、IOC 模块、参数、生命周期） |
| `install` | Library 自动装配函数 |
| `toPackage` | 将配置转为标准 Library |
| `Library` / `ModuleLibContext` | Library 类型定义 |
| `APP_CONTEXT` | IOC 服务标识符 |

---

## @grow-admin-rock/components

契约组件层，业务代码的主要 UI 入口。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `RockComponent` | 84 个组件契约枚举 |
| `Lib` | Library 声明（注册 Grow* 全局组件） |
| `ComponentMap` | 组件映射表 |
| `useDriverComponent` | 获取驱动组件 |
| `useMessage` / `useNotice` / `useDialog` | 命令式 API |
| `setMessage` / `setNotice` / `setDialog` | 驱动绑定注入 |
| `withInstall` | 组件安装工具 |
| `ContextParamDef` | AppContext 参数标识 |

---

## @grow-admin-rock/component-driver

组件驱动桥接基础包。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `ComponentDriverProvider` | 局部驱动覆盖组件 |
| `createDriverHook` | 驱动 Hook 创建 |
| `GrowAdminComponentDriver` | 驱动接口类型 |
| `RockComponent` | 重导出契约枚举 |

**三个驱动子包**均实现 `GrowAdminComponentDriver` 接口，提供 `builder().enableXxx().finish()` API。

---

## @grow-admin-rock/infrastructure

HTTP 请求基础设施。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `Lib` | Library 声明（注册 Axios 服务） |
| `InfrastructureAxios` | Axios 封装类 |
| `setPromoter` | 基础设施配置注入 |
| `RequestCanceler` | 请求取消器 |
| `InfrastructureHelper` | 辅助工具 |
| `axios` | 重导出 axios |

**IOC 服务：**

- `InfrastructureAxios` — HTTP 客户端
- `CreateAxiosOptions` — Axios 创建配置
- `AxiosTransform` — 请求/响应转换器

---

## @grow-admin-rock/middleware-router

路由与菜单中间件。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `Lib` | Library 声明 |
| `RoutesTable` | 路由表（含 Vue Router 实例） |
| `RouteOperator` | 路由操作器 |
| `MenuState` | 菜单状态管理 |

路由表在 IOC 加载时根据 `AppContext.basicRoutes` 和 `AppContext.appRoutes` 动态创建。

---

## @grow-admin-rock/settings

项目设置管理，与 `projectSetting.ts` 配合。

**功能：**

- 主题色切换
- 暗色模式
- 布局模式（侧边栏 / 混合 / 顶部）
- 菜单折叠、宽度
- 多标签页配置
- 页面过渡动画

---

## @grow-admin-rock/state

Pinia 状态管理封装。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `defineStore` | 重导出 Pinia defineStore |
| `storeToRefs` | 重导出 storeToRefs |
| `Lib` | Library 声明 |

---

## @grow-admin-rock/locale

国际化支持。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `useI18n` | i18n Hook |
| `t` / `$t` | 翻译函数 |
| `useLocale` | 语言切换 Hook |
| `localeHelper` | 国际化辅助工具 |

---

## @grow-admin-rock/hooks

通用 Hooks 集合。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `SettingHooks` | 项目设置相关 Hooks |
| `useBreakpoint` | 响应式断点 Hook |

---

## @grow-admin-rock/utils

工具函数库，同时重导出 `@vueuse/core`。

**主要模块：**

| 模块 | 说明 |
|------|------|
| `config` | 配置工具 |
| `is` | 类型判断 |
| `toDataType` | 数据类型转换 |
| `utils` | 通用工具（clone、deepMerge 等） |

---

## @grow-admin-rock/constants

框架枚举与常量。

**主要枚举：**

| 枚举 | 说明 |
|------|------|
| `ComponentLibraryType` | 组件库类型 |
| `ThemeEnum` | 主题（明/暗） |
| `MenuModeEnum` / `MenuTypeEnum` | 菜单模式与类型 |
| `PermissionModeEnum` | 权限模式 |
| `ContentLayoutEnum` | 内容布局 |
| `RouterTransitionEnum` | 路由过渡动画 |
| `CacheTypeEnum` | 缓存类型 |

---

## @grow-admin-rock/types

全局 TypeScript 类型定义，被所有 Rock 包引用。

**主要类型：**

- `ProjectSetting` — 项目配置
- `RouteRecordItem` — 路由记录
- `RequestOptions` — 请求配置
- `WmqComponentDictionary` — 组件驱动字典

---

## @grow-admin-rock/styles

全局样式入口，在 `sample/src/main.ts` 中首行引入：

```typescript
import '@grow-admin-rock/styles';
```

包含 Reset CSS 和框架基础样式。
