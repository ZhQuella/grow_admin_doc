---
title: 简介
lang: zh-CN
---

# Grow Admin 是什么？

Grow Admin 是一个基于 **Vue 3 / Vite / TypeScript** 的 Monorepo 管理后台框架。它采用 **IOC 模块化架构**，并通过**组件驱动桥接层**支持在 Element Plus、Naive UI、Ant Design Vue 三套 UI 组件库之间切换，业务代码无需感知底层实现。

## 核心特性

- **IOC 模块化**：基于 Inversify 的依赖注入，业务模块以 Library 形式独立开发、按需装配
- **组件驱动桥接**：`Grow*` 契约组件 + 驱动包，一套业务代码适配三套 UI 库
- **Monorepo 分层**：`DesignRock`（框架核心）与 `DesignCornerstone`（业务模块）职责清晰
- **动态路由与菜单**：静态基础路由 + 接口驱动动态注册，目录与叶子节点职责分离
- **开箱即用**：内置路由中间件、HTTP 基础设施、国际化、状态管理、主题与布局配置
- **宿主应用模式**：`sample` 作为宿主，统一完成驱动初始化与模块装配

## 与其他 Admin 框架有什么不同？

传统 Admin 框架通常将业务代码、组件封装、工具函数全部堆叠在单一应用中，模块之间耦合紧密，难以独立演进。

Grow Admin 打破了这一结构，围绕 **可组合、可替换、可演进** 设计。

| 维度 | 传统 Admin | Grow Admin |
|------|-----------|------------|
| 项目组织 | 单应用 + 可选 packages | Monorepo 分层（Rock / Cornerstone / configs） |
| 模块装配 | 手动 import + 注册 | IOC 容器自动装配，Library 约定式接入 |
| UI 组件库 | 绑定单一组件库 | 契约组件 + 驱动桥接，运行时切换 |
| 业务模块 | 与应用强耦合 | 独立 npm 包，peer 依赖契约层 |

## 技术栈

