---
title: 低代码设计器总览
lang: zh-CN
---

# 低代码设计器总览

Grow Admin 在 DesignRock 中提供一套可组合的低代码工具链：从 **物理建模** 到 **分析准备**，再到 **页面 / 报表展示**；**代码沙箱** 作为共享能力，被各设计器内嵌（事件脚本、公式、变量绑定等）。

演示入口统一由 `@grow-admin-cornerstone/apps-designer`（设计器菜单）与 `@grow-admin-cornerstone/apps-sandbox`（沙箱菜单）注册；宿主 `sample` 经 IOC 装配后，登录即可在侧栏打开。

## 工具链关系

```text
数据库建模 (schema-designer)
  → DatabaseSchema（表 / 字段 / 关联 / SQL 配置）
        ↓ 已发布元数据（Mock：/data-prep/schemas）
数据准备 (data-prep)
  → DataPrepDataset（选表、Join、公式度量、输出字段）
        ↓ 查询结果（Mock：POST /data-prep/query）写入页面 state
        ├─→ 页面设计器 (designer)     → DesignerSchema + GrowRenderer
        └─→ 报表设计器 (report-designer) → ReportSchema + GrowReportRenderer

代码沙箱 (code-sandbox)
  → 被上述设计器内嵌；亦可独立演示（apps-sandbox）
```

| 模块 | 包名 | 产物 | 文档 |
|------|------|------|------|
| [数据库建模](/schema-designer/) | `@grow-admin-rock/schema-designer` | `DatabaseSchema` | 表结构与关系 |
| [数据准备](/data-prep/) | `@grow-admin-rock/data-prep` | `DataPrepDataset` | Join + 公式度量 |
| [页面设计器](/page-designer/) | `@grow-admin-rock/designer` | `DesignerSchema` | 拖拽页面 |
| [报表设计器](/report-designer/) | `@grow-admin-rock/report-designer` | `ReportSchema` | 图表看板 |
| [代码沙箱](/code-sandbox/) | `@grow-admin-rock/code-sandbox` | SFC / 表达式编辑 | Monaco + 预览 |

## 它们如何协调工作？

五个模块**不是**绑死成一个单体编辑器，而是靠 **约定好的数据产物 + 运行时 `state` 总线 + 共享代码能力** 协作。设计时各自产出 JSON；运行时由页面 / 报表统一拉数、绑定、渲染。

### 1. 分工：谁负责什么

| 环节 | 模块 | 输入 | 输出 | 不做什么 |
|------|------|------|------|----------|
| 物理模型 | 数据库建模 | 人工建表 | `DatabaseSchema` | 不算业务指标、不画页面 |
| 分析模型 | 数据准备 | 已发布建模元数据 | `DataPrepDataset` + 查询结果表 | 不直接绑图表 / 组件 |
| 页面展示 | 页面设计器 | 物料 + `state` | `DesignerSchema` | 不维护表结构 |
| 报表展示 | 报表设计器 | 网格 + 页面级数据 | `ReportSchema` | **不直选** Dataset |
| 脚本能力 | 代码沙箱 | 表达式 / SFC | 编辑与预览能力 | 不单独存业务 schema |

一句话：**建模管「有什么表」，数据准备管「怎么算」，页面 / 报表管「怎么看」，沙箱管「怎么写逻辑」。**

### 2. 衔接点：靠什么串起来

```text
┌─────────────────┐     发布元数据      ┌─────────────────┐
│ 数据库建模       │ ───────────────► │ 数据准备         │
│ DatabaseSchema  │   (schemas API)   │ DataPrepDataset │
└─────────────────┘                   └────────┬────────┘
                                               │ POST …/query
                                               │ columns + rows
                                               ▼
                                    ┌─────────────────────┐
                                    │ 页面 / 报表运行时    │
                                    │ buildRuntimeState   │
                                    │   → state.xxx       │
                                    └──────────┬──────────┘
                         ┌─────────────────────┼─────────────────────┐
                         ▼                     ▼                     ▼
                  组件 props 绑定        图表 dataBinding       事件 / 计算属性
                  (propBindModes)      (xAxis / series…)      (code-sandbox)
```

| 衔接 | 机制 | 说明 |
|------|------|------|
| 建模 → 数据准备 | 元数据接口 | 数据准备「添加表」拉取已发布 schema（演示：`GET …/data-prep/schemas`、`schema-bundle`） |
| 数据准备 → 展示 | **查询结果进 `state`** | 页面 / 报表用「数据请求」调 `POST …/data-prep/query`（或本地 `queryDatasetLocal`），在 `fit` / `didFetch` 里写入 `state`；也可用「属性计算」整理成类目 / 系列数组 |
| 页面 ↔ 报表 | **同一套页面级数据模型** | 二者共用 `dataSource` / `apiOutlined` / `computedProps` 与 `buildRuntimeState`；报表区块再用 `dataBinding` 从 `state` 取数 |
| 各设计器 → 沙箱 | **内嵌编辑器** | 事件脚本、变量 / 函数绑定、公式编辑、SQL 文本等，底层是 `GrowCodeEditor` 等，不各自造轮子 |

### 3. 运行时约定：统一的 `state`

页面设计器与报表设计器在运行时（预览 / `GrowRenderer` / `GrowReportRenderer`）走同一套路：

1. `dataSource` + `computedProps` → `buildRuntimeState` → 得到 `state`
2. `apiOutlined` 按生命周期拉数，结果写回 `state`（或经处理器改写）
3. 展示侧只认 `state.xxx`：
   - 页面：组件属性 `propBindModes: 'bind'` → 如 `state.title`
   - 报表：区块 `dataBinding.xAxisData` / `seriesData[i]` → 如 `state.regions`、`state.amounts`

