---
title: 数据清洗 · 基础用法
lang: zh-CN
---

# 基础用法

本文说明如何在宿主中挂载 `GrowDataCleanDesigner`，以及界面上的完整操作细节（工具栏、组件库、画布、配置浮层、预览 / 保存）。数据模型与节点配置见专页。

## 演示模块接入

演示包 `@grow-admin-cornerstone/apps-designer` 在设计器菜单下提供 **数据清洗** playground。

| 项 | 值 |
|------|------|
| 菜单标题 | 数据清洗 |
| 路由 path | `data-clean-playground` |
| 路由 name | `DataCleanPlayground` |
| 页面组件 | `DataCleanPlaygroundPage` |

宿主（如 `sample`）需：

1. workspace 依赖 `@grow-admin-rock/data-clean` 与 `@grow-admin-cornerstone/apps-designer`
2. IOC 中 `.use(appsDesignerLib)`
3. `apps-home` 动态路由合并菜单
4. 启用 Mock：`sample/mock/dataClean.ts`（表清单 / 行数据 / 服务端预览）

### Mock 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/mock/data-clean/tables` | Demo 表清单（含列与行） |
| GET | `/mock/data-clean/table-rows?id=` | 单表行数据 |
| POST | `/mock/data-clean/preview` | body：`{ flow, targetNodeId?, toOutput?, limit? }`，内部调用 `runCleanFlowLocal` |

设计器挂载时会 `loadCleanTableRowsMap()`：优先拉 Mock 表；失败则回退包内 `demoTables`。保存仍向父组件抛出 `CleanFlow` 快照，**localStorage / 后端持久化由宿主自行处理**。

装配细节见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)、[低代码设计器](/guide/designers/)。

## 在页面中使用

```vue
<template>
  <div class="data-clean-playground">
    <GrowDataCleanDesigner v-model="flow" @save="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  GrowDataCleanDesigner,
  createCleanFlow,
  type CleanFlow,
} from '@grow-admin-rock/data-clean'

const flow = ref<CleanFlow>(
  createCleanFlow({
    name: '未命名清洗流',
  }),
)

const onSaved = (value: CleanFlow) => {
  flow.value = value
  // 可在此同步到后端或 Pinia
}
</script>

<style scoped>
.data-clean-playground {
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
| `modelValue` | `CleanFlow`（可选） | 外部受控；不传时内部创建默认流（名称「未命名清洗流」、`status: draft`） |
| `update:modelValue` | `(CleanFlow) => void` | 任意编辑后抛出**深拷贝**（含更新后的 `updatedAt`） |
| `change` | `(CleanFlow) => void` | 与 `update:modelValue` 同时抛出，便于只听变更 |
| `save` | `(CleanFlow) => void` | 仅在点击「保存」时抛出（同样是深拷贝） |

外部改写 `modelValue` 时，设计器会按新对象回填画布（注意保持 `id` 稳定，避免无谓重建）。

### defineExpose

| 方法 | 说明 |
|------|------|
| `getFlow()` | 返回当前流的深拷贝 |
| `setFlow(next)` | 用新流替换内部状态，清空选中与预览，并触发 `update:modelValue` / `change` |

```ts
const designerRef = ref<{
  getFlow: () => CleanFlow
  setFlow: (next: CleanFlow) => void
} | null>(null)

