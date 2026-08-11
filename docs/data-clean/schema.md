---
title: 数据清洗 · 数据模型
lang: zh-CN
---

# 数据模型

设计器产物为声明式 **`CleanFlow`**。设计期可用 `runCleanFlowLocal` 按 `nodes` + `edges` 拓扑预览；生产侧「调用时执行」仍为规划对接。本页描述类型、默认配置与包导出。节点语义与端口见 [节点与算子](/data-clean/nodes)。

## CleanFlow

```ts
type CleanFlowStatus = 'draft' | 'published'

type CleanFlow = {
  version: 1
  id: string
  name: string
  status: CleanFlowStatus
  nodes: CleanFlowNode[]
  edges: CleanFlowEdge[]
  updatedAt?: string
}
```

| 字段 | 说明 |
|------|------|
| `version` | 固定为 `1`，便于后续迁移 |
| `id` / `name` | 流标识与展示名 |
| `status` | 草稿 / 已发布；工具栏仅展示，无切换 UI |
| `nodes` / `edges` | 算子图；边引用节点 `id` |
| `updatedAt` | ISO 字符串；每次 `commit` 刷新 |

::: tip 调用时执行 vs 本地预览
流本身不缓存清洗结果。设计意图是：报表 / 页面 / API **按需**加载 `CleanFlow` 定义并实时跑管道。包内已提供 **本地 Demo 执行器** `runCleanFlowLocal`（设计器预览与 Mock `/data-clean/preview` 使用）；生产远程执行与消费者绑定仍待对接。
:::

## 节点与边

```ts
type CleanNodeCategory = 'source' | 'clean' | 'merge' | 'agg' | 'output'

type CleanNodeType =
  | 'table' | 'api'
  | 'null-handle' | 'format' | 'dedupe' | 'trim-case' | 'outlier'
  | 'filter' | 'condition' | 'split-field'
  | 'join' | 'union'
  | 'groupby' | 'pivot'
  | 'output'

type CleanFlowNode<T extends CleanNodeType = CleanNodeType> = {
  id: string
  type: T
  name: string
  position: { x: number; y: number }
  /** 预览统计（设计器本地管道采样，非生产权威） */
  stats?: {
    inputRows?: number | null
    outputRows?: number | null
  }
  config: CleanNodeConfigMap[T]
}

type CleanFlowEdge = {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
}
```

| 字段 | 说明 |
|------|------|
| `type` | 决定类别、端口数、默认 `config` |
| `name` | 画布标题，默认同类型中文名 |
| `stats` | 预览成功后写入入/出行数 |
| `config` | 与 `type` 对应的配置对象，见下表 |
| `sourceHandle` / `targetHandle` | Vue Flow 锚点 id；常见 `out-right` / `in-left`；分支为 `out-true` / `out-false` |

## CleanNodeConfigMap

每种 `CleanNodeType` 对应一套 config。工厂 `defaultConfigForType` 会赋默认值。

### 字段投影约定

`table.config.fields` 与 `output.config.fields`：

| 值 | 含义 |
|----|------|
| `undefined` / `null` | 透传上游 / 表的**全部**字段（默认） |
| `string[]`（非空） | 按列表投影（有序） |
| `[]` | **不输出任何字段**（空结果列） |

不要用「空数组 = 全选」理解；空数组是显式清空。

### 数据源

```ts
type CleanTableSourceKind = 'schema-table' | 'dataset-table' | 'dataset-output'

type CleanTableSourceConfig = {
  sourceKind: CleanTableSourceKind
  /** 建模 id 或 dataset id（demo 中常为复合键） */
  refId?: string
  refLabel?: string
  tableId?: string
  tableName?: string
  /** undefined/null = 全部；[] = 无字段 */
  fields?: string[] | null
}

type CleanApiSourceConfig = {
  url?: string
  method?: 'GET' | 'POST'
}
```

| `sourceKind` | 含义 |
|--------------|------|
| `schema-table` | 直接引用数据库建模中的表 |
| `dataset-table` | 引用数据准备 Dataset 内的原始表 |
| `dataset-output` | 引用 Dataset 的查询输出 |

Demo 选项见包内 `DEMO_SOURCE_OPTIONS` / `TABLE_SOURCE_KIND_OPTIONS`（当前为写死列表，后续对接真实接口）。

### 清洗

