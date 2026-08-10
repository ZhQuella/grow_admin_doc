---
title: DesignRock 核心层
lang: zh-CN
---

# DesignRock 核心层包说明

`DesignRock`（磐石）是 Grow Admin 的框架核心层，所有包以 `@grow-admin-rock/*` 命名。

README「相关包说明」速查表见 [开发规范 - 相关包速查](/guide/development/dev-conventions#相关包速查)。

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
| `@grow-admin-rock/layouts` | 布局壳：`Layout`、`SettingDrawer`、`Menu`、`SettingTheme`、`SwitchLanguage` 等 |
| `@grow-admin-rock/mock` | Mock 注册中心、`resultSuccess`/`resultError` 工具 |
| `@grow-admin-rock/infrastructure` | HTTP 请求基础设施（Axios 封装） |
| `@grow-admin-rock/middleware-router` | 路由表、菜单状态、路由操作器 |
| `@grow-admin-rock/settings` | 项目设置（主题色、布局模式、暗色模式） |
| `@grow-admin-rock/state` | Pinia 状态管理封装 |
| `@grow-admin-rock/locale` | 国际化（i18n） |
| `@grow-admin-rock/hooks` | 通用 Hooks（设置、断点等） |
| `@grow-admin-rock/utils` | 工具函数（含 VueUse 重导出） |
| `@grow-admin-rock/styles` | 全局样式与 Reset CSS |
| `@grow-admin-rock/code-sandbox` | 在线代码编辑与 Vue SFC 沙箱预览 |
| `@grow-admin-rock/designer` | 低代码页面设计器（`GrowDesigner` / `GrowRenderer`） |
| `@grow-admin-rock/report-designer` | 报表设计器（`GrowReportDesigner` / `GrowReportRenderer`） |
| `@grow-admin-rock/schema-designer` | 可视化数据库建模（`GrowSchemaDesigner`） |
| `@grow-admin-rock/data-prep` | 数据准备 Dataset（`GrowDataPrepDesigner`） |

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

业务代码通过 `resolveByKeyOrThrow(routeLib.types.RouteTable).router` 获取 router 实例，**布局层与动态路由注册均遵循此约定**。`apps-login` 的 `useLoginSuccess` 等少数历史代码仍直接使用 `useRouter()`，新代码建议统一走 IoC。

---

## @grow-admin-rock/mock

Mock 注册中心与响应工具。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `Lib` | Library 声明（注册 `MockRegistry`） |
| `registerMock` | 业务包注册 Mock 方法 |
| `getMockModules` | 聚合所有已注册 Mock |
| `resultSuccess` / `resultError` | 统一 `{ type, data, message }` 响应格式 |

详见 [Mock 数据](/guide/development/mock)。

---

## @grow-admin-rock/layouts

布局与项目配置 UI 组件。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `Layout` / `LayoutLogo` | 主布局壳与 Logo |
| `SettingDrawer` | 项目配置抽屉 |
| `SettingTheme` | 主题模式 + 主题色表单项 |
| `SwitchLanguage` | 语言切换表单项 |
| `Menu` | 侧边菜单容器（从 `authStore.backMenuList` 读取） |
| `PageLoading` | 页面加载动画 |

`Menu` 组件通过 `MenuTreeNode` 递归渲染树形菜单，使用 `GrowSubMenu` / `GrowMenuItem` 契约组件，点击跳转通过 IoC 获取 router。

---

## @grow-admin-rock/settings

项目设置 IOC 服务（`SettingStore`、`GlobConfig`、`MenuSettingData` 等），与 `projectSetting.ts` 配合。

**功能：**

- 主题色切换
- 暗色模式
- 布局模式（侧边栏 / 混合 / 顶部）
- 菜单折叠、宽度
- 多标签页配置
- 页面过渡动画

::: info 装配状态
当前 **sample 宿主未默认装配** `settingsLib`。`useGlobConfig`（OAuth、authMode）依赖此包 + `hooks`。详见 [项目配置 - 可选模块](/guide/development/project-setting#可选模块-settings-hooks)。
:::

---

## @grow-admin-rock/hooks

通用 Hooks（`useGlobConfig`、`useBreakpoint` 等）。

`library.ts` 的 `onSetup` 通过 `createBreakpointListen` 更新移动端状态，**需同时装配 `settings` + `hooks` 才完整生效**。

---

## @grow-admin-rock/state

Pinia 状态管理封装。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `defineStore` | 重导出 Pinia defineStore |
| `storeToRefs` | 重导出 storeToRefs |
| `Lib` | Library 声明 |
| `useAppConfig` | 项目配置状态（主题色、主题模式等） |
| `useAuthStore` | 认证状态（`backMenuList`、`isDynamicAddedRoute` 等） |
| `useAppStore` | 页面 loading（`setPageLoading`、`setPageLoadingTip`） |
| `useLayout` | 布局状态（菜单折叠等） |
| `useTheme` | 主题 CSS 变量动态写入 |
| `useLoginRememberStore` | 登录记住密码（pinia persist） |
| `DataEventBus` | mitt 事件总线 + Vue 生命周期 `$watchWithVue` |

`authStore.backMenuList` 存储接口返回的树形菜单数据，供 `rock-layouts/Menu` 渲染侧边栏。

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
import '@grow-admin-rock/styles'
```

包含 Reset CSS、CSS 变量（`variables.css`）、亮/暗主题 token 与主题切换过渡动画（`theme-transition.css`）。

---

## @grow-admin-rock/code-sandbox

在线代码编辑与 Vue SFC 沙箱预览（Monaco + `@vue/compiler-sfc`）。预览挂载在宿主 Vue 树内，可继续使用 `Grow*` 组件与 IOC。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `GrowCodeEditor` | Monaco 代码编辑器 |
| `GrowCodeDeps` | 依赖注入面板（host / npm） |
| `GrowCodeSandbox` | SFC 编译预览 |
| `composeVueSfc` / `parseVueSfc` | 组装 / 解析 SFC |
| `createPreviewComponent` | 编译 SFC 为可挂载组件 |
| `DEFAULT_SANDBOX_DEPENDENCIES` | 默认锁定依赖 |
| `mergeDependencies` / `normalizeDependencies` | 依赖合并规范化 |

目录：`DesignRock/rock-code-sandbox`。

完整 API、用法与注意事项见 [代码沙箱](/code-sandbox/)。演示模块见 [apps-sandbox](/guide/packages/design-cornerstone#grow-admin-cornerstoneapps-sandbox)。

---

## @grow-admin-rock/designer

低代码页面设计器：拖拽物料、配置属性 / 样式 / 事件，支持数据源与变量绑定，输出可渲染 schema。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `GrowDesigner` | 可视化编辑器（画布 + 左右面板） |
| `GrowRenderer` | 按 `:schema` 渲染页面（含绑定求值） |
| `DesignerDataSourcePanel` 等 | 页面级数据面板（报表设计器可复用） |
| `GROW_RUNTIME_STATE` / `runApiOutlinedList` 等 | 运行时 state 与 API 执行 |

目录：`DesignRock/rock-designer`。

完整说明见 [页面设计器](/page-designer/)。演示模块见 [apps-designer](/guide/packages/design-cornerstone#grow-admin-cornerstoneapps-designer)。

---

## @grow-admin-rock/report-designer

基于 ECharts 的报表设计器：网格布局、图表视觉配置、页面级数据 + 区块数据绑定，导出 `ReportSchema` 并由渲染器拉数展示。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `GrowReportDesigner` | 可视化编辑器（`getSchema` / `runtimeState`） |
| `GrowReportRenderer` | 按 `:schema` 渲染报表（可选 `httpClient`） |
| `createReportSchema` | 组装带默认 pageConfig 的 schema |
| `buildEChartsOption` / `createDefaultChartConfig` | 图表 option 编译与默认配置 |
| `REPORT_CHART_TYPE_OPTIONS` 等 | 图表类型常量 |

目录：`DesignRock/rock-report-designer`。

完整说明见 [报表设计器](/report-designer/)。演示入口同 [apps-designer](/guide/packages/design-cornerstone#grow-admin-cornerstoneapps-designer)（菜单：**报表设计器**）。区块数据经页面 `state` 绑定；可与 [数据准备](/data-prep/) 查询结果对接（由数据请求写入 state）。工具链见 [低代码设计器总览](/guide/designers/)。

---

## @grow-admin-rock/schema-designer

基于 Vue Flow 的可视化数据库建模：表 / 字段 / 关联（1:1、1:N、N:N），导出可持久化的 `DatabaseSchema` JSON。当前方言为 PostgreSQL。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `GrowSchemaDesigner` | 可视化编辑器（`v-model` / `getSchema` / `setSchema` / `exportJson`） |
| `createDatabaseSchema` / `createSchemaTable` / `createSchemaColumn` | schema 工厂 |
| `exportSchemaJson` | 序列化为可持久化 JSON 字符串 |
| `SCHEMA_COLUMN_TYPE_OPTIONS` / `RELATION_TYPE_OPTIONS` | PostgreSQL 字段类型与关联类型选项 |
| `clampIdentifier` / `MAX_*_NAME_LENGTH` | 标识符截断与长度常量（最长 63） |

目录：`DesignRock/rock-schema-designer`。

完整说明见 [数据库建模](/schema-designer/)。演示入口同 [apps-designer](/guide/packages/design-cornerstone#grow-admin-cornerstoneapps-designer)（菜单：**数据库建模**）。

---

## @grow-admin-rock/data-prep

可视化数据准备（分析层 Dataset）：从 Schema 选表、配置多表 Join、公式度量（`metricConfigs`）与输出字段投影，支持预览聚合与本地 / Mock 查询。查询结果经页面 / 报表的 `apiOutlined` 写入 `state` 后绑定展示；报表不直选 Dataset。

**主要导出：**

| 导出 | 说明 |
|------|------|
| `GrowDataPrepDesigner` | 可视化编辑器（`v-model` / `@save`） |
| `createDataPrepDataset` / `createDataPrepMetricConfig` / `createDataPrepJoin` 等 | Dataset 工厂 |
| `queryDatasetLocal` / `queryDataPrepDataset` / `previewMetricConfig` | 本地聚合 / Mock 查询 / 单配置试算 |
| `measureOutputKey` / `toCartesianSeriesPayload` | 结果字段名 / 笛卡尔图轴与系列适配 |
| `FORMULA_FUNCTION_DOCS` / `evaluateFormulaOnGroup` | 公式函数文档与求值 |
| `listOutputFieldCandidates` / `pruneOutputFields` | 输出字段候选与修剪 |
| `loadDatasetsFromStorage` / `upsertDatasetInStorage` | localStorage 读写 |
| `ensureDemoDataset` | 写入演示用 Dataset |
| `./core` | 无 Vue 的纯 TS 入口（供 Mock esbuild） |

目录：`DesignRock/rock-data-prep`。

完整说明见 [数据准备](/data-prep/)。工具链见 [低代码设计器总览](/guide/designers/)。演示入口同 [apps-designer](/guide/packages/design-cornerstone#grow-admin-cornerstoneapps-designer)（菜单：**数据准备**）。
