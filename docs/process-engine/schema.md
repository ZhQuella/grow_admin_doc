---
title: 流程引擎 · 数据模型
lang: zh-CN
---

# 数据模型

设计器产物为声明式 **`ProcessFlow`**。本页描述类型、默认配置与包导出。节点语义与端口见 [节点与连线](/process-engine/nodes)。

## ProcessFlow

```ts
type ProcessFlowStatus = 'draft' | 'published'

type ProcessFlow = {
  version: 1
  id: string
  name: string
  status: ProcessFlowStatus
  nodes: ProcessFlowNode[]
  edges: ProcessFlowEdge[]
  updatedAt?: string
}
```

| 字段 | 说明 |
|------|------|
| `version` | 固定为 `1` |
| `id` / `name` | 流标识与展示名 |
| `status` | 草稿 / 已发布；工具栏仅展示 |
| `nodes` / `edges` | 流程图；边引用节点 `id` |
| `updatedAt` | ISO 字符串；每次 `commit` 刷新 |

::: tip 设计期 vs 运行时
当前包只负责编排与序列化 `ProcessFlow`。实例推进、待办、消息发送等运行时能力尚未内置。
:::

## 节点与边

```ts
type ProcessNodeCategory =
  | 'human' | 'event' | 'system' | 'state' | 'decision' | 'branch'

type ProcessNodeType =
  | 'countersign' | 'add-sign' | 'approver' | 'cc' | 'handler'
  | 'start' | 'start-message' | 'start-timer'
  | 'end-event' | 'terminate' | 'message-notify'
  | 'service-task' | 'subprocess'
  | 'state'
  | 'script-task' | 'business-rule-task'
  | 'condition-branch' | 'parallel-branch'

type ProcessFlowNode<T extends ProcessNodeType = ProcessNodeType> = {
  id: string
  type: T
  name: string
  position: { x: number; y: number }
  config: ProcessNodeConfigMap[T]
}

type ProcessTransitionKind = 'forward' | 'rollback' | 'jump'

type ProcessFlowEdge = {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  label?: string
  transitionKind?: ProcessTransitionKind
  condition?: string
  priority?: number
  remark?: string
}
```

| 边字段 | 说明 |
|--------|------|
| `transitionKind` | 正向流转 / 回退 / 跳转（默认 `forward`） |
| `condition` | 连线级条件表达式（可选） |
| `priority` | 条件分支多出口时的优先级 |
| Handle | 默认 `out-bottom` → `in-top`；分支为 `out-b-{armId}` |

## 人员指派

```ts
type ProcessAssigneeType =
  | 'user' | 'initiator' | 'initiator-select' | 'role'
  | 'direct-supervisor' | 'dept-manager' | 'multi-level-supervisor'
  | 'dept' | 'expression' | 'initiator-leader' // 后三项偏兼容

type ProcessPersonAssignExtras = {
  selectScope?: 'all' | 'same-dept' | 'role' | 'users'
  selectScopeValue?: string
  selectMin?: number
  selectMax?: number // 0=不限
  relativeTo?: 'initiator' | 'previous' | 'form-field'
  relativeField?: string
  deptFrom?: 'initiator' | 'form-field' | 'specified'
  deptFromValue?: string
  deptLevel?: 'current' | 'parent' | 'grandparent' | 'level-n'
  deptLevelN?: number
  includeDeputy?: boolean
  supervisorEnd?: 'levels' | 'top' | 'until-role'
  supervisorLevels?: number
  supervisorUntilRole?: string
  supervisorMode?: 'sequential' | 'parallel'
  skipDuplicate?: boolean
  skipIfInitiator?: boolean
  emptyFallback?: 'skip' | 'error' | 'to-user' | 'to-role'
  emptyFallbackValue?: string
}

type ProcessHumanCommon = {
  description?: string
  enableWhen?: string
  skipWhen?: string
  timeoutAction?: 'none' | 'auto-pass' | 'auto-reject' | 'notify' | 'escalate'
  escalateTo?: string
}
```

UI 主选项见 `PERSON_ASSIGNEE_TYPE_OPTIONS`（指定成员 / 发起人 / 自选 / 角色 / 直属主管 / 部门主管 / 连续多级主管）。

## 节点 config 摘要

