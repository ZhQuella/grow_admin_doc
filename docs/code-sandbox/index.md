---
title: 代码沙箱
lang: zh-CN
---

# 代码沙箱

在线编辑 Vue SFC，并在**宿主 Vue 树内**即时预览。预览可继续使用全局已注册的 `Grow*` 组件、IOC 能力（如 `useRequest`），也可通过 CDN 动态加载 npm 包。

| 项 | 说明 |
|------|------|
| 包路径 | `@grow-admin-rock/code-sandbox` |
| 源码目录 | `DesignRock/rock-code-sandbox` |
| 演示模块 | `@grow-admin-cornerstone/apps-sandbox`（侧栏菜单：**沙箱**） |

## 三个核心组件

| 组件 | 职责 | 文档 |
|------|------|------|
| `GrowCodeEditor` | Monaco 单编辑器 | [代码编辑器](/code-sandbox/code-editor) |
| `GrowCodeDeps` | 依赖列表（锁定项 + 自定义 npm / host） | [依赖注入](/code-sandbox/code-deps) |
| `GrowCodeSandbox` | 将 Vue SFC 编译并挂载为预览组件 | [沙箱预览](/code-sandbox/preview) |

## 能力概览

1. **完整 Vue SFC**：`template` / `script setup` / `style`（含 scoped）
2. **宿主内挂载**：预览组件跑在当前应用树中，可复用驱动组件与 IOC
3. **依赖注入**
   - **host**：组件按名从宿主 `appContext.components` 解析；API / 模块由 `expose` 注入
   - **npm**：经 esm.sh CDN 动态加载，无需装进项目
4. **默认锁定依赖**：`useRequest`、`@grow-admin-rock/state`、`middleware-router`、`utils`、`hooks`（不可取消勾选）

::: tip 演示入口
登录后打开侧栏 **沙箱**：

- **沙箱工具** — 编辑器 + 依赖 + 预览三分屏
- **代码沙箱** — 仅预览（完整 SFC 示例）
- **代码编辑器** — 仅编辑器（可切换语言）
:::

## 推荐阅读

1. [基础用法](/code-sandbox/usage) — 先拼出一个可预览的页面
2. [沙箱预览](/code-sandbox/preview) — `expose` / `dependencies` 能力面
3. [依赖注入](/code-sandbox/code-deps) / [代码编辑器](/code-sandbox/code-editor) — 按需深入
4. [工具 API 与注意点](/code-sandbox/api) — `composeVueSfc`、子路径导出、常见坑
