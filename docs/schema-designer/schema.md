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
  dialect: 'mysql'
  name: string
  comment?: string
  tables: SchemaTable[]
  relations: SchemaRelation[]
}
```

| 字段 | 说明 |
|------|------|
| `version` | schema 协议版本，当前固定为 `1` |
| `dialect` | 方言，当前仅 `mysql` |
| `name` | 库名（标识符最长 64，经 `clampIdentifier` 截断） |
| `comment` | 库注释 |
| `tables` | 表列表（含中间表） |
| `relations` | 表间关联列表 |

可用 `createDatabaseSchema(patch?)` 生成带默认空表 / 关联数组的对象。

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
| `name` | 表名（最长 64） |
| `columns` | 字段列表；新建表默认含 `id` BIGINT 主键自增 |
| `position` | 画布坐标 |
| `isJunction` | `true` 表示 N:N 自动生成的中间表 |

## SchemaColumn

```ts
type MysqlColumnType =
  | 'TINYINT' | 'SMALLINT' | 'INT' | 'BIGINT'
  | 'DECIMAL' | 'FLOAT' | 'DOUBLE'
  | 'VARCHAR' | 'CHAR' | 'TEXT' | 'MEDIUMTEXT' | 'LONGTEXT'
  | 'DATE' | 'DATETIME' | 'TIMESTAMP' | 'TIME'
  | 'BOOLEAN' | 'JSON' | 'BLOB'

type SchemaColumn = {
  id: string
  name: string
  type: MysqlColumnType
  /** VARCHAR / CHAR 长度；DECIMAL 精度 */
  length?: number | null
  /** DECIMAL 小数位 */
  scale?: number | null
  primaryKey: boolean
  autoIncrement: boolean
  unique: boolean
  nullable: boolean
  indexed: boolean
  defaultValue?: string | null
  comment?: string
}
```

展示类型时：`VARCHAR` / `CHAR` 带长度写成 `VARCHAR(255)`；`DECIMAL` 写成 `DECIMAL(精度,小数位)`。

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
  "dialect": "mysql",
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
  "relations": []
}
```

## 包导出类型

```ts
import type {
  DatabaseSchema,
  SchemaTable,
  SchemaColumn,
  SchemaRelation,
  SchemaRelationType,
  MysqlColumnType,
  SchemaReferentialAction,
} from '@grow-admin-rock/schema-designer'
```

## 相关文档

- [基础用法](/schema-designer/usage)
- [表关联](/schema-designer/relations)
