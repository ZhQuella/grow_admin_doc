---
title: 低代码设计器 · 演示与接入
lang: zh-CN
---

# 演示与接入

## 演示菜单对照

| 侧栏 | 路由 path（相对 Home） | 组件 |
|------|------------------------|------|
| 设计器 → 低代码设计器 | `designer-playground` | `GrowDesigner` |
| 设计器 → 报表设计器 | `report-designer-playground` | `GrowReportDesigner` |
| 设计器 → 数据库建模 | `schema-designer-playground` | `GrowSchemaDesigner` |
| 设计器 → 数据准备 | `data-prep-playground` | `GrowDataPrepDesigner` |
| 设计器 → 数据清洗 | `data-clean-playground` | `GrowDataCleanDesigner` |
| 设计器 → 流程引擎 | `process-engine-playground` | `GrowProcessDesigner` |
| 沙箱 → 沙箱工具 / 呈现沙箱 / 代码编辑器 | `sandbox-overview` 等 | `GrowCode*` |

## 接入要点（宿主）

1. workspace 依赖对应 `@grow-admin-rock/*` 包与 Cornerstone 演示模块  
2. `sample/src/plugin/initIoc.ts` 中 `.use(appsDesignerLib)` / `.use(appsSandboxLib)`  
3. Mock 菜单合并设计器 / 沙箱结构（见 `sample/mock/routers.ts`）  
4. 数据准备另需启用 `sample/mock/dataPrep.ts`  
5. 数据清洗另需启用 `sample/mock/dataClean.ts`（tables / table-rows / preview）；保存事件仍由宿主自行持久化  
6. 流程引擎当前**无**独立 Mock；保存事件由宿主自行持久化  

详细装配见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)。

## 各设计器界面与操作要点

### 页面设计器

| 区域 | 要点 |
|------|------|
| 工具栏 | 清空（无确认）、预览（Drawer + `GrowRenderer`） |
| 左轨 | 组件库、查看数据、结构树、数据源、属性计算、数据监听、页面事件、数据请求；可固定，未固定时点画布易关闭 |
| 画布 | 拖入 / 选中 / 复制；**Delete 删组件**；弹层用 Overlay 编辑 |
| 右栏 | 属性（含 bind/function）、样式、事件、高级（`refName`） |
| API | `GrowDesigner` 无 expose；运行用 `GrowRenderer` + `schema` |

详见 [页面设计器 · 基础用法](/page-designer/usage)。

### 报表设计器

| 区域 | 要点 |
|------|------|
| 工具栏 | 添加区块、清空（无确认）、预览（强制关 responsive） |
| 左轨 | 页面配置 + 复用页面设计器的数据源 / 计算属性 / 数据请求 / 页面事件 |
| 画布 | 24 列网格；悬停设置 / 复制 / 删除；**无 Delete 键** |
| 右栏 | 报表配置（换类型会清空视觉配置）、数据绑定、基础信息 |
| API | `getSchema` / `runtimeState` / `refreshApiOutlined`；无 schema 回填 |

详见 [报表设计器 · 基础用法](/report-designer/usage)。

### 数据库建模

| 区域 | 要点 |
|------|------|
| 工具栏 | 添加表、清空（有确认）、复制 / 导出 JSON（无表禁用） |
| 左轨 | 库信息、SQL 查询（仅存档） |
| 画布 | 字段圆点连线；**起点=PK 侧，终点=FK 侧**；Delete 删关联（无确认） |
| 浮层 | 表配置 / 关联配置；连线后创建关联抽屉 |

详见 [数据库建模 · 基础用法](/schema-designer/usage)。

### 数据准备

| 区域 | 要点 |
|------|------|
| 工具栏 | 名称、预览（**须先勾选输出字段**）、保存 |
| 左轨 | 添加表、维度/度量、数据输出、数据集信息 |
| 画布 | 连线配 Join；设主表；**无 Delete 键** |
| 对接 | 查询结果经页面 / 报表 `state` 消费，不直选 Dataset |

详见 [数据准备 · 基础用法](/data-prep/usage)。

### 数据清洗

| 区域 | 要点 |
|------|------|
| 工具栏 | 名称、草稿/已发布标签、预览（有选中 → 该节点；无选中 → 全流至输出）、保存 |
| 左栏 | 组件库五类算子，拖入画布 |
| 画布 | 右出左入连线；禁环；**Delete 删节点/边**；一对多 / 多对一；**仅一个输出节点** |
| 配置 | 选中后浮层配置（十五种节点均有表单） |
| 预览 | `runCleanFlowLocal` 本地管道（Demo / Mock 表，默认 50 行）；`getFlow` / `setFlow` 可受控 |

详见 [数据清洗 · 基础用法](/data-clean/usage)。

### 流程引擎

| 区域 | 要点 |
|------|------|
| 工具栏 | 名称、草稿/已发布标签、保存（**无预览**） |
| 左栏 | 六类节点：人工 / 事件 / 系统 / 状态机 / 决策 / 分支 |
| 画布 | **上入下出**；允许成环（回退/跳转）；Delete 删节点/边 |
| 配置 | 选中节点或连线后浮层配置（含人员指派、分支出口、`transitionKind`） |
| API | `getFlow` / `setFlow`；产物 `ProcessFlow` |

详见 [流程引擎 · 基础用法](/process-engine/usage)。

### 代码沙箱

| 组件 | 要点 |
|------|------|
| `GrowCodeEditor` | 多语言；可注入 globals；可禁切换语言 |
| `GrowCodeDeps` | npm / host 依赖；默认锁定 useRequest、state、router 等 |
| `GrowCodeSandbox` | 宿主内编译 Vue SFC 预览 |

各设计器内嵌编辑器时通常 `language-switchable=false` 并注入场景 globals。详见 [代码沙箱](/code-sandbox/)。

::: tip
不熟悉模块关系时，先读 [协同工作](/guide/designers/collaboration)，再进入各设计器「基础用法」。
:::
