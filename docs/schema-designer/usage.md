---
title: 数据库建模 · 基础用法
lang: zh-CN
---

# 基础用法

## 演示模块接入

演示包 `@grow-admin-cornerstone/apps-designer` 同时提供：

- **低代码设计器** → `GrowDesigner`
- **报表设计器** → `GrowReportDesigner`
- **数据库建模** → `GrowSchemaDesigner`
- **数据准备** → `GrowDataPrepDesigner`

宿主（如 `sample`）需：

1. 在 workspace 依赖中引入 `@grow-admin-cornerstone/apps-designer`
2. 在 IOC / Library 装配中注册该模块
3. 由 `apps-home` 的动态路由合并菜单项

具体装配方式见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)。

## 在页面中使用 GrowSchemaDesigner

```vue
<template>
  <GrowSchemaDesigner
    ref="designerRef"
    v-model="schema"
    @change="onChange"
  />
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

const onChange = (next: DatabaseSchema) => {
  // 任意编辑后同步；也可只依赖 v-model
}

const save = () => {
  const snapshot = designerRef.value?.getSchema()
  // 持久化 snapshot…
}
</script>
```

::: tip 容器高度
设计器使用 `absolute inset-0` 铺满父级。宿主页面需给外层容器明确高度（如 `height: 100%` / `min-height: 0`），演示页可参考 `schema-designer-playground.vue`。
:::

### Props / Events

| 项 | 说明 |
|------|------|
| `modelValue` | 可选；传入则作为初始 / 外部同步的 `DatabaseSchema` |
| `update:modelValue` | 编辑后抛出深拷贝后的 schema（配合 `v-model`） |
| `change` | 与 `update:modelValue` 同内容，便于非 v-model 场景 |

外部修改 `modelValue` 时会 `clone` 回填画布；设计器内部每次提交也会向外 emit。

### defineExpose

| 方法 | 说明 |
|------|------|
| `getSchema()` | 返回当前 schema 深拷贝 |
| `setSchema(next)` | 用外部 schema 整体替换并清空选中态 |
| `exportJson()` | 触发浏览器下载 JSON 文件 |

## 工具栏操作

| 操作 | 说明 |
|------|------|
| 添加表 | 新建表（默认名 `table` / `table_1`…，自带 `id` 主键列） |
| 清空 | 删除全部表与关联（保留库名 / 注释） |
| 复制 JSON | 写入剪贴板（需浏览器权限） |
| 导出 JSON | 下载 `{库名}.json` |

## 画布操作

| 操作 | 说明 |
|------|------|
| 拖拽表节点 | 移动位置，坐标写入 `table.position` |
| 点击表 | 选中并打开「表配置」面板 |
| 字段圆点连线 | 打开创建关联抽屉（见 [表关联](/schema-designer/relations)） |
| 点击关联线 | 选中并打开「关联配置」面板 |
| 悬停关联线 → 垃圾桶 | 删除关联（N:N 会一并删中间表） |
| Delete / Backspace | 选中关联时可删除（输入框内不触发） |
| Controls / MiniMap | 缩放、平移、鸟瞰 |

## 左侧面板

| 轨道 | 说明 |
|------|------|
| 库信息 | 编辑 `name`、`comment`（标识符最长 64） |
| 表配置 | 需先选中表：表名 / 注释、字段列表与字段属性 |
| 关联配置 | 需先选中关联线：类型只读展示、可改 `onDelete` / `onUpdate` |

未选中表或关联时，对应面板会提示先在画布中选择。

### 表配置要点

- 字段类型来自 `SCHEMA_COLUMN_TYPE_OPTIONS`（VARCHAR / INTEGER / NUMERIC / JSONB 等）
- `VARCHAR` / `CHAR` 可配长度；`DECIMAL` 可配精度与小数位
- 设为主键时会取消其他列的主键，并将该列 `nullable` 置为 `false`
- 删除被关联使用的字段会提示，确认后同步移除相关关联

## 工厂与工具函数

```ts
import {
  createDatabaseSchema,
  createSchemaTable,
  createSchemaColumn,
  exportSchemaJson,
  SCHEMA_COLUMN_TYPE_OPTIONS,
  RELATION_TYPE_OPTIONS,
  clampIdentifier,
} from '@grow-admin-rock/schema-designer'
```

| 函数 | 说明 |
|------|------|
| `createDatabaseSchema` | 空库脚手架（`version: 1`，`dialect: 'postgresql'`） |
| `createSchemaTable` | 默认带 `id` 主键列 |
| `createSchemaColumn` | 默认 `VARCHAR(255)`、可空 |
| `exportSchemaJson` | 序列化为可持久化 JSON 字符串 |
| `clampIdentifier` | 截断表 / 字段 / 库名至最大长度 |

下载与复制由设计器工具栏完成；也可调用实例方法 `exportJson()`。

## 相关文档

- [数据模型](/schema-designer/schema)
- [表关联](/schema-designer/relations)
