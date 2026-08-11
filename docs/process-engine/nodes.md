---
title: 流程引擎 · 节点与连线
lang: zh-CN
---

# 节点与连线

本文按 **类别** 说明组件库节点、端口约定与人员指派。类型定义见 [数据模型](/process-engine/schema)。

## 类别与配色

| 类别 | `category` | 中文 | CSS 变量 |
|------|------------|------|----------|
| 人工工作流 | `human` | 人工工作流 | `--process-cat-human`（蓝） |
| 事件驱动流 | `event` | 事件驱动流 | `--process-cat-event`（琥珀） |
| 系统编排流 | `system` | 系统编排流 | `--process-cat-system`（青） |
| 状态机流 | `state` | 状态机流 | `--process-cat-state`（紫） |
| 决策规则流 | `decision` | 决策规则流 | `--process-cat-decision`（玫红） |
| 分支 | `branch` | 分支 | `--process-cat-branch`（青蓝） |

## 端口与连线

| 规则 | 说明 |
|------|------|
| 上入下出 | 默认 `in-top` / `out-bottom`（竖向编排） |
| `inputs === 0` | 开始类：开始 / 消息开始 / 定时开始 |
| `outputs === 0` | 结束类：结束 / 终止流程 |
| 分支多出口 | `out-b-{armId}`；条件默认口 `out-b-default` |
| 允许成环 | 用于回退、跳转；禁止自连与重复同口连边 |

连线可选配置：

| 字段 | 说明 |
|------|------|
| `transitionKind` | `forward` / `rollback` / `jump` |
| `label` | 画布展示文案 |
| `condition` | 连线级条件表达式 |
| `priority` | 多出口优先级 |
| `remark` | 备注 |

---

## 人工工作流（human）

### 会签 `countersign`

多人会签；`passRule`：全部 / 一人 / 比例 / 依次。可配表单、时限、未签人是否可见他人意见、驳回策略。

### 加签 `add-sign`

`mode`：前加签 / 后加签 / 并加签；可要求填写加签意见，完成后是否回到原审批人。

### 审批人 `approver`

单点 / 顺序审批；含人员指派扩展、通过/驳回文案、转交、驳回策略（上一节点 / 发起人 / 指定节点 / 结束）、通过后抄送。

### 抄送人 `cc`

`timing`：到达本节点 / 上游完成时；渠道站内信 / 邮件 / 短信 / 全部；可配置是否可看完整表单。

### 办理人 `handler`

事务办理（非单纯审批）；可配办理结果枚举、优先级、转交、是否必填意见。

### 人员指派（共用）

UI 主路径（`PERSON_ASSIGNEE_TYPE_OPTIONS`）：

| 值 | 含义 |
|----|------|
| `user` | 指定成员 |
| `initiator` | 发起人自己 |
| `initiator-select` | 发起人自选（范围 / 人数上下限） |
| `role` | 角色 |
| `direct-supervisor` | 直属主管（相对发起人 / 上一办理人 / 表单字段） |
| `dept-manager` | 部门主管（部门来源 + 组织层级） |
| `multi-level-supervisor` | 连续多级主管（级数 / 到顶 / 直到角色；依次或并行） |

通用人工项：`description`、`enableWhen`、`skipWhen`、超时动作（无 / 自动通过 / 自动驳回 / 通知 / 升级转交）。

---

## 事件驱动流（event）

| type | 中文 | 入/出 | 说明 |
|------|------|-------|------|
| `start` | 开始 | 0/1 | 谁可发起、启动表单、业务类型、初始变量 |
| `start-message` | 消息开始 | 0/1 | 外部消息名、关联键、payload 映射 |
| `start-timer` | 定时开始 | 0/1 | Cron / 固定延迟 / 固定频率；错过触发策略 |
| `end-event` | 结束 | 1/0 | 正常结束；可写回业务状态、结束通知 |
| `terminate` | 终止流程 | 1/0 | 强制终止全部并行分支 |
| `message-notify` | 消息通知 | 1/1 | 站内信 / 邮件 / 短信 / Webhook 等 |

---

## 系统编排流（system）

### 服务任务 `service-task`

`protocol`：HTTP / RPC / MQ；HTTP 方法、超时、重试、鉴权、请求体模板、结果变量、成功判定与失败策略。

### 子流程 `subprocess`

引用另一流程：`processRef`、同步/异步、入参出参映射、多实例集合变量、失败策略。

---

## 状态机流（state）

### 状态节点 `state`

实体状态：`stateKey` / `stateLabel`、是否终态、允许回退/跳转目标列表、进入时写回业务字段、进入/离开通知、颜色。

配合边上的 `transitionKind: 'rollback' | 'jump'` 表达状态迁移语义。

---

## 决策规则流（decision）

### 脚本任务 `script-task`

`language`：JavaScript / Groovy / 表达式；脚本正文与结果变量。

### 业务规则任务 `business-rule-task`

规则集 id/名、输入输出变量、命中策略（第一条 / 全部收集）、未命中是否失败。

---

## 分支（branch）

### 条件分支 `condition-branch`

- 可编辑多条条件出口（字段条件或表达式）
- 画布固定 **默认出口** `out-b-default`（未命中时走默认）
- 出口 Handle：`out-b-{armId}`

### 并行分支 `parallel-branch`

- 多路并行出口（2–10）
- `joinMode`：全部完成 / 任一完成 / 达到数量（设计期声明，运行时对接）

::: tip 与数据清洗 condition 的差异
清洗的 `condition` 是行级数据分流；流程的 `condition-branch` 是流程实例排他/默认路径分流。二者模型与执行语境不同。
:::

### 条件运算符

`RULE_OP_OPTIONS`：`eq` / `neq` / `gt` / `gte` / `lt` / `lte` / `contains` / `empty` / `not-empty`。

---

## 节点速查表

| type | 中文 | 类别 | 入/出 |
|------|------|------|-------|
| `countersign` | 会签 | human | 1/1 |
| `add-sign` | 加签 | human | 1/1 |
| `approver` | 审批人 | human | 1/1 |
| `cc` | 抄送人 | human | 1/1 |
| `handler` | 办理人 | human | 1/1 |
| `start` | 开始 | event | 0/1 |
| `start-message` | 消息开始 | event | 0/1 |
| `start-timer` | 定时开始 | event | 0/1 |
| `end-event` | 结束 | event | 1/0 |
| `terminate` | 终止流程 | event | 1/0 |
| `message-notify` | 消息通知 | event | 1/1 |
| `service-task` | 服务任务 | system | 1/1 |
| `subprocess` | 子流程 | system | 1/1 |
| `state` | 状态节点 | state | 1/1 |
| `script-task` | 脚本任务 | decision | 1/1 |
| `business-rule-task` | 业务规则任务 | decision | 1/1 |
| `condition-branch` | 条件分支 | branch | 1/多 |
| `parallel-branch` | 并行分支 | branch | 1/多 |

## 相关文档

- [概述](/process-engine/)
- [基础用法](/process-engine/usage)
- [数据模型](/process-engine/schema)
