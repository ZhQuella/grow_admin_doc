---
title: 数据清洗 · 节点与算子
lang: zh-CN
---

# 节点与算子

本文按 **类别** 说明组件库中的全部节点：中文名、端口数、配置字段、与相近节点的差异。类型定义见 [数据模型](/data-clean/schema)。十五种节点均已提供配置 UI，并由 `runCleanFlowLocal` 实现本地变换。

## 类别与配色

| 类别 | `category` | 中文 | CSS 变量（节点强调色） |
|------|------------|------|------------------------|
| 数据源 | `source` | 数据源 | `--clean-cat-source`（青） |
| 清洗 | `clean` | 清洗 | `--clean-cat-clean`（琥珀） |
| 合并 | `merge` | 合并 | `--clean-cat-merge`（紫） |
| 聚合 | `agg` | 聚合 | `--clean-cat-agg`（靛） |
| 输出 | `output` | 输出 | `--clean-cat-output`（绿） |

## 端口与连线

每个类型在 `NODE_TYPE_META` 中声明 `inputs` / `outputs`：

| 规则 | 说明 |
|------|------|
| 输入在左、输出在右 | 禁止从 in 拖到 out（方向校验） |
| `inputs === 0` | 源节点，无左侧 Handle |
| `outputs === 0` | 输出节点，无右侧 Handle |
| `inputs >= 2` | 左侧额外 `in-left-top` / `in-left-bottom`（Join / Union） |
| `outputs === 2` | 右侧 `out-true`（是）/ `out-false`（否），仅条件分支 |
| 普通单出 | `out-right`，并附带上下辅助出点便于一对多分发 |

常用 Handle id：

| Handle | 含义 |
|--------|------|
| `in-left` | 主输入 |
| `in-left-top` / `in-left-bottom` | 多输入辅助 |
| `out-right` / `out-right-top` / `out-right-bottom` | 普通输出 |
| `out-true` / `out-false` | 条件分支「是 / 否」 |

画布还禁止：自连、成环、同一 `source+target+sourceHandle` 重复边；**整图仅允许一个 `output` 节点**。

---

## 数据源（source）

### 数据表 `table`

| 项 | 值 |
|------|------|
| 端口 | 入 0 / 出 1 |
| 说明 | 从建模或数据准备选择表 / 输出 |
| 配置 UI | **已实现**（含字段勾选） |

| 配置字段 | 说明 |
|----------|------|
| `sourceKind` | `schema-table` \| `dataset-table` \| `dataset-output` |
| `refId` / `refLabel` | 选中项 id 与展示名 |
| `tableId` / `tableName` | 表标识 |
| `fields` | `undefined`/`null` = 全部；非空数组 = 投影；`[]` = 无字段 |

Demo 表示例（`DEMO_SOURCE_OPTIONS`）：

- 建模：`demo_sales · orders / customers`，`demo_region · regions`
- Dataset 原始表：`销售数据集 · orders / customers`
- Dataset 输出：`销售数据集 · 查询输出`

### API 接口 `api`

| 项 | 值 |
|------|------|
| 端口 | 入 0 / 出 1 |
| 说明 | 从 HTTP 接口拉取数据 |
| 配置 UI | **已实现** |

| 配置字段 | 默认 |
|----------|------|
| `url` | `''`（可填 `/demo/orders` 等；留空用包内默认样例帧） |
| `method` | `'GET'` \| `'POST'` |

本地预览通过 `resolveDemoApiFrame` 解析 Demo 帧，不发起真实跨域请求。

---

## 清洗（clean）

### 空值处理 `null-handle`

| 项 | 值 |
|------|------|
| 端口 | 1 / 1 |
| 说明 | 填充 / 删除行 / 前后向填充 |
| 配置 UI | **已实现** |

| 字段 | 取值 |
|------|------|
| `fields` | 作用列 |
| `strategy` | `fill` \| `drop-row` \| `ffill` \| `bfill` |
| `fillValue` | `strategy=fill` 时的填充值 |

### 格式标准化 `format`

| 项 | 值 |
|------|------|
| 端口 | 1 / 1 |
| 说明 | 手机号 / 日期 / 金额等格式 |
| 配置 UI | **已实现** |

| 字段 | 取值 |
|------|------|
| `field` | 目标列 |
| `format` | `phone` \| `id-card` \| `date` \| `money` \| `regex` |
| `pattern` | `regex` 时的模式（含捕获组时取第 1 组） |

