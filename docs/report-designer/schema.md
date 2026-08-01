---
title: 报表设计器 · 数据模型
lang: zh-CN
---

# 数据模型

设计器与渲染器共用 `ReportSchema`，可供保存、预览与 `GrowReportRenderer` 使用。

## 顶层结构

```ts
type ReportSchema = {
  layout?: ReportLayoutItem[]
  pageConfig?: ReportPageConfig
  /** 对齐 GrowDesigner */
  dataSource?: unknown[]
  apiOutlined?: unknown[]
  computedProps?: unknown[]
}

type ReportPageConfig = {
  colNum?: number    // 默认 24
  rowHeight?: number // 默认 30
}
```

可用 `createReportSchema(layout, pageConfig?, pageData?)` 生成带默认 `pageConfig` 与空页面数据数组的完整对象。

## ReportLayoutItem

```ts
type ReportLayoutItem = {
  i: string
  x: number
  y: number
  w: number
  h: number
  title: string
  showTitle: boolean
  chartType: ReportChartType
  /** 图表视觉配置（对齐 ECharts，不含业务 data） */
  chartConfig?: ReportChartConfig
  /** 区块数据绑定（页面 state） */
  dataBinding?: ReportBlockDataBinding
}
```

| 字段 | 说明 |
|------|------|
| `i` | 区块唯一 id（网格 key） |
| `x/y/w/h` | 网格坐标与跨度 |
| `title` / `showTitle` | 卡片标题 |
| `chartType` | 见 [图表配置](/report-designer/chart-config) |
| `chartConfig` | 视觉 option 片段 |
| `dataBinding` | 见 [数据绑定](/report-designer/data-binding)（含 `sourceMode` / `dataset`） |

## 页面级数据字段

与 [页面设计器 · 数据模型](/page-designer/schema) 中的 `dataSource` / `apiOutlined` 对齐；报表额外支持 `computedProps`。字段说明见 [数据源与数据请求](/page-designer/data)。

## 与渲染器的关系

```
GrowReportDesigner  ──getSchema()──►  ReportSchema
                                          │
                                          ▼
                               GrowReportRenderer(:schema)
                                          │
                                          ▼
                               拉数 → 绑定解析 → ECharts
```

保存后端时建议持久化完整 schema（`layout` + `pageConfig` + `dataSource` / `apiOutlined` / `computedProps`）。

::: info 编辑回填
当前 `GrowReportDesigner` 不接受初始 `schema`。若需「读库再编辑」，需业务侧扩展或等待后续版本支持。
:::

## 包导出类型

```ts
import type {
  ReportSchema,
  ReportLayoutItem,
  ReportPageConfig,
  ReportChartType,
  ReportChartConfig,
  ReportBlockDataBinding,
  ReportDataBindRef,
  ReportDataBindMode,
  ReportDatasetBinding,
  ReportDataBindingSourceMode,
} from '@grow-admin-rock/report-designer'
```

## 相关文档

- [基础用法](/report-designer/usage)
- [数据绑定](/report-designer/data-binding)
- [图表配置](/report-designer/chart-config)
- [数据准备](/data-prep/)
