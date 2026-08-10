---
title: 数据库建模 · 基础用法
lang: zh-CN
---

# 基础用法

本文覆盖 `GrowSchemaDesigner` 的接入、工具栏、左轨、浮层表单字段、画布连线规则与导出。方言固定为 **PostgreSQL**。

## 演示模块接入

菜单：**设计器 → 数据库建模**，path：`schema-designer-playground`。

宿主需：

1. 依赖 `@grow-admin-rock/schema-designer` 与 `@grow-admin-cornerstone/apps-designer`
2. IOC 注册 `apps-designer`
3. 动态路由合并菜单

见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)、[低代码设计器](/guide/designers/)。

## 在页面中使用

```vue
<template>
  <div class="schema-designer-playground">
    <GrowSchemaDesigner
      ref="designerRef"
      v-model="schema"
      @change="onChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  GrowSchemaDesigner,
  createDatabaseSchema,
  type DatabaseSchema,
} from '@grow-admin-rock/schema-designer'

const designerRef = ref<InstanceType<typeof GrowSchemaDesigner>>()
const schema = ref<DatabaseSchema>(createDatabaseSchema({ name: 'demo_db' }))

const onChange = (_next: DatabaseSchema) => {
  // 任意编辑后同步；也可只依赖 v-model
}

const persist = () => {
  const snapshot = designerRef.value?.getSchema()
  // 持久化 snapshot 到后端…
}

const reload = (fromServer: DatabaseSchema) => {
  designerRef.value?.setSchema(fromServer)
}
</script>

<style scoped>
.schema-designer-playground {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
</style>
```

::: tip 容器高度
根节点 `absolute inset-0`，父级必须有明确高度。
:::

### Props / Events

| 项 | 说明 |
|------|------|
| `modelValue` | 可选；初始 / 外部同步的 `DatabaseSchema` |
| `update:modelValue` | 编辑后抛出深拷贝（配合 `v-model`） |
| `change` | 与 `update:modelValue` 同内容，便于非 v-model |

外部修改 `modelValue` 会 clone 回填画布；内部每次提交也会向外 emit。本组件**无服务端保存**，持久化由宿主在 `change` / `getSchema` 时完成。

### defineExpose

| 方法 | 说明 |
|------|------|
| `getSchema()` | 当前 schema 深拷贝 |
| `setSchema(next)` | 整体替换并清空选中态 |
| `exportJson()` | 触发浏览器下载 JSON（同工具栏「导出」） |

## 界面总览

```
┌──────────────────────────────────────────────────────────────┐
│ [添加表] [清空] [复制 JSON] [导出 JSON]     操作提示文案…      │
├────┬───────────────┬─────────────────────────────────────────┤
│轨  │ 库信息/SQL    │ Vue Flow：表节点 + 关联边 + MiniMap      │
│道  │               │ 选中后浮层：表配置 / 关联配置            │
└────┴───────────────┴─────────────────────────────────────────┘
```

工具栏旁提示大意：**拖拽字段圆点连线创建关联；拖动关联线端点可改接字段；悬停关联线可点垃圾桶删除。**

## 工具栏

| 操作 | 行为 | 禁用 / 确认 |
|------|------|-------------|
| **添加表** | `createSchemaTable`：默认名 `table` / `table_1`…，自带 `id` BIGINT 主键自增；并选中新表 | — |
| **清空** | 删除全部表与关联，**保留**库名 / 注释 / `queries` | 无表时禁用；确认框标题「清空画布」，文案「将删除全部表与关联，是否继续？」，确认「清空」 |
| **复制 JSON** | `copySchemaJson` 写剪贴板 | 无表时禁用；失败 `alert('复制失败，请检查浏览器剪贴板权限')` |
| **导出 JSON** | 下载 `{库名}.json` | 无表时禁用 |

## 左侧轨道

| 轨道 | 面板标题 | 内容 |
|------|----------|------|
| 库信息（默认） | 数据库 | 库名、注释、方言只读、统计 |
| SQL 查询 | SQL 查询 | `queries[]` 列表与表单 |

再点同一轨可关闭侧栏。

### 库信息字段

| 字段 | 说明 |
|------|------|
| 库名 | 最长 63，经 `clampIdentifier`；默认脚手架常为 `untitled_db` |
| 注释 | 可选 |
| 方言 | **disabled**，固定展示「PostgreSQL」 |
| 统计 | 表数量 / 关联数量 / SQL 查询数量 |

### SQL 查询面板

本版只做**配置存档**（不连真实库执行）。写入 `schema.queries`。

| 操作 | 说明 |
|------|------|
| 添加 | 默认名 `query_1`…；表单：名称（必填）、说明、SQL |
| 编辑 / 复制新增 / 删除 | 列表项操作；复制名带 `_copy` |
| SQL 编辑 | `GrowCodeEditor`，`default-language="sql"`，不可切语言 |
| 提示 | 名称空 → warning「请输入查询名称」；成功 toast「添加成功 / 修改成功 / 已删除」 |

