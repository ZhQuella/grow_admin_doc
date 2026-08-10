---
title: 数据准备 · 基础用法
lang: zh-CN
---

# 基础用法

本文说明如何在宿主中挂载 `GrowDataPrepDesigner`，以及界面上的完整操作细节（工具栏、左轨、画布、预览 / 保存）。数据模型与公式见专页。

## 演示模块接入

演示包 `@grow-admin-cornerstone/apps-designer` 同时提供四个设计器 playground。数据准备菜单标题为 **数据准备**，路由 path：`data-prep-playground`。

宿主（如 `sample`）需：

1. workspace 依赖 `@grow-admin-rock/data-prep` 与 `@grow-admin-cornerstone/apps-designer`
2. IOC 中 `.use(appsDesignerLib)`
3. `apps-home` 动态路由合并菜单
4. 开发环境启用 Mock：`sample/mock/dataPrep.ts`

Mock 路径（相对 mock 前缀，常见为 `/mock`）：

| 方法 | Path | 用途 |
|------|------|------|
| GET | `/data-prep/schemas` | 可选建模列表 |
| GET | `/data-prep/schema-bundle?id=` | 单库结构 + 演示行数据 |
| GET / POST | `/data-prep/datasets` | 列表 / 保存 Dataset |
| DELETE | `/data-prep/dataset?id=` | 删除 |
| POST | `/data-prep/query` | 按 Dataset 查询（内部可走 `queryDatasetLocal`） |

装配细节见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)、[低代码设计器](/guide/designers/)。

## 在页面中使用

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
  // 可在此同步到后端或 Pinia
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
设计器根节点为 `absolute inset-0`，必须由父级提供确定高度（演示页常见：`height: 100%` + 布局 `min-height: 0`）。高度不足时画布与侧栏会出现裁切。
:::

### Props / Events

| 项 | 类型 | 说明 |
|------|------|------|
| `modelValue` | `DataPrepDataset \| null`（可选） | 外部受控；不传时内部会建默认数据集（演示默认名可能为「销售区域汇总」） |
| `update:modelValue` | `(DataPrepDataset) => void` | 任意编辑后抛出**深拷贝** |
| `save` | `(DataPrepDataset) => void` | 仅在点击「保存」且本地 / Mock 写入成功后抛出 |

组件**没有** `defineExpose`。需要快照时用 `v-model` 或监听 `update:modelValue`。

外部改写 `modelValue` 时，设计器会按新对象回填画布（注意保持 `id` 稳定，避免无谓重建）。

## 界面总览

```
┌──────────────────────────────────────────────────────────────┐
│ [数据集名称________]              [预览数据] [保存]            │
├────┬───────────────┬─────────────────────────────────────────┤
│轨  │ 侧栏 320px     │ Vue Flow 画布                            │
│道  │ 添加表/度量/…  │ SourceTableNode + JoinEdge + MiniMap    │
└────┴───────────────┴─────────────────────────────────────────┘
         └─ 编辑度量时另开配置浮层；预览为底部 Drawer
```

## 工具栏

| 控件 | 行为 | 禁用 / 提示 |
|------|------|-------------|
| 数据集名称 | 绑定 `dataset.name`，placeholder「数据集名称」 | — |
| **预览数据** | 打开底部「数据预览」抽屉；本地 `queryDatasetLocal(snapshot, tableRows, { limit: 100 })` | **`outputFields` 为空时禁用**。有字段时 Tip：「按「数据输出」已选字段预览结果」；无字段时 Tip：「请先在左侧「数据输出」中勾选至少一个字段后再预览」 |
| **保存** | 调用 `saveDataPrepDataset`（优先 Mock，失败可回退 localStorage）→ `emit('save')` | loading 时显示加载态；当前无成功 toast，失败多打 `console.error` |

::: warning 预览门槛
维度 / 度量配置好了也**不能**直接预览：必须在「数据输出」勾选至少一列。这是最常见的卡住点。
:::

## 左侧轨道

点击切换面板，**再点同一项关闭**。默认打开「维度 / 度量」。

| 轨道 | 说明 | 特殊状态 |
|------|------|----------|
| 添加表 | 从已发布建模选表加入画布 | 尚无建模列表时禁用（半透明 + 不可点） |
| 维度 / 度量 | 管理 `metricConfigs` | — |
| 数据输出 | 管理 `outputFields` 勾选与排序 | — |
| 数据集信息 | 名称、说明、统计摘要 | — |

### 添加表

1. 顶部搜索框：placeholder「搜索表名 / 注释」，按名称 / 注释过滤  
2. 按建模分组展示；**中间表 `isJunction`、已添加的表**不会出现在可选列表  
3. 行内「添加」：写入 `sources`，更新 `schemaRefs`；**第一张表自动设为 `primarySourceId`**  
4. 空态文案：  
   - 「暂无可用建模」  
   - 「无匹配的表」  
   - 「该建模下的表已全部添加」

跨建模混加是支持的（例如销售库 `orders` + 区域库 `regions`）。

### 维度 / 度量

- 列表空态：「暂无维度 / 度量」「点击右上角「添加」创建第一条配置」  
- 「添加 / 编辑」打开侧扩展配置面板，标题为「添加维度 / 度量」或「编辑维度 / 度量」  
- **保存校验**（不通过则静默不关面板，无 toast）：  
  - 至少一个维度字段  
  - 度量名称非空  
  - 公式非空  
  - `outputKey` 经 `ensureUniqueMeasureOutputKey` 保证唯一  

配置面板字段：