// 例如从后端拉回后再灌入
designerRef.value?.setFlow(loadedFlow)
```

## 界面总览

```
┌──────────────────────────────────────────────────────────────┐
│ [清洗流名称____] [草稿|已发布] 提示文案    [预览] [保存]       │
├────────┬─────────────────────────────────────────────────────┤
│组件库  │ Vue Flow + 浮层配置（选中节点时）                      │
│240px   │ CleanFlowNode + CleanFlowEdge；Controls（左下）       │
├────────┴─────────────────────────────────────────────────────┤
│ 底部预览：列 + 管道结果行；可显示 warnings / error             │
└──────────────────────────────────────────────────────────────┘
```

空画布时中央虚线提示：**从左侧组件库拖拽节点到此处开始编排**。

## 工具栏

| 控件 | 行为 | 禁用 / 提示 |
|------|------|-------------|
| 清洗流名称 | 绑定 `flow.name`，placeholder「清洗流名称」 | — |
| 状态标签 | `draft` →「草稿」；`published` →「已发布」 | **无切换按钮**，需改数据模型字段 |
| 提示文案 | 「从节点右侧拖出，接到另一节点左侧；可一对多 / 多对一自由组合」 | 中等屏宽以上显示 |
| **预览** | 有选中 → 预览该节点；无选中 → 跑全流至输出节点 | loading 中禁用重复点击 |
| **保存** | `commit(true)` → `emit('save')`；带短暂 loading | 无 toast；宿主自行持久化 |

::: tip 预览含义
工具栏「预览」与选中 / 拖入后的自动预览均调用 **`runCleanFlowLocal`**：按边拓扑对上游做真实变换，使用 Mock / 包内 Demo 表行，默认最多 **50** 行。这是设计期本地管道结果，**不是**生产环境远程执行，也尚未写入页面 / 报表 `state`。
:::

## 左侧组件库

- 宽度 240px，标题「组件库」
- 五个分组可折叠（默认全部展开）：**数据源 / 清洗 / 合并 / 聚合 / 输出**
- 每项可拖拽；`dragstart` 写入 MIME：`application/grow-data-clean-node` = 节点 `type`
- `enabled === false` 的项半透明且不可拖（当前目录内节点均为 `enabled: true`）
- 悬停显示 `description`（title）

完整节点列表见 [节点与算子](/data-clean/nodes)。

## 画布交互

| 操作 | 行为 |
|------|------|
| 从组件库拖入 | 在落点创建节点，自动选中并跑预览；**第二个 `output` 会被拒绝**并显示 error |
| 拖拽节点 | `node-drag-stop` 写回 `position` |
| 从右锚点拖到左锚点 | 合法则创建边；非法（反向锚点、自连、成环、源无出/目标无入、重复边）静默忽略 |
| 一对多 / 多对一 | 允许；同一 `source + target + sourceHandle` 不重复 |
| 点击节点 | 选中节点、打开浮层配置、刷新预览 |
| 点击边 | 选中边、清空节点选中与预览 |
| 点击空白 | 清空选中与预览 |
| 边删除按钮 / Delete | 删除边 |
| Delete / Backspace（选中节点） | 删除节点及关联边 |
| 缩放 | Controls；约 0.3–1.4 |

::: info 删除快捷键
数据清洗画布**响应** Delete / Backspace（与数据准备不同）。若焦点在 `INPUT` / `TEXTAREA` / `SELECT` 或可编辑元素内，则不拦截，避免误删节点。
:::

### 连线校验要点

1. `sourceHandle` 必须以 `out` 开头，`targetHandle` 必须以 `in` 开头（保证箭头方向与拖拽一致）
2. 源节点 `NODE_TYPE_META.outputs > 0`，目标 `inputs > 0`
3. `wouldCreateCycle`：禁止形成环
4. 条件分支请从「是」(`out-true`) / 「否」(`out-false`) 分别接到下游

Handle 命名约定见 [节点与算子 · 端口](/data-clean/nodes#端口与连线)。

## 配置浮层

选中节点后，画布上浮出 `CleanConfigFloat`（标题「配置 · {名称}」），内嵌 `NodeConfigPanel`。

| 状态 | 表现 |
|------|------|
| 未选中节点 | 无浮层 |
| 已选中 | 通用「名称 / 类型」+ 按 `type` 的专属表单；字段候选来自上游列（表源用表结构） |

所有节点底部只读展示：

- 输入行数 / 输出行数（来自最近一次预览写入的 `stats`；未预览过为 `-`）

**十五种节点均有配置 UI**（含 table 字段勾选、`output` 输出字段勾选、filter / condition / split / join / groupby 等）。详见 [节点与算子](/data-clean/nodes)。

## 底部预览面板

标题「数据预览」，可折叠（默认展开高度约 220px）。

| 状态 | 行为 |
|------|------|
| 有结果 | `GrowTable` 展示 `columns` + `rows`；副标题为当前节点名 |
| `warnings` | 黄色提示条（配置不全、未实现路径等，不阻断） |
| `error` | 红色错误条（如无输出节点、多输出、缺上游等） |
| 空态 | 未跑过：「点击预览：有选中则看当前节点，无选中则跑全流至输出」；无列 / 无行另有提示 |

预览成功后会回写目标节点的 `stats.inputRows` / `stats.outputRows`（入行取直接上游结果行数）。

## 推荐操作流程（逐步）

1. **拖入数据源**：组件库「数据表」或「API 接口」拖到画布；在浮层选来源 / 填 URL
2. **串联清洗**：如「去空格&大小写」→「空值处理」→「条件过滤」或「条件分支」
3. **需要合并时**：拖入「关联合并」或「纵向合并」，从两路上游分别接到左侧多输入锚点
4. **需要汇总时**：接「分组聚合」或「透视表」
5. **收口**：拖入唯一的「数据输出」，配置输出名、目标与输出字段
6. **预览**：选中关键节点或清空选中后点「预览」，核对管道结果
7. **保存**：工具栏保存，宿主拿到 `CleanFlow` 快照

典型拓扑示例：

```text
[数据表 orders] ──► [去重] ──► [条件分支] ──是──► [格式标准化] ──┐
                                      └──否──► [空值处理] ─────┼──► [关联合并] ──► [数据输出]
[数据表 customers] ────────────────────────────────────────────┘
```

## 与页面 / 报表对接（规划）

设计目标（源码注释与输出节点文案）：

```text
保存 CleanFlow（声明式）
    → 下游报表 / 页面拉数时「调用时执行」整条流
    → 结果作为报表数据集 / 低代码数据源 / API 端点
```

当前：

- 设计器内已可用本地引擎预览管道结果（Demo / Mock 数据）
- 输出节点 `target`: `'report' | 'lowcode' | 'api'`
- `consumers` / 触发方式字段已预留，**消费者绑定尚未接通**
- 展示侧主路径仍主要通过 [数据准备查询](/data-prep/usage#与页面--报表对接) 写入 `state`

协同关系见 [协同工作](/guide/designers/collaboration)。

## 相关文档

- [数据模型](/data-clean/schema)
- [节点与算子](/data-clean/nodes)
- [数据准备](/data-prep/) — 分析层 Dataset，可作清洗源
- [数据库建模](/schema-designer/)
- [低代码设计器 · 演示与接入](/guide/designers/playground)