- [Vue 3](https://cn.vuejs.org/)
- [Vite](https://cn.vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Inversify](https://inversify.io/)（IOC 容器）
- [Pinia](https://pinia.vuejs.org/zh/)（状态管理）
- [Vue Router 4](https://router.vuejs.org/zh/)
- [UnoCSS](https://unocss.dev/)（原子化 CSS）
- Element Plus / Naive UI / Ant Design Vue（通过驱动层切换）

## 仓库地址

- GitHub：[https://github.com/ZhQuella/grow_admin](https://github.com/ZhQuella/grow_admin)
- 在线演示：[https://demo.gadmin.top/](https://demo.gadmin.top/)

## 推荐阅读顺序

文档按「先跑起来 → 懂结构 → 配好壳 → 打通权限与接口 → 写页面 → 沙箱 / 设计器 → 拆模块」排列，建议按序阅读：

1. **[快速上手](/guide/getting-started)** — 先跑起来
2. **架构** — 懂目录、模块装配、路由菜单
3. **配置与主题** — 改项目名、主题色、语言
4. **认证与权限** — 登录、守卫、权限模式
5. **网络与数据** — 请求封装与 Mock
6. **组件库** — 用 `Grow*` 写页面，按需换 UI 库
7. **[组件文档](/components/)** — SearchBar / ColumnBar 等具体用法
8. **[代码沙箱](/code-sandbox/)** — 在线编辑 Vue SFC 与宿主内预览
9. **[页面设计器](/page-designer/)** — 拖拽式低代码设计器与样式 / schema
10. **[报表设计器](/report-designer/)** — 图表看板布局、数据绑定与 ECharts 渲染
11. **[数据库建模](/schema-designer/)** — 可视化表 / 字段 / 关联与 schema 导出
12. **业务开发** — 新建 Cornerstone 包
13. **[开发规范](/guide/development/dev-conventions)** — 上线前对照检查
14. **包说明** — 查某个 npm 包是干什么的

## 文档导航

### 入门

| 章节 | 说明 |
|------|------|
| [快速上手](/guide/getting-started) | 安装、启动、验证示例 |

### 架构

| 章节 | 说明 |
|------|------|
| [架构设计理念](/guide/architecture/design-philosophy) | 为什么这样设计 |
| [项目结构](/guide/architecture/project-structure) | Monorepo 目录与分层 |
| [IOC 模块化](/guide/architecture/ioc) | Library 与模块装配 |
| [路由与菜单](/guide/architecture/routing-and-menu) | 静态路由 + 动态菜单 |

### 配置与主题

| 章节 | 说明 |
|------|------|
| [项目配置](/guide/development/project-setting) | `projectSetting`、环境变量 |
| [主题与颜色](/guide/development/theme-and-colors) | 主题色、CSS 变量、UnoCSS |
| [主题与语言](/guide/development/theme-and-locale) | 亮暗模式、中英文切换 |

### 认证与权限

| 章节 | 说明 |
|------|------|
| [认证与登录](/guide/development/authentication) | Token、守卫、登录流程 |
| [权限模式](/guide/development/permission-mode) | BACK / FRONT / MIXTURE 配置与开发 |

### 网络与数据

| 章节 | 说明 |
|------|------|
| [HTTP 基础设施](/guide/development/http-infrastructure) | 请求封装与解包 |
| [Mock 数据](/guide/development/mock) | 本地假接口 |

### 组件库

| 章节 | 说明 |
|------|------|
| [组件驱动架构](/guide/architecture/component-driver) | Grow* 与驱动桥接原理 |
| [Grow 契约组件](/guide/development/grow-components) | 模板里怎么用 |
| [命令式 API](/guide/development/imperative-api) | Message / Dialog 等 |
| [切换组件库](/guide/development/switch-component-library) | 全局换 Element / Naive / Antdv |
| [局部覆盖组件库](/guide/development/local-override) | 单页换库（进阶） |

### 组件文档

| 章节 | 说明 |
|------|------|
| [组件概览](/components/) | 契约 / 预设分类与入口 |
| [SearchBar](/components/search-bar) | 高级搜索栏 |
| [ColumnBar](/components/column-bar) | 表格列设置 |
| [AbstractEle](/components/abstract-ele) | 动态表单项 |
| [其他组件](/components/other) | Iconify、SplitPane 等 |

### 代码沙箱

| 章节 | 说明 |
|------|------|
| [概述](/code-sandbox/) | 能力概览与演示入口 |
| [基础用法](/code-sandbox/usage) | 仅预览 / 三分屏 |
| [GrowCodeEditor](/code-sandbox/code-editor) | Monaco 编辑器 |
| [GrowCodeDeps](/code-sandbox/code-deps) | 依赖注入 |
| [GrowCodeSandbox](/code-sandbox/preview) | SFC 编译预览 |
| [工具 API](/code-sandbox/api) | 工具函数与注意点 |

### 页面设计器

| 章节 | 说明 |
|------|------|
| [概述](/page-designer/) | 设计器能力与界面分区 |
| [基础用法](/page-designer/usage) | 接入、画布操作、渲染 |
| [样式面板](/page-designer/style) | 尺寸 / 边框 / display 等 |
| [数据源与数据请求](/page-designer/data) | 数据源 / 接口配置与字段 |
| [变量绑定](/page-designer/variable-bind) | 属性绑定 state、表达式求值 |
| [数据模型](/page-designer/schema) | structures / props / propBindModes |

### 报表设计器

| 章节 | 说明 |
|------|------|
| [概述](/report-designer/) | 能力概览与界面分区 |
| [基础用法](/report-designer/usage) | 接入、设计器 / 渲染器 API |
| [数据绑定](/report-designer/data-binding) | 页面 state → 区块图表 data |
| [数据模型](/report-designer/schema) | ReportSchema / layout |
| [图表配置](/report-designer/chart-config) | chartConfig 与 option 编译 |

### 数据库建模

| 章节 | 说明 |
|------|------|
| [概述](/schema-designer/) | 能力概览与界面分区 |
| [基础用法](/schema-designer/usage) | 接入、画布操作、设计器 API |
| [数据模型](/schema-designer/schema) | DatabaseSchema / 表 / 字段 |
| [表关联](/schema-designer/relations) | 1:1 / 1:N / N:N 与参照动作 |

### 业务开发

| 章节 | 说明 |
|------|------|
| [业务模块开发](/guide/development/business-module) | 新建 Cornerstone 包 |

### 规范与约定

| 章节 | 说明 |
|------|------|
| [开发规范](/guide/development/dev-conventions) | 推荐做法、命令、包速查 |

### 包说明

| 章节 | 说明 |
|------|------|
| [DesignRock 核心层](/guide/packages/design-rock) | 框架 npm 包 |
| [DesignCornerstone 业务层](/guide/packages/design-cornerstone) | 业务 npm 包 |
| [构建配置](/guide/packages/configs) | Vite、TSConfig 等 |

::: tip 包管理器
本项目使用 **pnpm** 管理 Monorepo 工作区，请使用 pnpm 安装依赖，不要使用 npm 或 yarn。
:::