```ts
type CleanNullHandleConfig = {
  fields?: string[]
  strategy?: 'fill' | 'drop-row' | 'ffill' | 'bfill'
  fillValue?: string
}

type CleanFormatConfig = {
  field?: string
  format?: 'phone' | 'id-card' | 'date' | 'money' | 'regex'
  pattern?: string
}

type CleanDedupeConfig = {
  fields?: string[]
  keep?: 'first' | 'last' | 'random'
}

type CleanTrimCaseConfig = {
  fields?: string[]
  ops?: Array<'trim' | 'trim-all' | 'upper' | 'lower' | 'capitalize'>
}

type CleanOutlierConfig = {
  field?: string
  rule?: 'range' | 'regex' | 'enum'
  action?: 'mark' | 'drop' | 'replace'
  replaceValue?: string
  min?: string
  max?: string
  pattern?: string
  /** 逗号分隔合法值 */
  enumValues?: string
}

type CleanFilterCondition = {
  field: string
  op: string
  value: string
}

type CleanFilterConfig = {
  logic?: 'and' | 'or'
  conditions?: CleanFilterCondition[]
}

/** 条件分支：分流；不过滤丢弃 */
type CleanConditionConfig = {
  logic?: 'and' | 'or'
  conditions?: CleanFilterCondition[]
}

type CleanSplitMode = 'delimiter' | 'regex' | 'fixed-width'

type CleanSplitOutputField = {
  name: string
  /** 固定宽度模式下的截取长度 */
  width?: number
}

type CleanSplitFieldConfig = {
  field?: string
  mode?: CleanSplitMode
  delimiter?: string
  pattern?: string
  outputs?: CleanSplitOutputField[]
  keepOriginal?: boolean
  padEmpty?: boolean
}
```

### 合并 / 聚合 / 输出

```ts
type CleanJoinConfig = {
  joinType?: 'left' | 'inner' | 'right' | 'full'
  keys?: Array<{ leftField: string; rightField: string }>
  outputFields?: string[]
}

type CleanUnionConfig = {
  dedupe?: boolean
  fieldMap?: Record<string, string>
}

type CleanGroupByMetric = {
  field: string
  fn: 'SUM' | 'COUNT' | 'AVG' | 'MAX' | 'MIN'
  alias: string
}

type CleanGroupByConfig = {
  groupFields?: string[]
  metrics?: CleanGroupByMetric[]
}

type CleanPivotConfig = {
  rowField?: string
  colField?: string
  valueField?: string
  agg?: 'SUM' | 'COUNT' | 'AVG' | 'MAX' | 'MIN'
}

type CleanOutputConfig = {
  outputName?: string
  target?: 'report' | 'lowcode' | 'api'
  trigger?: 'on-demand' | 'manual-preview'
  consumers?: Array<{ id: string; name: string; kind: 'report' | 'page' }>
  /** undefined/null = 上游全部；[] = 无字段 */
  fields?: string[] | null
}
```

| 输出字段 | 说明 |
|----------|------|
| `outputName` | 下游展示名，默认「清洗输出」 |
| `target` | 消费场景：报表数据集 / 低代码页面数据源 / API |
| `trigger` | 预留：按需 / 手动预览 |
| `consumers` | 预留：已绑定的报表 / 页面列表 |
| `fields` | 最终输出投影（见上文约定） |

## 预览结果类型

```ts
type CleanPreviewColumn = {
  key: string
  title: string
  dataType?: string
}

type CleanPreviewResult = {
  columns: CleanPreviewColumn[]
  rows: Record<string, unknown>[]
  /** 配置问题等提示（不阻断预览） */
  warnings?: string[]
  /** 致命错误（无目标节点、多 output 等） */
  error?: string
  targetNodeId?: string
  targetNodeName?: string
}
```

设计器与 Mock 预览均由 `runCleanFlowLocal(flow, options)` 生成。

```ts
type CleanRunOptions = {
  targetNodeId?: string
  toOutput?: boolean
  tableRows?: CleanTableRowsMap
  limit?: number // 默认 50
}
```

`CLEAN_IMPLEMENTED_NODE_TYPES` 列出当前已实现变换的全部十五种类型。历史导出 `buildDemoPreview` 仍可用，但**设计器主路径已不再调用**。

## 组件库元数据