完整字段以源码 `types.ts` 为准；此处按类别列出要点。

### 人工

| type | 关键字段 |
|------|----------|
| `countersign` | `assigneeType` / `assignees` / `passRule`（all/any/percent/sequential）/ `passPercent` / `onReject` |
| `add-sign` | `mode`（before/after/parallel）/ `assignee` / `returnToOrigin` |
| `approver` | `approvers` + `ProcessPersonAssignExtras` / `rejectStrategy` / `sequential` |
| `cc` | `recipients` / `timing`（on-enter/on-leave）/ `channel` |
| `handler` | `handlers` / `resultOptions` / `priority` |

### 事件

| type | 关键字段 |
|------|----------|
| `start` | `initiatorType` / `formKey` / `bizType` / `initVariables` |
| `start-message` | `messageName` / `correlationKey` / `payloadMap` |
| `start-timer` | `scheduleType`（cron/delay/rate）/ `schedule` / `misfirePolicy` |
| `end-event` | `outcome` / `terminateAll` / `bizStatus` |
| `terminate` | `reason` / `audit` / `notifyInitiator` |
| `message-notify` | `channel` / `recipients` / `webhookUrl` / `failOnError` |

### 系统 / 状态 / 决策

| type | 关键字段 |
|------|----------|
| `service-task` | `protocol` / `endpoint` / `method` / `retry` / `authType` / `resultVariable` |
| `subprocess` | `processRef` / `sync` / `inputMap` / `outputMap` / `multiInstance` |
| `state` | `stateKey` / `allowRollbackTo` / `allowJumpTo` / `isTerminal` / `bizField` |
| `script-task` | `language` / `script` / `resultVariable` |
| `business-rule-task` | `ruleSetId` / `hitPolicy`（first/collect）/ `failOnMiss` |

### 分支

```ts
type ProcessConditionArm = {
  id: string
  label: string
  logic?: 'and' | 'or'
  conditions?: Array<{ field: string; op: string; value: string }>
  expression?: string
}

type ProcessConditionBranchConfig = {
  branches?: ProcessConditionArm[] // 不含固定默认出口
  remark?: string
}

type ProcessParallelBranchConfig = {
  branches?: Array<{ id: string; label: string }>
  joinMode?: 'all' | 'any' | 'count'
  joinCount?: number
  remark?: string
}
```

条件分支画布固定默认锚点 `out-b-default`（`CONDITION_DEFAULT_ARM_ID = 'default'`），不进入可编辑 `branches` 列表。条件出口约 1–10 条；并行出口约 2–10 条。

## 工厂与导出

```ts
import {
  GrowProcessDesigner,
  createProcessFlow,
  createProcessFlowNode,
  createProcessFlowEdge,
  cloneProcessFlow,
  defaultConfigForType,
  CATEGORY_META,
  NODE_TYPE_META,
  PALETTE_GROUPS,
  PERSON_ASSIGNEE_TYPE_OPTIONS,
  TRANSITION_KIND_OPTIONS,
  RULE_OP_OPTIONS,
  canConnectNodes,
  isStartNodeType,
  isEndNodeType,
  type ProcessFlow,
  type ProcessFlowNode,
  type ProcessNodeType,
} from '@grow-admin-rock/process-engine'
```

| API | 说明 |
|-----|------|
| `createProcessFlow({ name, ... })` | 新建流；默认 `status: 'draft'` |
| `createProcessFlowNode(type, patch?)` | 按类型填默认名与 config |
| `createProcessFlowEdge({ source, target, ... })` | 默认 handle：`out-bottom` → `in-top` |
| `cloneProcessFlow(flow)` | JSON 深拷贝 |
| `defaultConfigForType(type)` | 该类型默认 config |
| `canConnectNodes` / `isStartNodeType` / `isEndNodeType` | 连线与起止判定 |
| `resolveSourceHandle` / `resolveTargetHandle` | Handle 归一化（兼容旧横向 id） |

另导出大量 UI 选项常量（超时动作、驳回策略、协议、脚本语言、汇聚模式等），见包入口与 `nodeCatalog.ts`。

## 相关文档

- [基础用法](/process-engine/usage)
- [节点与连线](/process-engine/nodes)
- [DesignRock 核心层](/guide/packages/design-rock)
