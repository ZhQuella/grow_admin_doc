---
title: 数据库建模 · 表关联
lang: zh-CN
---

# 表关联

通过画布上字段圆点连线创建关联，确认后写入 `relations`，并可能自动补外键列或中间表。

## 连线约定

1. 从 **A 表字段** 拖到 **B 表字段**（不能连到同一张表）
2. **起点**视为被引用侧（通常是主键），**终点**视为外键侧
3. 未点到具体手柄时，会回退到该表的主键列（或第一列）
4. 松开后弹出 **创建关联** 抽屉，选择：
   - 关系类型：一对一 / 一对多 / 多对多
   - `ON DELETE` / `ON UPDATE`（级联 / 设为空 / 限制 / 不操作）

画布上关联边会显示类型标签（`1:1` / `1:N` / `N:N`）；悬停可点垃圾桶删除。

## 一对一 / 一对多

语义：`source` = 被引用表列，`target` = 外键所在表列。

| 场景 | 行为 |
|------|------|
| 终点落在 **主键** 上 | 在目标表自动确保外键列 `{源表名}_id`（已存在则复用），再指向该列 |
| 终点落在 **非主键** 上 | 使用该字段作为外键；并标记 `indexed`；1:1 时额外设 `unique` |

自动创建外键列时：

- 类型 / 长度 / 精度对齐被引用列
- `indexed: true`
- 1:1：`nullable: false`，`unique: true`
- 1:N：`nullable: true`（默认可空）

```
user.id  ──1:N──►  order.user_id
  ▲ source（被引用）     ▲ target（外键）
```

## 多对多

确认 N:N 后调用 `createManyToManyArtifacts`：

1. 新建中间表，名优先 `{左表}_{右表}`（冲突则加后缀）
2. 中间表带 `id` 主键，以及两端外键列 `{左表}_id` / `{右表}_id`
3. 标记 `isJunction: true`，位置大致在两表中间
4. `SchemaRelation` 写入 `junctionTableId` 与两端 junction 列 id

```
user.id  ◄── N:N ──►  role.id
              │
              ▼
         user_role（中间表）
         ├─ id
         ├─ user_id
         └─ role_id
```

删除 N:N 关联时会 **同时删除** 对应中间表。删除业务表时，若存在以其为端点的 N:N，也会一并移除相关中间表与关联。

## 参照动作

| 值 | 面板文案 | 常见含义 |
|------|----------|----------|
| `CASCADE` | 级联 | 父行变更时同步子行 |
| `SET NULL` | 设为空 | 父行删除时子外键置 NULL |
| `RESTRICT` | 限制 | 存在引用则禁止删除 / 更新 |
| `NO ACTION` | 不操作 | 检查延迟到语句结束（实现依赖引擎） |

创建后可在「关联配置」面板修改 `onDelete` / `onUpdate`；关系类型本身创建后不可改（需删线重建）。

## 常量

包入口导出 `RELATION_TYPE_OPTIONS`（一对一 / 一对多 / 多对多的下拉选项）。参照动作取值为 `CASCADE` | `SET NULL` | `RESTRICT` | `NO ACTION`。

## 相关文档

- [基础用法](/schema-designer/usage)
- [数据模型](/schema-designer/schema)