### 去重 `dedupe`

| 项 | 值 |
|------|------|
| 端口 | 1 / 1 |
| 说明 | 按字段组合去重 |
| 配置 UI | **已实现** |

| 字段 | 取值 |
|------|------|
| `fields` | 判重键 |
| `keep` | `first` \| `last` \| `random` |

### 去空格&大小写 `trim-case`

| 项 | 值 |
|------|------|
| 端口 | 1 / 1 |
| 说明 | 空格与大小写规范化 |
| 配置 UI | **已实现** |

| 字段 | 取值 |
|------|------|
| `fields` | 作用列 |
| `ops` | `trim` \| `trim-all` \| `upper` \| `lower` \| `capitalize`（可多选） |

### 异常值处理 `outlier`

| 项 | 值 |
|------|------|
| 端口 | 1 / 1 |
| 说明 | 范围 / 正则 / 枚举校验 |
| 配置 UI | **已实现** |

| 字段 | 取值 |
|------|------|
| `field` | 目标列 |
| `rule` | `range` \| `regex` \| `enum` |
| `action` | `mark` \| `drop` \| `replace` |
| `replaceValue` | `action=replace` 时替换值 |
| `min` / `max` | `rule=range` |
| `pattern` | `rule=regex` |
| `enumValues` | `rule=enum`，逗号分隔合法值 |

### 条件过滤 `filter`

| 项 | 值 |
|------|------|
| 端口 | 1 / 1 |
| 说明 | **丢弃**不满足条件的行 |
| 配置 UI | **已实现** |

| 字段 | 说明 |
|------|------|
| `logic` | 多条件组合：`and` \| `or`（条件数 > 1 时显示） |
| `conditions[]` | `{ field, op, value }` |

界面提示：仅保留满足条件的行，不满足的行会被丢弃。

### 条件分支 `condition`

| 项 | 值 |
|------|------|
| 端口 | 1 / **2** |
| 说明 | **保留全部行**，按条件分流到「是 / 否」两路下游 |
| 配置 UI | **已实现**（表单与 filter 相同，语义不同） |

| 字段 | 说明 |
|------|------|
| `logic` / `conditions` | 同 `CleanFilterConfig` |

界面提示：满足条件从右侧「是」出口流出，否则从「否」出口流出；两路均可继续连接下游。

::: tip filter vs condition
- **过滤**：行集合变小（不满足 → 删除）。
- **分支**：行集合按条件拆到两条管道，总量不变（分别进入不同下游）。
:::

### 字段拆分 `split-field`

| 项 | 值 |
|------|------|
| 端口 | 1 / 1 |
| 说明 | 将一个字段拆分为多个字段 |
| 配置 UI | **已实现**；预览随配置变化 |

| 字段 | 说明 |
|------|------|
| `field` | 源字段名 |
| `mode` | `delimiter` \| `regex` \| `fixed-width` |
| `delimiter` | 分隔符模式，如 `,` / `\|` / 空格 |
| `pattern` | 正则捕获组，如 `^(\\d{4})-(\\d{2})-(\\d{2})$` |
| `outputs` | 输出字段列表；固定宽度可带 `width` |
| `keepOriginal` | 是否保留原字段，默认 `true` |
| `padEmpty` | 段数不足时是否用空值补齐，默认 `true` |

示例：

- `张三,李四` + 分隔符 `,` → `first_name` / `last_name`
- 日期 `2026-08-10` + 正则捕获 → 年 / 月 / 日三列

---

## 过滤运算符

`FILTER_OP_OPTIONS`（filter / condition 共用）：

| 标签 | `op` | 是否需要 `value` |
|------|------|------------------|
| 等于 | `eq` | 是 |
| 不等于 | `neq` | 是 |
| 大于 | `gt` | 是 |
| 大于等于 | `gte` | 是 |
| 小于 | `lt` | 是 |
| 小于等于 | `lte` | 是 |
| 包含 | `contains` | 是 |
| 不包含 | `not-contains` | 是 |
| 为空 | `empty` | 否（界面隐藏值输入） |
| 不为空 | `not-empty` | 否 |

组合逻辑：`且 (AND)` / `或 (OR)`。

---

## 合并（merge）

### 关联合并 `join`

| 项 | 值 |
|------|------|
| 端口 | **2** / 1 |
| 说明 | LEFT / INNER / RIGHT / FULL JOIN |
| 配置 UI | **已实现** |

