---
title: 数据库建模 · 数据模型
lang: zh-CN
---

# 数据模型

设计器读写统一使用 `DatabaseSchema`，可供保存、回填（`v-model` / `setSchema`）与下游代码生成。

## 顶层结构

```ts
type DatabaseSchema = {
  version: 1
  dialect: 'postgresql'
  name: string
  comment?: string
  tables: SchemaTable[]
  relations: SchemaRelation[]
  queries?: SchemaSqlQuery[]
}
```

| 字段 | 说明 |
|------|------|
| `version` | schema 协议版本，当前固定为 `1` |
| `dialect` | 方言，当前为 `postgresql` |
| `name` | 库名（标识符最长 63，经 `clampIdentifier` 截断） |
| `comment` | 库注释 |
| `tables` | 表列表（含中间表） |
| `relations` | 表间关联列表 |
| `queries` | 建模侧 SQL 查询配置（可选，左轨「SQL 查询」面板维护；本版仅本地存档） |

可用 `createDatabaseSchema(patch?)` 生成带默认空表 / 关联数组的对象。

## SchemaSqlQuery

```ts
type SchemaSqlQuery = {
  id: string
  name: string
  description?: string
  sql: string
}
```

操作说明见 [基础用法 · SQL 查询面板](/schema-designer/usage#sql-查询面板)。

## SchemaTable

```ts
type SchemaTable = {
  id: string
  name: string
  comment?: string
  columns: SchemaColumn[]
  position: { x: number; y: number }
  /** 多对多自动生成的中间表 */
  isJunction?: boolean
}
```

| 字段 | 说明 |
|------|------|
| `id` | 表唯一 id（Vue Flow 节点 id） |
| `name` | 表名（最长 63） |
| `columns` | 字段列表；新建表默认含 `id` BIGINT 主键自增 |
| `position` | 画布坐标 |
| `isJunction` | `true` 表示 N:N 自动生成的中间表 |

## SchemaColumn

```ts
type SchemaColumnType =
  | 'SMALLINT' | 'INTEGER' | 'BIGINT'
  | 'NUMERIC' | 'REAL' | 'DOUBLE PRECISION'
  | 'VARCHAR' | 'CHAR' | 'TEXT'
  | 'DATE' | 'TIME' | 'TIMESTAMP' | 'TIMESTAMPTZ'
  | 'BOOLEAN' | 'JSON' | 'JSONB' | 'BYTEA' | 'UUID'

type SchemaColumn = {
  id: string
  name: string
  type: SchemaColumnType
  /** VARCHAR / CHAR 长度；NUMERIC 精度 */
  length?: number | null
  /** NUMERIC 小数位 */
  scale?: number | null
  primaryKey: boolean
  /** 自增：PostgreSQL IDENTITY / SERIAL 语义 */
  autoIncrement: boolean
  unique: boolean
  nullable: boolean
  indexed: boolean
  defaultValue?: string | null
  comment?: string
}
```

展示类型时：`VARCHAR` / `CHAR` 带长度写成 `VARCHAR(255)`；`NUMERIC` 写成 `NUMERIC(精度,小数位)`。列类型选项见 `SCHEMA_COLUMN_TYPE_OPTIONS`。

## SchemaRelation

```ts
type SchemaRelationType = 'one-to-one' | 'one-to-many' | 'many-to-many'
type SchemaReferentialAction = 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'

type SchemaRelation = {
  id: string
  type: SchemaRelationType
  /** 1:1 / 1:N：被引用侧；N:N：左侧表 */
  sourceTableId: string
  sourceColumnId: string
  /** 1:1 / 1:N：外键侧；N:N：右侧表 */
  targetTableId: string
  targetColumnId: string
  junctionTableId?: string
  junctionSourceColumnId?: string
  junctionTargetColumnId?: string
  onDelete: SchemaReferentialAction
  onUpdate: SchemaReferentialAction
}
```

字段语义与创建规则见 [表关联](/schema-designer/relations)。默认参照动作：`onDelete: 'RESTRICT'`，`onUpdate: 'CASCADE'`。

## 导出 JSON 形态

`exportSchemaJson` 会规范化输出（深拷贝、补默认值），结构与内存中的 `DatabaseSchema` 一致，适合直接落库。示例片段：

```json
{
  "version": 1,
  "dialect": "postgresql",
  "name": "demo_db",
  "comment": "",
  "tables": [
    {
      "id": "...",
      "name": "user",
      "comment": "",
      "isJunction": false,
      "position": { "x": 120, "y": 100 },
      "columns": [
        {
          "id": "...",
          "name": "id",
          "type": "BIGINT",
          "length": null,
          "scale": null,
          "primaryKey": true,
          "autoIncrement": true,
          "unique": false,
          "nullable": false,
          "indexed": false,
          "defaultValue": null,
          "comment": "主键"
        }
      ]
    }
  ],
  "relations": [],
  "queries": []
}
```

## 相关文档

- [基础用法](/schema-designer/usage)
- [表关联](/schema-designer/relations)
