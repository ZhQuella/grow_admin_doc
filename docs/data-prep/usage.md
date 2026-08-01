---
title: 数据准备 · 基础用法
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

1. 在 workspace 依赖中引入 `@grow-admin-rock/data-prep` 与 `@grow-admin-cornerstone/apps-designer`
2. 在 IOC / Library 装配中注册 `apps-designer`
3. 由 `apps-home` 的动态路由合并菜单项（菜单标题：**数据准备**）
4. 开发环境加载 Mock：`sample/mock/dataPrep.ts`（路径前缀 `/mock/data-prep/*`）

具体装配方式见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)。

## 在页面中使用 GrowDataPrepDesigner

```vue
<template>
  <div class="data-prep-playground">
    <GrowDataPrepDesigner v-model="dataset" @save="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  GrowDataPrepDesigner,
  createDataPrepDataset,
  ensureDemoDataset,
  type DataPrepDataset,
} from '@grow-admin-rock/data-prep'

const seeded = ensureDemoDataset()

const dataset = ref<DataPrepDataset>(
  seeded[0] ||
    createDataPrepDataset({
      name: '未命名数据集',
      schemaRefs: [{ schemaId: 'schema_demo_sales', schemaName: 'demo_sales' }],
    }),
)

const onSaved = (value: DataPrepDataset) => {
  dataset.value = value
}
</script>

<style scoped>
.data-prep-playground {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
</style>
```

::: tip 容器高度
设计器铺满父级。宿主页面需给外层容器明确高度（如 `height: 100%` / `min-height: 0`），演示页可参考 `data-prep-playground.vue`。
:::

### Props / Events

| 项 | 说明 |
|------|------|
| `modelValue` | 可选；传入则作为初始 / 外部同步的 `DataPrepDataset` |
| `update:modelValue` | 编辑后抛出深拷贝后的 dataset（配合 `v-model`） |
| `save` | 点击「保存」且接口 / 本地存储成功后抛出 |

## 推荐操作流程

1. **添加表**：工具栏打开抽屉 → 按建模 Tab 选表 → 可连续添加；支持跨建模混加
2. **配置关联**（多表必需）：右侧「表关联」添加，或画布拖线；配置 Join 类型与关联字段
3. **标记字段**：表节点上点「维 / 度」切换角色；侧栏「字段」可改显示名与聚合
4. **预览**：工具栏「预览」打开底部抽屉查看聚合结果
5. **保存**：写入 Mock 会话存储 + `localStorage`（key 见数据模型文档）

## Demo Schema（Mock）

| Schema id | 说明 |
|------|------|
| `schema_demo_sales` | 销售库：`orders` / `customers` |
| `schema_demo_region` | 区域库：`regions`（含同名列 `region`，便于跨库 Join） |

`ensureDemoDataset()` 会在本地尚无数据时写入一份「订单区域汇总」示例 Dataset，便于预览查询演示。

## 相关文档

- [数据模型](/data-prep/schema)
- [表关联](/data-prep/joins)
- [Mock 数据](/guide/development/mock)
- [报表设计器 · 数据绑定](/report-designer/data-binding) — 报表经页面 state 取数
