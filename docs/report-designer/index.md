---
title: 报表设计器
lang: zh-CN
---

# 报表设计器

基于 **ECharts + vue3-grid-layout** 的报表设计与运行时：在网格画布上拖拽布局、配置图表视觉与数据绑定，导出 `ReportSchema`，再用 `GrowReportRenderer` 拉数并渲染。

| 项 | 说明 |
|------|------|
| 核心包 | `@grow-admin-rock/report-designer` |
| 源码目录 | `DesignRock/rock-report-designer` |
| 演示模块 | `@grow-admin-cornerstone/apps-designer`（侧栏菜单：**设计器 → 报表设计器**） |
| 主要组件 | `GrowReportDesigner`（编辑）、`GrowReportRenderer`（渲染） |
| 依赖复用 | 页面级数据面板与运行时复用 `@grow-admin-rock/designer` |

与 [页面设计器](/page-designer/) 的关系：页面设计器面向通用页面物料；报表设计器面向图表看板。二者在 **页面级** `dataSource` / `apiOutlined` / `computedProps` 上对齐，区块侧用 `dataBinding` 把 `state.xxx` 注入图表。

与 [数据准备](/data-prep/) 的关系：数据准备产出可查询的 Dataset；报表侧统一经页面 `state`（数据请求 / 计算属性）绑定，与页面设计器操作习惯一致。

## 界面分区

```
┌─────────────────────────────────────────────────────────────┐
│ 工具栏：添加区块 / 预览 / …                                    │
├────┬──────────────┬──────────────────────────┬──────────────┤
│ 轨 │ 左侧面板      │ 网格画布                   │ 右侧配置面板  │
│ 道 │ 数据源/请求/… │ 拖拽缩放、选中、复制删除     │ 基础/图表/绑定 │
└────┴──────────────┴──────────────────────────┴──────────────┘
```

| 区域 | 能力 |
|------|------|
| **左侧轨道** | 切换数据源、计算属性、数据请求等页面级面板（复用 GrowDesigner 面板） |
| **画布** | 24 列网格拖拽布局；选中区块后可配置 / 复制 / 删除 |
| **右侧面板** | 基础信息、图表视觉配置、区块数据绑定 |

## 核心能力

1. **网格布局**：`colNum=24`、`rowHeight=30`（可由 `pageConfig` 覆盖）
2. **多图表类型**：直角坐标系（折线 / 柱状 / 散点 / K 线组合）及雷达、地图、热力、漏斗等
3. **视觉与数据分离**：`chartConfig` 只存视觉；业务数据经 `dataBinding` 从页面 `state` 注入
4. **页面级数据**：与页面设计器同一套 `dataSource` / `apiOutlined` / `computedProps`
5. **渲染分离**：编辑态 `GrowReportDesigner`，运行态 `GrowReportRenderer` 消费同一份 schema

## 推荐阅读

1. [基础用法](/report-designer/usage) — 接入演示、设计器 / 渲染器 API
2. [数据绑定](/report-designer/data-binding) — 页面数据 → 区块绑定 → 图表 data
3. [数据模型](/report-designer/schema) — `ReportSchema` / `ReportLayoutItem`
4. [图表配置](/report-designer/chart-config) — `chartConfig` 与 `buildEChartsOption`

::: tip 演示入口
登录后打开侧栏 **设计器 → 报表设计器**（由 `apps-designer` 注册）。本地需装配 `@grow-admin-rock/report-designer` 与对应 Cornerstone 模块。
:::
