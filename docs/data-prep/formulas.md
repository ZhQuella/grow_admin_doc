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

## 配置示例

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

输出时在 `outputFields` 中勾选维度 `orders.region` 与度量 `amount`，预览才会出现对应列。

## 与输出字段的关系

- 公式结果列名 = `measure.outputKey`（缺省回退配置 `id`）
- 仅出现在 `outputFields` 中的列会出现在 `DatasetQueryResult`
- 明细列用 `alias.column`；度量列用 `outputKey`（不是公式原文）

## 相关文档

- [数据模型](/data-prep/schema)
- [基础用法](/data-prep/usage)
- [表关联](/data-prep/joins)
