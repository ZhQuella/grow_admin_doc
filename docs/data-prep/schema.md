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
  /** 主表来源 id；缺省取 sources[0] */
  primarySourceId?: string
  joins: DataPrepJoin[]
  /** 维度 / 度量配置（每项：多维度 + 单度量公式） */
  metricConfigs: DataPrepMetricConfig[]
  /**
   * 数据输出字段（有序）。
   * 明细字段为 alias.column，度量字段为 measure.outputKey。
   * 空数组表示尚未配置；预览 / 对外输出均按此投影。
   */
  outputFields: string[]
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
| `primarySourceId` | 主表；Join 拼装与删除表时会维护 |
| `joins` | 表关联，见 [表关联](/data-prep/joins) |
| `metricConfigs` | 分析配置，见下方与 [公式度量](/data-prep/formulas) |
| `outputFields` | 输出投影；**必填才能预览** |

::: warning 旧模型说明
早期文档中的 `dimensions` / `measures` / 枚举型 `agg` **已废弃**。请统一使用 `metricConfigs` + `formula` + `outputFields`。
:::

## 维度 / 度量配置

```ts
type DataPrepMetricConfig = {
  id: string
  /** 维度字段（alias.column），顺序即分组顺序 */
  dimensionFields: string[]
  measure: {
    name: string
    /** 查询结果行中的字段名；缺省回退为配置 id */
    outputKey?: string
    /**
     * 公式文本。字段引用写作 [alias.column]，
     * 支持 SUM/AVG/COUNT/MAX/MIN 及四则运算、IF/AND/OR/NOT 等。
     */
    formula: string
  }
}
```

| 字段 | 说明 |
|------|------|
| `dimensionFields` | 分组维度；可为空（全局聚合） |
| `measure.name` | 展示名 |
| `measure.outputKey` | 结果列名；写入 `outputFields` 时用此 key |
| `measure.formula` | 在分组行集合上求值，见 [公式度量](/data-prep/formulas) |

辅助函数：

- `measureOutputKey(measure, configId?)` — 优先 `outputKey`，否则 `configId`
- `fieldKey(alias, column)` / `parseFieldKey(field)` — 字段键
- `formulaFieldToken(field)` — 生成 `[alias.column]`

## 查询请求与结果

```ts
type DatasetQueryRequest = {
  dataset?: DataPrepDataset
  datasetId?: string
  /** 指定配置 id；缺省为全部（按相同维度集合合并度量列） */
  configIds?: string[]
  limit?: number
}

type DatasetQueryResult = {
  columns: Array<{
    key: string
    title: string
    role: 'dimension' | 'measure' | 'detail'
  }>
  rows: Record<string, unknown>[]
}
```

查询引擎行为概要（`queryDatasetLocal`）：

1. 按 `joins` 拼多表行（见 [表关联](/data-prep/joins)）
2. 按选中的 `metricConfigs` 做分组 + 公式聚合
3. **仅当 `outputFields` 非空**时按列表投影列与行；否则返回空结果

- 设计器预览：`queryDataPrepDataset`（HTTP）或本地引擎
- 单配置试算：`previewMetricConfig`
- 可选适配：`toCartesianSeriesPayload(result, categoryField, seriesFields)`

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

引用的建模结构 `DataPrepDatabaseSchema` 与 schema-designer 的 `DatabaseSchema` 对齐，方言为 `postgresql`。

```ts
import {
  createDataPrepDataset,
  createDataPrepSource,
  createDataPrepJoin,
  createDataPrepMetricConfig,
  measureOutputKey,
  fieldKey,
  formulaFieldToken,
  normalizeSchemaRefs,
  upsertSchemaRef,
  ensureUniqueAlias,
  queryDatasetLocal,
  previewMetricConfig,
  toCartesianSeriesPayload,
  listOutputFieldCandidates,
  FORMULA_FUNCTION_DOCS,
  type DataPrepDataset,
} from '@grow-admin-rock/data-prep'
```

无 Vue 的纯 TS 入口（供 Mock esbuild 使用）：`@grow-admin-rock/data-prep/core`。

## 相关文档

- [基础用法](/data-prep/usage)
- [公式度量](/data-prep/formulas)
- [表关联](/data-prep/joins)
- [报表 · 数据绑定](/report-designer/data-binding) — 经页面 state 消费查询结果
- [数据库建模](/schema-designer/) — PostgreSQL 物理模型
