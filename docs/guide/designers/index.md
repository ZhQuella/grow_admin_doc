---
title: 低代码设计器
lang: zh-CN
---

# 低代码设计器

Grow Admin 在 DesignRock 中提供一套可组合的低代码工具链：从 **物理建模** 到 **分析准备**，再到 **页面 / 报表展示**；**代码沙箱** 作为共享能力，被各设计器内嵌（事件脚本、公式、变量绑定等）。

演示入口由 `@grow-admin-cornerstone/apps-designer`（设计器菜单）与 `@grow-admin-cornerstone/apps-sandbox`（沙箱菜单）注册；宿主 `sample` 经 IOC 装配后，登录即可在侧栏打开。

## 工具链关系

```text
数据库建模 (schema-designer)
  → DatabaseSchema（表 / 字段 / 关联 / SQL 配置）
        ↓ 已发布元数据（Mock：/data-prep/schemas）
数据准备 (data-prep)
  → DataPrepDataset（选表、Join、公式度量、输出字段）
        ↓ 查询结果（Mock：POST /data-prep/query）写入页面 state
        ├─→ 页面设计器 (designer)     → DesignerSchema + GrowRenderer
        └─→ 报表设计器 (report-designer) → ReportSchema + GrowReportRenderer

代码沙箱 (code-sandbox)
  → 被上述设计器内嵌；亦可独立演示（apps-sandbox）
```

| 模块 | 包名 | 产物 | 文档 |
|------|------|------|------|
| [数据库建模](/schema-designer/) | `@grow-admin-rock/schema-designer` | `DatabaseSchema` | 表结构与关系 |
| [数据准备](/data-prep/) | `@grow-admin-rock/data-prep` | `DataPrepDataset` | Join + 公式度量 |
| [页面设计器](/page-designer/) | `@grow-admin-rock/designer` | `DesignerSchema` | 拖拽页面 |
| [报表设计器](/report-designer/) | `@grow-admin-rock/report-designer` | `ReportSchema` | 图表看板 |
| [代码沙箱](/code-sandbox/) | `@grow-admin-rock/code-sandbox` | SFC / 表达式编辑 | Monaco + 预览 |

## 推荐阅读

1. [协同工作](/guide/designers/collaboration) — 模块如何靠产物与 `state` 衔接  
2. [演示与接入](/guide/designers/playground) — 菜单对照、宿主装配、界面操作要点  
3. 再进入各设计器「概述 / 基础用法」专章  

::: tip
若只想先跑通示例：登录 Demo → 侧栏 **设计器** / **沙箱** 打开对应 playground。
:::
