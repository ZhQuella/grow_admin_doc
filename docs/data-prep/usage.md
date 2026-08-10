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
4. 开发环境加载 Mock：`sample/mock/dataPrep.ts`（路径前缀 `/mock/data-prep/*` 或项目约定的 `/data-prep/*`）

具体装配方式见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)、[低代码设计器总览](/guide/designers/)。

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
设计器使用 `absolute inset-0` 铺满父级。宿主页面需给外层容器明确高度（如 `height: 100%` / `min-height: 0`），演示页可参考 `data-prep-playground.vue`。
:::

### Props / Events

| 项 | 说明 |
|------|------|
| `modelValue` | 可选；传入则作为初始 / 外部同步的 `DataPrepDataset` |
| `update:modelValue` | 编辑后抛出深拷贝后的 dataset（配合 `v-model`） |
| `save` | 点击「保存」且接口 / 本地存储成功后抛出 |

## 推荐操作流程

1. **添加表**：左轨「添加表」→ 按建模分组选表添加；可跨建模混加；第一张表自动为主表（节点上可改）
2. **配置关联**（多表必需）：在两表字段 / 节点间拖线，打开 Join 抽屉，选类型与关联字段（见 [表关联](/data-prep/joins)）
3. **维度 / 度量**：左轨「维度 / 度量」→ 添加配置 → 选维度字段、写度量名称与公式（见 [公式度量](/data-prep/formulas)）
4. **数据输出**：左轨「数据输出」勾选要输出的明细列与度量 `outputKey`，并调整顺序
5. **预览**：工具栏「预览数据」（未配置 `outputFields` 时按钮禁用）
6. **保存**：写入 Mock + `localStorage`（key 见 [数据模型](/data-prep/schema)）

## 左侧轨道说明

| 轨道 | 说明 |
|------|------|
| 添加表 | 搜索并添加建模中的表到画布 |
| 维度 / 度量 | 管理 `metricConfigs` 列表；点编辑打开公式配置面板 |
| 数据输出 | 管理 `outputFields`（预览与查询投影） |
| 数据集信息 | 名称、描述，以及源表 / 关联 / 配置数量摘要 |

## Demo Schema（Mock）

| Schema id | 说明 |
|------|------|
| `schema_demo_sales` | 销售库：`orders` / `customers` |
| `schema_demo_region` | 区域库：`regions`（含同名列 `region`，便于跨库 Join） |

`ensureDemoDataset()` 会在本地尚无数据时写入一份「订单区域汇总」示例 Dataset（按区域 `SUM` 金额与数量）。首次预览前请确认「数据输出」已勾选相应字段。

## 与页面 / 报表对接

数据准备负责「怎么算」；展示侧（[页面设计器](/page-designer/)、[报表设计器](/report-designer/)）通过 `apiOutlined` / 计算属性把查询结果写入 `state`，再绑定组件或图表。

当前演示可用 Mock 查询接口（见 `sample/mock/dataPrep.ts`）。也可用包内：

- `queryDataPrepDataset` — HTTP 查询
- `queryDatasetLocal` — 纯前端引擎（Join + 公式聚合 + 按 `outputFields` 投影）
- `toCartesianSeriesPayload` — 将结果适配为报表笛卡尔轴 / 系列

## 相关文档

- [数据模型](/data-prep/schema)
- [公式度量](/data-prep/formulas)
- [表关联](/data-prep/joins)
- [Mock 数据](/guide/development/mock)
- [报表设计器 · 数据绑定](/report-designer/data-binding)
- [数据库建模](/schema-designer/)
- [低代码设计器总览](/guide/designers/)
