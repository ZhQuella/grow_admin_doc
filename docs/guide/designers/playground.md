---
title: 低代码设计器 · 演示与接入
lang: zh-CN
---

# 演示与接入

## 演示菜单对照

| 侧栏 | 路由 path（相对 Home） | 组件 |
|------|------------------------|------|
| 设计器 → 低代码设计器 | `designer-playground` | `GrowDesigner` |
| 设计器 → 报表设计器 | `report-designer-playground` | `GrowReportDesigner` |
| 设计器 → 数据库建模 | `schema-designer-playground` | `GrowSchemaDesigner` |
| 设计器 → 数据准备 | `data-prep-playground` | `GrowDataPrepDesigner` |
| 设计器 → 数据清洗 | `data-clean-playground` | `GrowDataCleanDesigner` |
| 设计器 → 流程引擎 | `process-engine-playground` | `GrowProcessDesigner` |
| 沙箱 → 沙箱工具 / 呈现沙箱 / 代码编辑器 | `sandbox-overview` 等 | `GrowCode*` |

## 接入要点（宿主）

1. workspace 依赖对应 `@grow-admin-rock/*` 包与 Cornerstone 演示模块  
2. `sample/src/plugin/initIoc.ts` 中 `.use(appsDesignerLib)` / `.use(appsSandboxLib)`  
3. Mock 菜单合并设计器 / 沙箱结构（见 `sample/mock/routers.ts`）  
4. 数据准备另需启用 `sample/mock/dataPrep.ts`  
5. 数据清洗另需启用 `sample/mock/dataClean.ts`（tables / table-rows / preview）；保存事件仍由宿主自行持久化  
6. 流程引擎当前**无**独立 Mock；保存事件由宿主自行持久化  

详细装配见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)。

## 模块文档入口

| 模块 | 说明 |
|------|------|
| [页面设计器 · 基础用法](/page-designer/usage) | 菜单、接入、画布操作、渲染 |
| [报表设计器 · 基础用法](/report-designer/usage) | 菜单、接入、设计器 / 渲染器 API |
| [数据库建模 · 基础用法](/schema-designer/usage) | 接入、画布操作、连线规则、导出 |
| [数据准备 · 基础用法](/data-prep/usage) | 接入、Mock、预览、与页面 / 报表对接 |
| [数据清洗 · 基础用法](/data-clean/usage) | 接入、Mock、画布操作、组件 API |
| [流程引擎 · 基础用法](/process-engine/usage) | 接入、竖向画布、组件 API |
| [代码沙箱 · 基础用法](/code-sandbox/usage) | 仅预览 / 三分屏 / 单编辑器 |

::: tip
不熟悉模块关系时，先读 [协同工作](/guide/designers/collaboration)，再进入各设计器「基础用法」。
:::
