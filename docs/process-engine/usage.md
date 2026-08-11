---
title: 流程引擎 · 基础用法
lang: zh-CN
---

# 基础用法

本文说明如何在宿主中挂载 `GrowProcessDesigner`，以及界面操作（工具栏、组件库、画布、配置浮层、保存）。数据模型与节点配置见专页。

## 演示模块接入

演示包 `@grow-admin-cornerstone/apps-designer` 在设计器菜单下提供 **流程引擎** playground。

| 项 | 值 |
|------|------|
| 菜单标题 | 流程引擎 |
| 路由 path | `process-engine-playground` |
| 路由 name | `ProcessEnginePlayground` |
| 页面组件 | `ProcessEnginePlaygroundPage` |

宿主（如 `sample`）需：

1. workspace 依赖 `@grow-admin-rock/process-engine` 与 `@grow-admin-cornerstone/apps-designer`
2. IOC 中 `.use(appsDesignerLib)`
3. `apps-home` 动态路由合并菜单

::: info 无独立 Mock
本版**尚未**提供 `sample/mock/processEngine.ts`。保存仅向父组件抛出 `ProcessFlow` 快照；持久化由宿主自行处理。
:::

装配细节见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)、[低代码设计器](/guide/designers/)。

## 在页面中使用

```vue
<template>
  <div class="process-engine-playground">
    <GrowProcessDesigner v-model="flow" @save="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  GrowProcessDesigner,
  createProcessFlow,
  type ProcessFlow,
} from '@grow-admin-rock/process-engine'

const flow = ref<ProcessFlow>(
  createProcessFlow({
    name: '未命名流程',
  }),
)

const onSaved = (value: ProcessFlow) => {
  flow.value = value
  // 可在此同步到后端或 Pinia
}
</script>

<style scoped>
.process-engine-playground {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
</style>
```

::: tip 容器高度
设计器根节点为 `absolute inset-0`，必须由父级提供确定高度（演示页常见：`height: 100%` + 布局 `min-height: 0`）。
:::

### Props / Events

| 项 | 类型 | 说明 |
|------|------|------|
| `modelValue` | `ProcessFlow`（可选） | 外部受控；不传时内部创建默认流（名称「未命名流程」、`status: draft`） |
| `update:modelValue` | `(ProcessFlow) => void` | 任意编辑后抛出**深拷贝**（含更新后的 `updatedAt`） |
| `change` | `(ProcessFlow) => void` | 与 `update:modelValue` 同时抛出 |
| `save` | `(ProcessFlow) => void` | 仅在点击「保存」时抛出 |

### defineExpose

| 方法 | 说明 |
|------|------|
| `getFlow()` | 返回当前流的深拷贝 |
| `setFlow(next)` | 用新流替换内部状态，清空选中，并触发 `update:modelValue` / `change` |

```ts
const designerRef = ref<{
  getFlow: () => ProcessFlow
  setFlow: (next: ProcessFlow) => void
} | null>(null)

designerRef.value?.setFlow(loadedFlow)
```

## 界面总览

```
┌──────────────────────────────────────────────────────────────┐
│ [流程名称____] [草稿|已发布] 提示文案              [保存]      │
├────────┬─────────────────────────────────────────────────────┤
│组件库  │ Vue Flow + 浮层配置（选中节点或连线时）                 │
│240px   │ ProcessFlowNode + ProcessFlowEdge；Controls（左下）   │
└────────┴─────────────────────────────────────────────────────┘
```

空画布提示：**从左侧组件库拖拽节点到此处开始编排**。工具栏提示文案：从上往下编排；允许成环（回退 / 跳转）。

## 工具栏

| 控件 | 行为 |
|------|------|
| 流程名称 | 绑定 `flow.name` |
| 状态标签 | `draft` →「草稿」；`published` →「已发布」（**无切换按钮**） |
| **保存** | `commit(true)` → `emit('save')`；带短暂 loading |

本版**无预览按钮**（无运行时实例引擎）。

## 左侧组件库

- 宽度 240px，标题「组件库」
- 六个分组：人工工作流 / 事件驱动流 / 系统编排流 / 状态机流 / 决策规则流 / 分支
- `dragstart` MIME：`application/grow-process-engine-node` = 节点 `type`
- 当前目录节点均为 `enabled: true`

完整节点列表见 [节点与连线](/process-engine/nodes)。

## 画布交互

| 操作 | 行为 |
|------|------|
| 从组件库拖入 | 在落点创建节点并选中 |
| 拖拽节点 | 写回 `position` |
| 从**底部**锚点拖到**顶部**锚点 | 合法则创建边；非法静默忽略 |
| 允许成环 | 与数据清洗不同，可用于回退 / 跳转 |
| 点击节点 | 选中节点、打开浮层配置 |
| 点击边 | 选中边、打开连线配置（`transitionKind` / 标签 / 条件等） |
| 点击空白 | 清空选中、关闭浮层 |
| Delete / Backspace | 删除选中边或节点（及关联边） |
| 缩放 | Controls；约 0.3–1.4 |

::: info 删除快捷键
Vue Flow 自带 `delete-key-code` 为 `null`，由设计器根节点自行处理 Delete / Backspace。焦点在输入控件内时不拦截。
:::

### 连线校验要点

`canConnectNodes`：

1. 禁止自连
2. 开始类节点（`inputs === 0`）不可作目标；结束类（`outputs === 0`）不可作源
3. `sourceHandle` 须以 `out` 开头，`targetHandle` 须以 `in` 开头
4. 同一 `source + target + sourceHandle` 不重复
5. **不**禁止成环

默认 Handle：`out-bottom` → `in-top`。条件 / 并行分支使用 `out-b-{armId}`（默认出口 `out-b-default`）。

## 配置浮层

选中节点或连线后，画布上浮出 `ProcessConfigFloat`。

| 选中对象 | 内容 |
|----------|------|
| 节点 | 名称 / 类型 + 该类型专属表单（十九种均有） |
| 连线 | 标签、`transitionKind`（正向 / 回退 / 跳转）、条件表达式、优先级、备注 |

人工节点（审批人 / 抄送 / 办理人等）共用人员指派子表单（`PersonAssigneeFields`），按 `assigneeType` 展开主管 / 部门 / 自选等扩展项。

## 推荐操作流程

1. 拖入 **开始**（或消息 / 定时开始）
2. 串联 **审批人 / 办理人 / 会签** 等人工节点，配置指派与超时
3. 需要分流时拖入 **条件分支** 或 **并行分支**，为各出口连下游
4. 需要系统对接时接 **服务任务 / 子流程 / 脚本 / 业务规则**
5. 状态机场景用 **状态节点** + 回退 / 跳转连线
6. 以 **结束** 或 **终止流程** 收口
7. 工具栏 **保存**，宿主拿到 `ProcessFlow`

典型拓扑：

```text
[开始]
   │
[审批人]
   │
[条件分支] ──条件1──► [服务任务] ──► [结束]
   │
   └──默认──► [抄送人] ──► [结束]
```

## 相关文档

- [数据模型](/process-engine/schema)
- [节点与连线](/process-engine/nodes)
- [低代码设计器 · 演示与接入](/guide/designers/playground)
- [数据清洗](/data-clean/) — 数据管道，非业务审批流