| 区域 | UI | 说明 |
|------|-----|------|
| 维度 | 多行 Select「请选择字段」；可「添加」多行 | 值为 `alias.column`；顺序即分组顺序 |
| 度量·名称 | Input「请输入」 | 默认「未命名度量」 |
| 度量·输出 Key | Input「请输入」 | 默认由名称生成标识；写入结果列名 |
| 度量·公式 | 点击「点击编辑公式」打开公式对话框 | 见 [公式度量](/data-prep/formulas) |

删除配置会同步从 `outputFields` 中剔除对应度量 key（实现侧会 prune）。

### 数据输出

- 说明文案大意：勾选要输出的字段，并在已选区拖拽调整列顺序  
- 分区通常包括：  
  - **明细字段**：按表折叠，键为 `alias.column`  
  - **度量字段**：键为各配置的 `outputKey`  
  - **已选字段**：可拖拽排序，即最终 `outputFields`  
- 空态：「请先添加表或配置度量」  

预览与 `queryDatasetLocal` **只输出** `outputFields` 中的列；未勾选的维度 / 度量不会出现在结果里。

### 数据集信息

| 字段 | 说明 |
|------|------|
| 名称 | 与工具栏同源 |
| 说明 | textarea |
| 只读摘要 | 建模数、来源表数、Join 数、配置数、输出字段数 |

## 画布交互

| 操作 | 行为 |
|------|------|
| 拖拽表节点 | 更新 `sources[].position` |
| 节点间连线 | 打开 Join 抽屉；左 target / 右 source；**禁止自连** |
| 同一对表再连 | 合并为一条 Join（覆盖更新，不重复） |
| 点击边 / 边标签 | 编辑该 Join |
| 边标签旁删除 | 直接删除 Join（无二次确认） |
| 设为主表 | 节点上操作；当前主表按钮为「当前主表」且禁用；Popover 确认变更 |
| 删除表 | 移除节点及相关 joins；清理引用该 alias 的维度 / 公式；**无确认框** |
| 缩放 | Controls；约 0.3–1.4；带 MiniMap |
| 点击空白 | 取消选中源表 |

::: info 无删除快捷键
数据准备画布**不响应** Delete / Backspace（与建模、页面设计器不同）。删表 / 删边请用界面按钮。
:::

### Join 抽屉字段

| 字段 | 说明 |
|------|------|
| 左表 / 右表 | 展示 `alias（tableName）`；右表选项排除左表 |
| Join 类型 | INNER / LEFT / RIGHT，默认 INNER |
| 条件关系 | 多组条件时出现：并 (`and`) / 或 (`or`) |
| 关联字段 | 多组左 / 右**物理列名**（不含 alias）；至少一组 |
| 确定 | 左右表不同且每组字段齐全才可点 |

详见 [表关联](/data-prep/joins)。

## 预览抽屉

| 状态 | 文案 / 行为 |
|------|-------------|
| 加载中 | 「加载中…」 |
| 成功有数据 | 表格展示；部分比率类结果以百分比格式化 |
| 无列 | 「暂无输出列…」类提示（检查数据输出勾选） |
| 无行 | 「暂无数据行」 |
| 失败 | `error.message` 或「预览失败」 |

预览默认 `limit: 100`。

## 推荐操作流程（逐步）

1. **添加表**：左轨「添加表」→ 选建模下的表连续添加；确认主表  
2. **多表则配 Join**：画布拖线 → 选类型与等值字段 → 确定  
3. **配度量**：左轨「维度 / 度量」→ 添加 → 选维度、填名称 / Key、编辑公式 → 保存  
4. **勾选输出**：左轨「数据输出」勾选维度列与度量 Key，并排好顺序  
5. **预览数据**：工具栏预览，确认列与行  
6. **保存**：写入 Mock + `localStorage`（key 见 [数据模型](/data-prep/schema)）

## Demo 数据

| Schema id | 说明 |
|------|------|
| `schema_demo_sales` | 销售库：`orders` / `customers` |
| `schema_demo_region` | 区域库：`regions`（含同名列 `region`，便于跨库 Join） |

`ensureDemoDataset()`：本地尚无数据集时写入「订单区域汇总」（按区域 `SUM` 金额与数量）。若预览按钮仍禁用，打开「数据输出」勾选对应字段。

## 与页面 / 报表对接（详细）

数据准备**不**向图表暴露「选 Dataset」控件。推荐链路：

```text
保存 DataPrepDataset
    → 展示侧 apiOutlined 请求 POST …/data-prep/query
    → fit / didFetch 把 { columns, rows } 写入 state
    → 页面绑定 props / 报表 dataBinding 读 state.xxx
```

宿主也可直接调用：

```ts
import {
  queryDataPrepDataset,
  queryDatasetLocal,
  toCartesianSeriesPayload,
} from '@grow-admin-rock/data-prep'

// HTTP（走 Mock / 真实后端）
const result = await queryDataPrepDataset({ datasetId: 'dataset_demo_orders_region' })

// 纯前端（自备 tableRows）
const local = queryDatasetLocal(dataset, tableRows, { limit: 200 })

// 整理成笛卡尔图轴 / 系列，再赋给 state
const payload = toCartesianSeriesPayload(local, 'orders.region', ['amount'])
```

页面侧绑定示例思路：

- 数据源或计算属性：`state.chartCategories = rows.map(r => r['orders.region'])`  
- 报表 `xAxisData`：`state.chartCategories`；`seriesData[0]`：对应数值数组  

完整协同说明见 [协同工作](/guide/designers/collaboration)。

## 相关文档

- [数据模型](/data-prep/schema)
- [公式度量](/data-prep/formulas)
- [表关联](/data-prep/joins)
- [报表 · 数据绑定](/report-designer/data-binding)
- [数据库建模](/schema-designer/)
- [Mock 数据](/guide/development/mock)
