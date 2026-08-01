---
title: 数据准备 · 数据模型
lang: zh-CN
---

# 数据模型

设计器、预览查询与报表 Dataset 绑定共用 `DataPrepDataset`。

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
type DataPrepAgg = 'sum' | 'avg' | 'count' | 'count_distinct' | 'max' | 'min'

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
  agg: DataPrepAgg
  format?: 'number' | 'percent' | 'currency'
}
```

可用 `DATA_PREP_AGG_OPTIONS` 作为聚合下拉选项；`fieldKey(alias, column)` / `parseFieldKey(field)` 处理字段键。

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

- 设计器预览 / 报表运行时调用 `queryDataPrepDataset`
- 本地引擎：`queryDatasetLocal`（多表按 `joins` 拼行后再聚合）
- 笛卡尔图适配：`toCartesianSeriesPayload(result, categoryFieldId, seriesFieldIds)`

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

保存时优先 POST Mock，并同步写入上述 localStorage，供报表 `resolveDatasetBinding` 读取。

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