```ts
type CleanPaletteItem = {
  type: CleanNodeType
  category: CleanNodeCategory
  label: string
  icon: string
  description?: string
  /** false 表示后续版本，不可拖 */
  enabled?: boolean
}

type CleanPaletteGroup = {
  category: CleanNodeCategory
  label: string
  items: CleanPaletteItem[]
}
```

运行时目录：`PALETTE_GROUPS`（由 `NODE_TYPE_META` 生成）、`CATEGORY_META`（含 CSS 变量色）。

## 工厂与导出

```ts
import {
  GrowDataCleanDesigner,
  createCleanFlow,
  createCleanFlowNode,
  createCleanFlowEdge,
  cloneCleanFlow,
  defaultConfigForType,
  CATEGORY_META,
  NODE_TYPE_META,
  PALETTE_GROUPS,
  TABLE_SOURCE_KIND_OPTIONS,
  DEMO_SOURCE_OPTIONS,
  SPLIT_MODE_OPTIONS,
  FILTER_OP_OPTIONS,
  FILTER_LOGIC_OPTIONS,
  runCleanFlowLocal,
  countOutputNodes,
  CLEAN_IMPLEMENTED_NODE_TYPES,
  loadCleanTableRowsMap,
  fetchCleanDemoTables,
  fetchCleanTableRows,
  buildDemoPreview,
  type CleanFlow,
  type CleanFlowNode,
  type CleanNodeType,
  type CleanPreviewResult,
} from '@grow-admin-rock/data-clean'
```

| API | 说明 |
|-----|------|
| `createCleanFlow({ name, ... })` | 新建流；默认 `status: 'draft'`、空 nodes/edges |
| `createCleanFlowNode(type, patch?)` | 按类型填默认名、config、stats |
| `createCleanFlowEdge({ source, target, ... })` | 默认 handle：`out-right` → `in-left` |
| `cloneCleanFlow(flow)` | `JSON` 深拷贝 |
| `defaultConfigForType(type)` | 仅返回该类型默认 config |
| `runCleanFlowLocal(flow, options?)` | 本地管道执行 / 预览 |
| `countOutputNodes(flow)` | 输出节点数量（画布限制用） |
| `CLEAN_IMPLEMENTED_NODE_TYPES` | 已实现变换的类型列表 |
| `loadCleanTableRowsMap()` | 优先 Mock，失败回退包内 demo |
| `fetchCleanDemoTables` / `fetchCleanTableRows` | Mock HTTP 封装 |
| `buildDemoPreview(name, node?)` | 旧版占位采样（兼容导出） |

无 Vue 的纯 TS 子路径目前**未**单独拆出（与 data-prep 的 `/core` 不同）；Mock 直接引用包内无 Vue 的 `demoTables` / `runCleanFlow` 文件，避免 vite-plugin-mock 解析组件入口失败。

## 默认 config 一览

| type | 默认要点 |
|------|----------|
| `table` | `sourceKind: 'schema-table'`（`fields` 未设 = 全部） |
| `api` | `method: 'GET'`, `url: ''` |
| `null-handle` | `strategy: 'fill'`, `fields: []`, `fillValue: ''` |
| `format` | `format: 'date'` |
| `dedupe` | `keep: 'first'`, `fields: []` |
| `trim-case` | `ops: ['trim']`, `fields: []` |
| `outlier` | `rule: 'range'`, `action: 'mark'`，`min/max/pattern/enumValues` 空串 |
| `filter` / `condition` | `logic: 'and'`，一条空条件 |
| `split-field` | `mode: 'delimiter'`, `delimiter: ','`，两段输出 `field_1`/`field_2`，`keepOriginal`/`padEmpty` 为 true |
| `join` | `joinType: 'left'`，一条空 `keys` |
| `union` | `dedupe: false`, `fieldMap: {}` |
| `groupby` | `groupFields: []`，一条空 `metrics`（`fn: 'SUM'`, `alias: 'metric_1'`） |
| `pivot` | `agg: 'SUM'` |
| `output` | `outputName: '清洗输出'`, `target: 'report'`, `trigger: 'on-demand'`, `consumers: []`（`fields` 未设 = 全部） |

## 相关文档

- [基础用法](/data-clean/usage)
- [节点与算子](/data-clean/nodes)
- [数据准备 · 数据模型](/data-prep/schema) — Dataset 可作为清洗源
- [DesignRock 核心层](/guide/packages/design-rock)
