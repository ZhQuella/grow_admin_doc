---
title: 数据准备 · 数据模型
lang: zh-CN
---

# 数据模型

设计器与预览查询共用 `DataPrepDataset`。

## DataPrepDataset

```ts
type DataPrepDataset = {
  version: 1
  id: string
  name: string
  description?: string
  /** 引用的建模列表（跨建模时多项） */
  schemaRefs: DataPrepSchemaRef[]
  /** @deprecated 兼容旧数据；读写请用 schemaRefs */
  schemaRef?: DataPrepSchemaRef
  sources: DataPrepSource[]
  joins: DataPrepJoin[]
  dimensions: DataPrepDimension[]
  measures: DataPrepMeasure[]
  updatedAt?: string
}

type DataPrepSchemaRef = {
  schemaId: string
  schemaName?: string
}

type DataPrepSource = {
  id: string
  alias: string
  schemaId: string
  tableId: string
  tableName: string
  position: { x: number; y: number }
}
```

| 字段 | 说明 |
|------|------|
| `schemaRefs` | 本 Dataset 用到的建模；跨库时多项 |
| `sources` | 画布表节点；`alias` 用于字段键 `alias.column` |
| `joins` | 表关联，见 [表关联](/data-prep/joins) |
| `dimensions` / `measures` | 分析字段目录 |

## 维度与度量

```ts
type DataPrepAgg =
  | 'sum' | 'avg' | 'count' | 'count_distinct' | 'max' | 'min'
  | 'ratio'        // 占比：本组 / 全部组合计
  | 'running_sum'  // 累计：同系列按时间累加
  | 'yoy' | 'mom'  // 同比 / 环比（增长率）
  | 'yoy_diff' | 'mom_diff'  // 同比 / 环比差值

type DataPrepDimension = {
  id: string
  name: string
  /** alias.column */
  field: string
  dataType?: string
}

type DataPrepMeasure = {
  id: string
  name: string
  field: string
  /** 查询结果行对象中的字段名；缺省回退为 id */
  outputKey?: string
  agg: DataPrepAgg
  format?: 'number' | 'percent' | 'currency'
}
```

可用 `DATA_PREP_AGG_OPTIONS` 作为聚合下拉选项；`fieldKey(alias, column)` / `parseFieldKey(field)` 处理字段键。  
查询结果取度量值时用 `measureOutputKey(measure)`（优先 `outputKey`，否则 `id`）。

### 二次计算（基于分组求和）

| 计算 | 公式 | 说明 |
|------|------|------|
| `ratio` 占比 | `本组求和 / 全部组合计` | 预览显示为百分比 |
| `running_sum` 累计 | 同系列按时间顺序累加 | 有时间维时按期累加，否则按首维排序 |
| `yoy` 同比 | `(本期 - 去年同期) / 去年同期` | 需可解析的时间维度 |
| `mom` 环比 | `(本期 - 上期) / 上期` | 无法解析时间时取同系列相邻上期 |
| `yoy_diff` 同比差值 | `本期 - 去年同期` | 绝对增减 |
| `mom_diff` 环比差值 | `本期 - 上期` | 绝对增减 |

支持的时间维度格式：`YYYY`、`YYYY-MM`、`YYYY-MM-DD`、`YYYY-Qn`、`2024年1月` 等。比率类结果为小数（预览中显示为百分比）；无对比期时为 `null`。

## 查询请求与结果

```ts
type DatasetQueryRequest = {
  dataset?: DataPrepDataset
  datasetId?: string
  dimensionIds?: string[]
  measureIds?: string[]
  limit?: number
}

type DatasetQueryResult = {
  columns: Array<{ key: string; title: string; role: 'dimension' | 'measure' }>
  rows: Record<string, unknown>[]
}
```

度量列的 `columns[].key` 与 `rows[]` 中的字段名为该度量的 `outputKey`（未配置时为 `id`）。

- 设计器预览调用 `queryDataPrepDataset`
- 本地引擎：`queryDatasetLocal`（多表按 `joins` 拼行后再聚合）
- 可选适配：`toCartesianSeriesPayload(result, categoryFieldId, seriesFieldIds)`

## Schema Bundle（Mock 行数据）

```ts
type DataPrepSchemaBundle = {
  id: string
  schema: DataPrepDatabaseSchema  // 结构对齐 DatabaseSchema
  tableRows: Record<string, Record<string, unknown>[]>  // 表名 → 明细行
}
```

跨建模查询时行索引 key 为 `` `${schemaId}::${tableName}` ``（`sourceTableRowsKey`）。

## 本地存储

| Key | 说明 |
|------|------|
| `grow-admin:data-prep:datasets:v2` | Dataset 列表（`loadDatasetsFromStorage` / `upsertDatasetInStorage`） |

保存时优先 POST Mock，并同步写入上述 localStorage。

## 工厂与导出

```ts
import {
  createDataPrepDataset,
  createDataPrepSource,
  createDataPrepJoin,
  createDataPrepDimension,
  createDataPrepMeasure,
  normalizeSchemaRefs,
  upsertSchemaRef,
  ensureUniqueAlias,
  queryDatasetLocal,
  toCartesianSeriesPayload,
  type DataPrepDataset,
} from '@grow-admin-rock/data-prep'
```

无 Vue 的纯 TS 入口（供 Mock esbuild 使用）：`@grow-admin-rock/data-prep/core`。

## 相关文档

- [基础用法](/data-prep/usage)
- [表关联](/data-prep/joins)
- [报表 · 数据绑定](/report-designer/data-binding)
