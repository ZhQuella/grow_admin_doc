---
title: 报表设计器 · 图表配置
lang: zh-CN
---

# 图表配置

`chartConfig` 对齐 ECharts 视觉字段，**不含业务 data**。运行时由 [数据绑定](/report-designer/data-binding) 解析出的 payload 经 `buildEChartsOption` 注入。

## 图表类型

```ts
type ReportChartType =
  | 'cartesian'   // 折线 / 柱状 / 散点 / K 线组合
  | 'map'
  | 'radar'
  | 'boxplot'
  | 'heatmap'
  | 'graph'
  | 'tree'
  | 'treemap'
  | 'sunburst'
  | 'parallel'
  | 'sankey'
  | 'funnel'
  | 'gauge'
  | 'themeRiver'
  | 'calendar'
  | 'matrix'
  | 'chord'

type CartesianSeriesType = 'line' | 'bar' | 'scatter' | 'candlestick'
```

常量：`REPORT_CHART_TYPE_OPTIONS`、`CARTESIAN_SERIES_TYPE_OPTIONS`、`DEFAULT_REPORT_CHART_TYPE`（`cartesian`）。

## chartConfig 结构（高层）

| 分组 | 典型字段 |
|------|----------|
| 通用 | `title` / `legend` / `tooltip` / `color` / `toolbox` / `grid` / `animation` / `backgroundColor` |
| 直角 | `xAxis` / `yAxis` / `yAxisRight` / `seriesList` |
| 雷达 | `radar` + `radarSeriesList` |
| 其它 | `visualMap` / `geo` / `calendar` / `seriesStyle` 等 |
| 高级 | `advancedOptionJson`（字符串，编译后深度合并进 option） |

`seriesList` 为 `Array<Record<string, any>>`，每项描述系列视觉（类型、颜色、圆角、label、emphasis、symbol 等），默认 `data: []`。

## 工具函数

```ts
import {
  createDefaultChartConfig,
  getChartOptionFields,
  buildEChartsOption,
  getReportChartTypeOption,
} from '@grow-admin-rock/report-designer'
```

| 函数 | 说明 |
|------|------|
| `createDefaultChartConfig(type)` | 按类型生成默认视觉配置 |
| `getChartOptionFields(type)` | 驱动设计器右侧字段表单 |
| `buildEChartsOption(type, config, chartData?)` | 编译最终 ECharts option |
| `getReportChartTypeOption(type)` | 取类型元信息（label / icon / color） |

### buildEChartsOption

```ts
buildEChartsOption(
  chartType: ReportChartType,
  config?: ReportChartConfig,
  chartData?: /* 绑定解析结果 */,
)
```

- 无绑定时系列 / 轴 data 多为空数组
- 有 `chartData`（或解析后的 payload）时按类型写入轴与系列
- 空雷达 `indicator` 时不输出 `radar` / 对应 series，避免 ECharts 报错

## 设计器系列编辑

直角坐标系列在设计器中由 `ChartSeriesListEditor` 等组件编辑，支持：

- 系列类型切换（line / bar / scatter / candlestick）
- 颜色 / 渐变填充
- label、emphasis
- symbol、阴影等

编译层见源码 `chartConfig/compileCartesianSeries.ts`。

## 源码目录

```
GrowReportRenderer/chartConfig/
  buildEChartsOption.ts
  compileCartesianSeries.ts
  commonFields.ts
  typeFields.ts
  defaults.ts
  types.ts
  index.ts
```

## 相关文档

- [数据绑定](/report-designer/data-binding) — data 如何注入
- [数据模型](/report-designer/schema) — `chartType` / `chartConfig` 字段位置