因此 **数据准备与图表之间没有专用「Dataset 选择器」**：中间必须经过「查询 → 写入 state → 绑定」这一步。好处是页面和报表操作习惯一致，也方便用同一接口服务多种展示。

可选适配：包内 `toCartesianSeriesPayload(result, categoryField, seriesFields)` 可把查询结果整理成笛卡尔轴 / 系列，再赋给 `state`，减轻绑定负担。

### 4. 设计时复用：报表站在页面肩膀上

报表设计器**直接复用** `@grow-admin-rock/designer` 的页面级面板与运行时（数据源、计算属性、数据请求、页面事件等），只在画布与右侧换成「网格区块 + 图表配置 + 数据绑定」。

这意味着：

- 同一份「怎么拿数」的配置思路，页面和报表通用
- 报表多出来的只有：`layout`（网格）与 `chartConfig` / `dataBinding`（怎么画）

### 5. 端到端示例（演示环境可照做）

目标：一张「按区域汇总订单金额」的柱状图。

1. **数据库建模**（可选，演示已有 Mock 建模）  
   建好 `orders` 等表，或直接用 Mock 的 `schema_demo_sales`。
2. **数据准备**  
   - 添加 `orders` 表  
   - 配置度量：维度 `orders.region`，公式 `SUM([orders.amount])`，`outputKey: amount`  
   - 在「数据输出」勾选维度与 `amount` → 预览 → 保存 Dataset  
3. **报表设计器**  
   - 左轨「数据请求」：请求 `…/data-prep/query`，body 带 `datasetId`（或完整 dataset）  
   - 在 `didFetch` / `fit` 中把 `rows` 转成类目数组与数值数组，写入例如 `state.regionNames`、`state.regionAmounts`（或先整表写入再「属性计算」拆列）  
   - 添加柱状图区块：`xAxisData` → `state.regionNames`，`seriesData[0]` → `state.regionAmounts`  
4. **预览**  
   运行时拉数 → 更新 `state` → 绑定注入 ECharts。

页面设计器同理：用表格 / 统计卡片绑定同一批 `state` 字段即可，不必再配一套 Dataset。

### 6. 协作边界（避免误解）

| 容易误解 | 实际约定 |
|----------|----------|
| 报表里直接选 Dataset | 否；经 `state` 间接消费 |
| 数据准备自动继承建模的外键当 Join | 否；`joins` 需在数据准备里手动配 |
| 建模里的 SQL 查询会自动被数据准备执行 | 否；`queries` 本版为建模侧存档；分析查询走 Dataset |
| 五个设计器共用一份总 schema | 否；各自产物独立持久化，靠接口与 `state` 协作 |
| 代码沙箱是第五个「画布设计器」 | 否；是共享编辑 / 预览基础设施 |

### 7. 推荐使用顺序

1. **建模**：在「设计器 → 数据库建模」建表、字段与关联，导出 / 保存 schema  
2. **数据准备**：在「设计器 → 数据准备」选表、连线 Join、配置维度 / 公式度量与输出字段，预览并保存 Dataset  
3. **展示**：
   - 页面：配置数据源 / 数据请求，把查询结果写入 `state`，组件属性绑定 `state.xxx`  
   - 报表：同样配置页面级数据，再在区块「数据绑定」中把 `state.xxx` 注入轴 / 系列  
4. **脚本**：事件 / 计算属性 / 函数绑定需要时再写（基于代码沙箱）

深入阅读：[数据准备 · 对接](/data-prep/usage#与页面--报表对接)、[报表 · 数据绑定](/report-designer/data-binding)、[页面 · 变量绑定](/page-designer/variable-bind)、[页面 · 事件](/page-designer/events)。

## 演示菜单对照

| 侧栏 | 路由 path（相对 Home） | 组件 |
|------|------------------------|------|
| 设计器 → 低代码设计器 | `designer-playground` | `GrowDesigner` |
| 设计器 → 报表设计器 | `report-designer-playground` | `GrowReportDesigner` |
| 设计器 → 数据库建模 | `schema-designer-playground` | `GrowSchemaDesigner` |
| 设计器 → 数据准备 | `data-prep-playground` | `GrowDataPrepDesigner` |
| 沙箱 → 沙箱工具 / 呈现沙箱 / 代码编辑器 | `sandbox-overview` 等 | `GrowCode*` |

## 接入要点（宿主）

1. workspace 依赖对应 `@grow-admin-rock/*` 包与 Cornerstone 演示模块
2. `sample/src/plugin/initIoc.ts` 中 `.use(appsDesignerLib)` / `.use(appsSandboxLib)`
3. Mock 菜单合并设计器 / 沙箱结构（见 `sample/mock/routers.ts`）
4. 数据准备另需启用 `sample/mock/dataPrep.ts`

详细装配见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)。

## 各设计器界面一览

### 页面设计器

左轨：组件库、查看数据、结构树、数据源、属性计算、数据监听、页面事件、数据请求；画布拖拽；右栏属性 / 样式 / 事件 / 高级。

### 报表设计器

左轨复用页面级数据面板；中部 24 列网格；右侧区块：基础信息 / 图表配置 / 数据绑定。

### 数据库建模

左轨：库信息、SQL 查询；画布 Vue Flow 表节点与关联边；选中后浮层配置表或关联。

### 数据准备

工具栏：数据集名称、预览、保存；左轨：添加表、维度 / 度量、数据输出、数据集信息；画布表节点与 Join 连线。

### 代码沙箱

`GrowCodeEditor` + `GrowCodeDeps` + `GrowCodeSandbox`，可三分屏或单独使用。

::: tip
下面各章按模块展开 API、Schema 与操作说明。若不熟悉整体关系，建议先读本页，再进入具体设计器。
:::
