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

Grow Admin 打破了这一结构，围绕 **可组合、可替换、可演进** 设计。建议先阅读 [架构设计理念](/guide/architecture/design-philosophy) 了解整体设计动机，再深入各专题章节。

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

## 文档导航

| 章节 | 说明 |
|------|------|
| [架构设计理念](/guide/architecture/design-philosophy) | 为什么这样设计、有什么好处 |
| [快速上手](/guide/getting-started) | 环境准备、安装、启动 |
| [项目结构](/guide/architecture/project-structure) | Monorepo 目录与分层 |
| [IOC 模块化](/guide/architecture/ioc) | 依赖注入与 Library 机制 |
| [组件驱动架构](/guide/architecture/component-driver) | Grow* 契约组件与驱动桥接 |
| [路由与菜单](/guide/architecture/routing-and-menu) | 静态路由 + 动态注册 + 侧边菜单 |
| [认证与登录](/guide/development/authentication) | Token、守卫、登录流程 |
| [开发指南](/guide/development/project-setting) | 配置、主题、Mock、HTTP、业务模块开发 |
| [包说明](/guide/packages/design-rock) | DesignRock / DesignCornerstone / configs 各包职责 |

::: tip 包管理器
本项目使用 **pnpm** 管理 Monorepo 工作区，请使用 pnpm 安装依赖，不要使用 npm 或 yarn。
:::