| 字段 | 说明 |
|------|------|
| `joinType` | `left` \| `inner` \| `right` \| `full`（默认 `left`） |
| `keys` | `{ leftField, rightField }[]` |
| `outputFields` | 输出列投影（可选） |

连线时请把两路上游分别接到左侧不同输入锚点。

### 纵向合并 `union`

| 项 | 值 |
|------|------|
| 端口 | **2** / 1 |
| 说明 | UNION 多路输入 |
| 配置 UI | **已实现** |

| 字段 | 说明 |
|------|------|
| `dedupe` | 是否去重，默认 `false` |
| `fieldMap` | 字段名映射；界面可用 `右字段:左字段` 逗号列表编辑 |

---

## 聚合（agg）

### 分组聚合 `groupby`

| 项 | 值 |
|------|------|
| 端口 | 1 / 1 |
| 说明 | GROUP BY + 聚合度量 |
| 配置 UI | **已实现** |

| 字段 | 说明 |
|------|------|
| `groupFields` | 分组列 |
| `metrics` | `{ field, fn, alias }[]`，`fn` 为 `SUM` \| `COUNT` \| `AVG` \| `MAX` \| `MIN` |

与 [数据准备公式度量](/data-prep/formulas) 不同：此处是节点级结构化聚合配置，不是自由公式文本。

### 透视表 `pivot`

| 项 | 值 |
|------|------|
| 端口 | 1 / 1 |
| 说明 | 行 / 列维度透视 |
| 配置 UI | **已实现** |

| 字段 | 说明 |
|------|------|
| `rowField` / `colField` / `valueField` | 行维、列维、值列 |
| `agg` | `SUM` \| `COUNT` \| `AVG` \| `MAX` \| `MIN`（默认 `SUM`） |

---

## 输出（output）

### 数据输出 `output`

| 项 | 值 |
|------|------|
| 端口 | 1 / **0** |
| 说明 | 流终点，供报表 / 页面调用时执行 |
| 配置 UI | **已实现**（名称 + 目标 + 输出字段勾选） |

| 字段 | 说明 |
|------|------|
| `outputName` | 输出名，默认「清洗输出」 |
| `target` | `report`（报表数据集）\| `lowcode`（低代码页面数据源）\| `api`（API 端点） |
| `trigger` | `on-demand` \| `manual-preview`（预留） |
| `consumers` | `{ id, name, kind: 'report'\|'page' }[]`（预留） |
| `fields` | 最终输出投影；未配置默认全部，也可全部取消（`[]`） |

界面提示：调用时执行；消费者绑定后续对接。画布上**只能有一个**输出节点。

---

## 节点速查表

| type | 中文 | 类别 | 入/出 | 配置 UI | 本地变换 |
|------|------|------|-------|---------|----------|
| `table` | 数据表 | source | 0/1 | ✅ | ✅ |
| `api` | API 接口 | source | 0/1 | ✅ | ✅（Demo 帧） |
| `null-handle` | 空值处理 | clean | 1/1 | ✅ | ✅ |
| `format` | 格式标准化 | clean | 1/1 | ✅ | ✅ |
| `dedupe` | 去重 | clean | 1/1 | ✅ | ✅ |
| `trim-case` | 去空格&大小写 | clean | 1/1 | ✅ | ✅ |
| `outlier` | 异常值处理 | clean | 1/1 | ✅ | ✅ |
| `filter` | 条件过滤 | clean | 1/1 | ✅ | ✅ |
| `condition` | 条件分支 | clean | 1/2 | ✅ | ✅ |
| `split-field` | 字段拆分 | clean | 1/1 | ✅ | ✅ |
| `join` | 关联合并 | merge | 2/1 | ✅ | ✅ |
| `union` | 纵向合并 | merge | 2/1 | ✅ | ✅ |
| `groupby` | 分组聚合 | agg | 1/1 | ✅ | ✅ |
| `pivot` | 透视表 | agg | 1/1 | ✅ | ✅ |
| `output` | 数据输出 | output | 1/0 | ✅ | ✅ |

## 相关文档

- [概述](/data-clean/)
- [基础用法](/data-clean/usage)
- [数据模型](/data-clean/schema)
- [数据准备 · 表关联](/data-prep/joins) — 分析层 Join，与清洗 `join` 节点不同场景
