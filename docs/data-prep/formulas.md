---
title: 数据准备 · 公式度量
lang: zh-CN
---

# 公式度量

每条 `metricConfigs` 包含一组维度字段与一条 **度量公式**。公式在「当前分组的行集合」上求值，结果写入该配置的 `measure.outputKey`。

设计器中通过「维度 / 度量 → 编辑」打开配置面板，公式区可插入字段 token 与函数（文档列表来自 `FORMULA_FUNCTION_DOCS`）。

## 字段引用

- 写法：`[alias.column]`，例如 `[orders.amount]`
- `alias` 为画布源表别名（`sources[].alias`），`column` 为物理列名
- 可用 `formulaFieldToken('orders.amount')` → `[orders.amount]`
- `extractFormulaFields(formula)` 可解析公式中引用的全部字段

## 语法能力

| 类别 | 支持 |
|------|------|
| 算术 | `+` `-` `*` `/` 与括号 |
| 比较 | `>` `>=` `<` `<=` `=` `==` `!=` `<>` |
| 逻辑 | `AND` / `OR` / `NOT`，以及 `&&` / `\|\|` |
| 聚合 | `SUM` / `AVG` / `COUNT` / `MAX` / `MIN`（在分组行上计算） |
| 条件 | `IF` / `IFERROR` / `TRUE` / `FALSE` |
| 字面量 | 数字、字符串、布尔 |

## 聚合函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `SUM(字段, …)` | 分组内数值求和 | `SUM([orders.amount])` |
| `AVG(字段)` | 平均值 | `AVG([orders.amount])` |
| `COUNT(字段?)` | 无参：行数；有字段：非空个数 | `COUNT([orders.id])` |
| `MAX(字段)` | 最大值 | `MAX([orders.amount])` |
| `MIN(字段)` | 最小值 | `MIN([orders.amount])` |

## 逻辑与条件

| 函数 | 说明 | 示例 |
|------|------|------|
| `AND(…)` | 全真为真 | `AND([orders.amount]>0, [orders.quantity]>0)` |
| `OR(…)` | 任一为真 | `OR([orders.amount]>0, [orders.quantity]>0)` |
| `NOT(x)` | 取反 | `NOT([orders.amount]=0)` |
| `IF(条件, 真值, 假值)` | 分支 | `IF([orders.amount]>0, SUM([orders.amount]), 0)` |
| `IFERROR(值, 回退)` | 空或非有限数字时回退 | `IFERROR(SUM([orders.amount])/SUM([orders.quantity]), 0)` |
| `TRUE()` / `FALSE()` | 常量 | `TRUE()` |

完整签名与参数说明见包内常量 `FORMULA_FUNCTION_DOCS`。

## 公式编辑器 UI

在「维度 / 度量」配置面板点击公式区「点击编辑公式」，打开公式对话框：

- 可从字段列表插入 `[alias.column]` token  
- 可从函数文档（`FORMULA_FUNCTION_DOCS`）插入聚合 / 逻辑函数  
- 分类通常包括 **agg**（聚合）与 **logic**（逻辑）  
- 选中函数时可看到 signature、description、example、params  

保存度量配置前公式必须非空，否则面板不会关闭。

## 求值语义

- 引擎按「当前分组内的行集合」计算聚合函数  
- 无维度时：整表（Join 后）作为一组  
- 有维度时：按 `dimensionFields` 顺序分组，每组算一次公式  
- 非法数字参与运算时常按 0 处理；`IFERROR` 可捕获空 / 非有限结果  

包内也可脱离 UI 试算：

```ts
import {
  evaluateFormulaOnGroup,
  previewMetricConfig,
  extractFormulaFields,
} from '@grow-admin-rock/data-prep'

const fields = extractFormulaFields('SUM([orders.amount])')
// fields === ['orders.amount']
```

## 更多示例

```text
# 客单价
IFERROR(SUM([orders.amount]) / SUM([orders.quantity]), 0)

# 有销量才汇总金额
IF(SUM([orders.quantity]) > 0, SUM([orders.amount]), 0)

# 多字段求和
SUM([orders.amount], [orders.tax])
```

## 配置完整示例

按区域汇总订单金额：

```ts
{
  id: 'cfg_amount',
  dimensionFields: ['orders.region'],
  measure: {
    name: '订单金额',
    outputKey: 'amount',
    formula: 'SUM([orders.amount])',
  },
}
```

务必在 `outputFields` 中勾选 `orders.region` 与 `amount`，预览才会出列。

## 与输出字段的关系

- 公式结果列名 = `measure.outputKey`（缺省回退配置 `id`）  
- 仅出现在 `outputFields` 中的列会出现在 `DatasetQueryResult`  
- 明细列用 `alias.column`；度量列用 `outputKey`（不是公式原文）  
- 删除度量配置后，实现侧会 prune 失效的输出字段  

## 相关文档

- [数据模型](/data-prep/schema)
- [基础用法](/data-prep/usage)
- [表关联](/data-prep/joins)