执行库展示为当前 `schema.name`（仅提示用）。数据准备消费的是**已发布表结构**，不会自动跑这里的 SQL。

## 浮层与抽屉

### 表配置（选中表后）

标题类似「表 · {name}」。

| 区域 | 字段 |
|------|------|
| 表 | 表名（最长 63）、注释 |
| 每列 | 名称、类型（`SCHEMA_COLUMN_TYPE_OPTIONS`）、默认值「可空」、注释 |
| 类型相关 | `VARCHAR`/`CHAR` → 长度（常见默认 255）；`NUMERIC` → 精度（如 10）+ 小数位（如 2） |
| 约束 | 主键、自增 (IDENTITY)、非空、唯一、索引 |

规则要点：

- 设为主键：强制非空，全表仅一个主键；常建议同时开自增  
- 删除被关联占用的字段：确认「该字段已被关联使用…」，确认后同步删关联  
- 删除整表：确认「确定删除表「x」及其相关关联吗？」；若有 N:N，可能连带删中间表  

### 关联配置（选中边后）

| 字段 | 说明 |
|------|------|
| 关联类型 | 1:1 / 1:N / N:N；**N:N 时类型不可改** |
| 源 / 目标 | 表与字段只读展示；N:N 另有中间表信息 |
| 删除时 / 更新时 | CASCADE / SET NULL / RESTRICT / NO ACTION |

### 创建关联抽屉（连线后）

| 字段 | 默认 |
|------|------|
| 类型 | `one-to-many`（1:N） |
| onDelete | `RESTRICT` |
| onUpdate | `CASCADE` |

说明：

- **1:1 / 1:N**：连线语义为「起点 = 被引用侧（通常 PK），终点 = 外键侧」；若终点表连到源表主键，可自动补 FK 列，命名常为 `{sourceTable}_id`  
- **N:N**：自动生成 `isJunction` 中间表（节点上有「中间表」标识）  

详见 [表关联](/schema-designer/relations)。

## 画布交互

| 操作 | 行为 |
|------|------|
| 拖拽表节点 | 写入 `table.position` |
| 点击表 | 选中 + 打开表配置浮层 |
| 字段左右圆点拖线 | 打开创建关联抽屉；禁止自连 |
| 点击关联线 | 选中 + 打开关联配置 |
| 拖动边端点改接 | 非 N:N 可改接字段；N:N / 中间表相关边有限制 |
| 悬停边 → 垃圾桶 | 删除关联（有确认）；N:N 可一并删中间表 |
| **Delete / Backspace** | 选中**关联**时删除（输入框内不触发）；**无二次确认** |
| Controls / MiniMap | 缩放约 0.2–1.25、平移、鸟瞰 |
| Vue Flow 删除键 | `delete-key-code` 含 Backspace、Delete |

::: tip 连线方向
务必记住：**起点是被引用的主键侧，终点是外键侧**。方向反了会导致自动建 FK 的行为不符合预期。
:::

## 工厂与工具函数

```ts
import {
  createDatabaseSchema,
  createSchemaTable,
  createSchemaColumn,
  createSchemaRelation,
  exportSchemaJson,
  downloadSchemaJson,
  copySchemaJson,
  SCHEMA_COLUMN_TYPE_OPTIONS,
  RELATION_TYPE_OPTIONS,
  clampIdentifier,
  MAX_DATABASE_NAME_LENGTH, // 63
} from '@grow-admin-rock/schema-designer'
```

| 函数 | 说明 |
|------|------|
| `createDatabaseSchema` | `version: 1`，`dialect: 'postgresql'`，空 tables/relations |
| `createSchemaTable` | 默认带 `id` 主键列 |
| `createSchemaColumn` | 默认 `VARCHAR(255)`、可空 |
| `exportSchemaJson` | 规范化后的 JSON 字符串 |
| `clampIdentifier` | 截断标识符至最大长度 |

## 持久化建议

```ts
// 保存
await api.saveSchema(designerRef.value!.getSchema())

// 回填
designerRef.value!.setSchema(await api.loadSchema(id))
// 或
schema.value = await api.loadSchema(id) // 依赖 v-model 回填
```

导出给数据准备 / 后端时，保持 `tables` / `relations` / `queries` 完整；数据准备侧类型为对齐的 `DataPrepDatabaseSchema`，**不会**从 schema-designer 运行时 import Vue。

## 相关文档

- [数据模型](/schema-designer/schema)
- [表关联](/schema-designer/relations)
- [数据准备](/data-prep/)
- [低代码设计器](/guide/designers/)
