---
title: 低代码设计器 · 协同工作
lang: zh-CN
---

# 协同工作

低代码各模块**不是**绑死成一个单体编辑器，而是靠 **约定好的数据产物 + 运行时 `state` 总线 + 共享代码能力** 协作。设计时各自产出 JSON；运行时由页面 / 报表统一拉数、绑定、渲染。

## 1. 分工：谁负责什么

| 环节 | 模块 | 输入 | 输出 | 不做什么 |
|------|------|------|------|----------|
| 物理模型 | 数据库建模 | 人工建表 | `DatabaseSchema` | 不算业务指标、不画页面 |
| 分析模型 | 数据准备 | 已发布建模元数据 | `DataPrepDataset` + 查询结果表 | 不直接绑图表 / 组件 |
| ETL 管道 | 数据清洗 | 建模表 / Dataset 表或输出 | `CleanFlow`（声明式，调用时执行） | 设计期可本地预览；不直绑图表 / 不写 `state` |
| 业务流转 | 流程引擎 | 人工规则 / 表单 key（规划） | `ProcessFlow`（声明式，设计期） | 无运行时引擎；不替代数据清洗 |
| 页面展示 | 页面设计器 | 物料 + `state` | `DesignerSchema` | 不维护表结构 |
| 报表展示 | 报表设计器 | 网格 + 页面级数据 | `ReportSchema` | **不直选** Dataset |
| 脚本能力 | 代码沙箱 | 表达式 / SFC | 编辑与预览能力 | 不单独存业务 schema |

一句话：**建模管「有什么表」，数据准备管「怎么算」，数据清洗管「怎么洗」，流程引擎管「怎么批」，页面 / 报表管「怎么看」，沙箱管「怎么写逻辑」。**

## 2. 衔接点：靠什么串起来

```text
┌─────────────────┐     发布元数据      ┌─────────────────┐
│ 数据库建模       │ ───────────────► │ 数据准备         │
│ DatabaseSchema  │   (schemas API)   │ DataPrepDataset │
└────────┬────────┘                   └────────┬────────┘
         │                                     │ POST …/query
         │          ┌──────────────────────────┤ columns + rows
         │          │                          ▼
         │          │               ┌─────────────────────┐
         ▼          ▼               │ 页面 / 报表运行时    │
┌─────────────────┐                 │ buildRuntimeState   │
│ 数据清洗         │  调用时执行     │   → state.xxx       │
│ CleanFlow       │ ─(规划中)─────► └──────────┬──────────┘
│ (建模表/Dataset)│   report/page/api          │
└─────────────────┘                 ┌──────────┼──────────┐
                                    ▼          ▼          ▼
                             组件 props    图表绑定    事件/计算
```

| 衔接 | 机制 | 说明 |
|------|------|------|
| 建模 → 数据准备 | 元数据接口 | 数据准备「添加表」拉取已发布 schema（演示：`GET …/data-prep/schemas`、`schema-bundle`） |
| 建模 / 数据准备 → 数据清洗 | 源节点引用 | 「数据表」可选 `schema-table` / `dataset-table` / `dataset-output`（当前为 demo / Mock 下拉） |
| 数据准备 → 展示 | **查询结果进 `state`** | 页面 / 报表用「数据请求」调 `POST …/data-prep/query`（或本地 `queryDatasetLocal`），在 `fit` / `didFetch` 里写入 `state`；也可用「属性计算」整理成类目 / 系列数组 |
| 数据清洗 → 展示 | **调用时执行（规划）** | 输出节点 `target`: report / lowcode / api；消费者绑定后续对接。当前演示主路径仍是数据准备 → `state` |
| 流程引擎 → 页面 | **formKey / 运行时（规划）** | 人工节点可配 `formKey`；执行引擎与待办通道未接通。当前仅保存 `ProcessFlow` 定义 |
| 页面 ↔ 报表 | **同一套页面级数据模型** | 二者共用 `dataSource` / `apiOutlined` / `computedProps` 与 `buildRuntimeState`；报表区块再用 `dataBinding` 从 `state` 取数 |
| 各设计器 → 沙箱 | **内嵌编辑器** | 事件脚本、变量 / 函数绑定、公式编辑、SQL 文本等，底层是 `GrowCodeEditor` 等，不各自造轮子 |

