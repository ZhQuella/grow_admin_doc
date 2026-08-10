---
title: 数据准备 · 表关联
lang: zh-CN
---

# 表关联

多表查询必须配置 Join，使所有 `sources` 连通；否则预览 / 查询会报错提示补全关联。

## 数据模型

```ts
type DataPrepJoinType = 'inner' | 'left' | 'right'
type DataPrepJoinOnLogic = 'and' | 'or'

type DataPrepJoinOnCondition = {
  leftField: string   // 左表物理列名（不含 alias）
  rightField: string
}

type DataPrepJoin = {
  id: string
  leftSourceId: string
  rightSourceId: string
  type: DataPrepJoinType
  /** 多字段条件之间：并(and) / 或(or)；单条件时可忽略 */
  onLogic?: DataPrepJoinOnLogic
  on: DataPrepJoinOnCondition[]
}
```

| 字段 | 说明 |
|------|------|
| `type` | INNER / LEFT / RIGHT |
| `on` | 一组或多组等值条件 |
| `onLogic` | 多组时：`and`（并，全部成立）或 `or`（或，任一成立）；默认 `and` |

## 配置入口

| 入口 | 说明 |
|------|------|
| 画布拖线 | 两表之间连线，打开 `JoinConfigDrawer` |
| 关联抽屉 | 选左右表、Join 类型、关联字段；多组时出现「条件关系」 |
| 画布边 | 点击已有 Join 边可再次编辑 / 删除 |

::: tip
当前版本 **没有** 独立的「表关联」左轨面板；关联一律在画布连线与抽屉中完成。左轨负责添加表、度量、输出字段与数据集信息。
:::

### 关联抽屉交互要点

- 「关联字段」可「添加字段」配置多组左 / 右列
- 两组及以上时，顶部「条件关系」选择 **并** / **或**
- 「取消 / 确定」固定在抽屉底部；中间表单区域可滚动
- 同一对表默认合并为一条 Join（编辑已有，避免重复）

## 主表

- `primarySourceId` 指向主表 `sources[].id`
- 添加的第一张表会自动设为主表；可在表节点上切换
- 删除主表时会回退到剩余表中的第一张

## 查询语义（前端引擎）

`queryDatasetLocal` → `buildJoinedRows`：

1. 从主表 / 连通的 Join 图出发，依次拼入其它表
2. 若当前结果已包含 Join 的右表、尚未包含左表，则翻转左右字段后继续
3. 匹配时：`onLogic === 'or'` 用 `some`，否则用 `every`
4. LEFT Join 无匹配时保留左行（右列为空）

::: info 与 Schema 关联的区别
[数据库建模](/schema-designer/relations) 的 `relations` 描述物理外键 / 中间表；数据准备的 `joins` 是**分析查询**上的连接，需在设计器中手动配置，不自动套用 Schema 关系。
:::

## 相关文档

- [基础用法](/data-prep/usage)
- [数据模型](/data-prep/schema)
- [公式度量](/data-prep/formulas)
- [数据库建模 · 表关联](/schema-designer/relations)
