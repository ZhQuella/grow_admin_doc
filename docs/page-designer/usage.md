---
title: 页面设计器 · 基础用法
lang: zh-CN
---

# 基础用法

本文说明 `GrowDesigner` / `GrowRenderer` 的挂载方式，以及工具栏、左轨、右栏、画布与预览的完整行为。数据、绑定、事件见专页。

## 演示模块接入

菜单：**设计器 → 低代码设计器**，path：`designer-playground`。

宿主需依赖 `@grow-admin-rock/designer` 与 `@grow-admin-cornerstone/apps-designer`，并在 IOC 中注册演示模块。见 [业务模块开发](/guide/development/business-module)、[低代码设计器](/guide/designers/)。

## 在页面中使用 GrowDesigner

```vue
<template>
  <div class="designer-playground">
    <GrowDesigner />
  </div>
</template>

<script setup lang="ts">
import { GrowDesigner } from '@grow-admin-rock/designer'
</script>

<style scoped>
.designer-playground {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
</style>
```

::: warning 当前 API 形态
`GrowDesigner` **无 props / emits / defineExpose**。画布状态全部在内部 `provide`（`useOption`）。若要持久化，目前需从「查看数据」复制 JSON，或后续由业务扩展导出能力；运行态请用 `GrowRenderer` 消费已保存的 schema。
:::

## 界面总览

```
┌──────────────────────────────────────────────────────────────┐
│ [清空] [预览]           从左侧拖入组件到画布                    │
├────┬───────────────┬────────────────────────┬────────────────┤
│轨  │ 左栏面板       │ 画布                    │ 右栏配置        │
│道  │ 组件库/数据…  │ 选中工具条 / Overlay    │ 属性/样式/事件  │
└────┴───────────────┴────────────────────────┴────────────────┘
```

空画布提示：「请从左侧组件库中拖入组件」。

## 工具栏

| 按钮 | 行为 | 禁用 |
|------|------|------|
| **清空** | 清空 `structures`，并同步清掉 styles / props / events / renderArgument / propBindModes 等 | 无节点时禁用；**无确认框** |
| **预览** | 底部 Drawer（约 90% 高）「页面预览」，内嵌 `GrowRenderer` | — |

预览 empty slot 默认「空预览」。预览用的 schema 会带上 `dataSource` / `computedProps` / `apiOutlined` / `propBindModes` 等，绑定会真实求值。

## 左侧轨道

默认打开并常固定「组件库」。侧栏可 **固定 / 取消固定**（图钉）与关闭。**未固定**时，在画布上 mouseup 往往会关闭左栏。

| type | 面板 | 写入 / 作用 |
|------|------|-------------|
| `module` | 组件库 | 拖拽物料（基础元素、布局容器、表单、业务组件等，见 `moduleMap`） |
| `json` | 查看数据 | 只读查看当前设计 JSON |
| `tree` | 结构树 | 树形定位并选中节点 |
| `dataBin` | 数据源 | `dataSource[]` |
| `computedProps` | 属性计算 | `computedProps[]` |
| `pageWatchers` | 数据监听 | `pageConfig.watchers` |
| `pageEvents` | 页面事件 | `pageConfig.events` |
| `apiOutlined` | 数据请求 | `apiOutlined[]` |

列表面板通用交互（数据源 / 计算属性 / 数据请求等）：

| 操作 | 说明 |
|------|------|
| 添加 | 右上角打开右侧抽屉表单 |
| 编辑 | 点列表项的**编辑**按钮（点整行通常不打开） |
| 删除 | 悬停删除；成功有 toast「已删除」 |
| 排序 | 拖拽手柄调整数组顺序 |

名称校验：必填；不可与同列表或其它数据类（数据源 ↔ 计算属性）重名。成功 toast：「添加成功 / 修改成功」。

数据源、数据请求字段见 [数据源与数据请求](/page-designer/data)。计算属性 / 事件 / 监听见 [事件与生命周期](/page-designer/events)。

## 右侧面板

### 未选中节点 → 页面配置

`PageOptions`：Tabs「属性」「高级」。高级可能仍为占位（「该面板建设中」）。属性表单项来自 `pageConfig` 静态配置。