## 3. 运行时约定：统一的 `state`

页面设计器与报表设计器在运行时（预览 / `GrowRenderer` / `GrowReportRenderer`）走同一套路：

1. `dataSource` + `computedProps` → `buildRuntimeState` → 得到 `state`
2. `apiOutlined` 按生命周期拉数，结果写回 `state`（或经处理器改写）
3. 展示侧只认 `state.xxx`：
   - 页面：组件属性 `propBindModes: 'bind'` → 如 `state.title`
   - 报表：区块 `dataBinding.xAxisData` / `seriesData[i]` → 如 `state.regions`、`state.amounts`

因此 **数据准备与图表之间没有专用「Dataset 选择器」**：中间必须经过「查询 → 写入 state → 绑定」这一步。好处是页面和报表操作习惯一致，也方便用同一接口服务多种展示。

可选适配：包内 `toCartesianSeriesPayload(result, categoryField, seriesFields)` 可把查询结果整理成笛卡尔轴 / 系列，再赋给 `state`，减轻绑定负担。

## 4. 设计时复用：报表站在页面肩膀上

报表设计器**直接复用** `@grow-admin-rock/designer` 的页面级面板与运行时（数据源、计算属性、数据请求、页面事件等），只在画布与右侧换成「网格区块 + 图表配置 + 数据绑定」。

这意味着：

- 同一份「怎么拿数」的配置思路，页面和报表通用
- 报表多出来的只有：`layout`（网格）与 `chartConfig` / `dataBinding`（怎么画）

## 5. 端到端示例（演示环境可照做）

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

可选：**数据清洗** playground 中编排源表 → 过滤 / 拆分 → 输出流，用本地管道预览结果并保存 `CleanFlow` 快照；与图表的正式对接待生产「调用时执行」与消费者绑定落地后启用。详见 [数据清洗](/data-clean/)。

## 6. 协作边界（避免误解）

| 容易误解 | 实际约定 |
|----------|----------|
| 报表里直接选 Dataset | 否；经 `state` 间接消费 |
| 数据准备自动继承建模的外键当 Join | 否；`joins` 需在数据准备里手动配 |
| 建模里的 SQL 查询会自动被数据准备执行 | 否；`queries` 本版为建模侧存档；分析查询走 Dataset |
| 数据清洗预览 = 生产调用结果 | 否；当前为 `runCleanFlowLocal` + Demo/Mock 表的设计期管道，未写入页面/报表 `state` |
| 数据清洗已替代数据准备 | 否；二者互补（分析查询 vs ETL 流） |
| 流程引擎 = 数据清洗 | 否；流程管业务审批/编排，清洗管数据管道 |
| 流程引擎已可跑实例 | 否；当前仅设计期编排，无运行时引擎 |
| 各设计器共用一份总 schema | 否；各自产物独立持久化，靠接口与 `state` 协作 |
| 代码沙箱是「画布设计器」 | 否；是共享编辑 / 预览基础设施 |

## 7. 推荐使用顺序

1. **建模**：在「设计器 → 数据库建模」建表、字段与关联，导出 / 保存 schema  
2. **数据准备**：在「设计器 → 数据准备」选表、连线 Join、配置维度 / 公式度量与输出字段，预览并保存 Dataset  
3. **数据清洗**（可选）：在「设计器 → 数据清洗」拖拽编排清洗流，配置过滤 / 分支 / 拆分等，保存 `CleanFlow`  
4. **流程引擎**（可选）：在「设计器 → 流程引擎」编排审批 / 事件 / 系统节点，保存 `ProcessFlow`  
5. **展示**：
   - 页面：配置数据源 / 数据请求，把查询结果写入 `state`，组件属性绑定 `state.xxx`  
   - 报表：同样配置页面级数据，再在区块「数据绑定」中把 `state.xxx` 注入轴 / 系列  
6. **脚本**：事件 / 计算属性 / 函数绑定需要时再写（基于代码沙箱）

深入阅读：[数据准备 · 对接](/data-prep/usage#与页面--报表对接)、[数据清洗 · 对接](/data-clean/usage#与页面--报表对接规划)、[流程引擎](/process-engine/)、[报表 · 数据绑定](/report-designer/data-binding)、[页面 · 变量绑定](/page-designer/variable-bind)、[页面 · 事件](/page-designer/events)。