### 已选中节点 → 组件配置

标题类似「组件配置 / 已选中」。Tabs：

| Tab | 说明 |
|------|------|
| **属性** | 按 `elementInfo` 动态表单；部分字段支持变量绑定 / 函数绑定 |
| **样式** | 尺寸、边距、边框、display 等，见 [样式面板](/page-designer/style) |
| **事件** | 按组件类型列出可绑事件，脚本 globals 含 `event` / `state` / `apis` / `refs` |
| **高级** | 唯一标识（uuid）、组件名称、**Ref 名称**（placeholder「如 form，事件中可通过 refs.form 调用」） |

绑定模式详见 [变量绑定](/page-designer/variable-bind)。

## 画布操作

| 操作 | 说明 |
|------|------|
| 拖入 | 从组件库拖到画布空白或容器；`dropHandlers` 写入 structures / props / styles / renderArgument 等 |
| 选中 | 单击选区；空白处取消选中（`activeUUID` 清空） |
| 排序 | 工具条移动手柄调整同级顺序 |
| 复制 | 同级插入深拷贝，生成新 uuid，并复制 props/styles/events/propBindModes |
| 删除 | 工具条删除；或 **Backspace / Delete**（无 meta/ctrl/alt，且焦点不在 INPUT/TEXTAREA/contentEditable） |
| 添加子项 | 仅 `isAdd` 容器显示 |
| Overlay | 弹窗 / 抽屉等在画布上为占位卡；工具栏进入**模拟编辑层**后在层内拖子节点 |

::: tip 快捷键差异
页面设计器可用 Delete 删**组件**；数据库建模 Delete 删**关联**；数据准备 / 报表**无**删除键。
:::

## 预览与运行时渲染

### GrowRenderer

```vue
<template>
  <GrowRenderer :schema="pageSchema" :http-client="optionalClient">
    <template #empty>空预览</template>
  </GrowRenderer>
</template>

<script setup lang="ts">
import { GrowRenderer } from '@grow-admin-rock/designer'
import type { DesignerSchema } from '@grow-admin-rock/designer'
</script>
```

| Prop | 说明 |
|------|------|
| `schema` | **注意属性名是 `schema`**，不是 `config` |
| `httpClient` | 可选；供 `apiOutlined` 发请求 |

| expose | 说明 |
|------|------|
| `runtimeState` / `getRuntimeState()` | 当前 state |
| `refreshApiOutlined()` | 重跑 autoLoad API |
| `apiMethods` | 事件里 `apis.xxx()` |
| `refs` | 配置了 `refName` 的组件实例表 |

运行时流程：

1. `buildRuntimeState(dataSource, computedProps)` → `state`  
2. `runApiOutlinedList`（可仅 autoLoad）→ 写回 state  
3. `recomputeComputedProps`  
4. provide：`GROW_RUNTIME_STATE` / `GROW_RUNTIME_APIS` / `GROW_RUNTIME_REFS`  
5. 按 `propBindModes` 解析 props；挂载组件事件与页面生命周期 / watchers  

::: warning
缺少 `dataSource` / `propBindModes` 时，绑定字段会当字面量显示，看起来像「绑定失败」。保存时务必带上完整 schema。
:::

建议持久化字段见 [数据模型](/page-designer/schema)。

## 物料分组（概要）

组件库按 `moduleMap` 分组，常见包括：

- **基础元素**：标题、正文、链接、图片、按钮等  
- **布局容器**：布局、卡片、分割等  
- **表单控件**：输入、选择、日期、上传等（多数默认全宽）  
- **业务组件**：如人员选择、部门选择等（`businessComponentMap`）  

具体可绑属性以右侧属性面板为准。

## 相关文档

- [样式面板](/page-designer/style)
- [数据源与数据请求](/page-designer/data)
- [变量绑定](/page-designer/variable-bind)
- [事件与生命周期](/page-designer/events)
- [数据模型](/page-designer/schema)
- [报表设计器](/report-designer/)（复用本模块页面级面板）
- [低代码设计器](/guide/designers/)
