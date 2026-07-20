---
title: 页面设计器 · 基础用法
lang: zh-CN
---

# 基础用法

## 演示模块接入

演示包 `@grow-admin-cornerstone/apps-designer` 负责：

- 提供设计器页面路由与菜单
- 依赖 `@grow-admin-rock/designer` 渲染 `GrowDesigner`

宿主（如 `sample`）需：

1. 在 workspace 依赖中引入 `@grow-admin-cornerstone/apps-designer`
2. 在 IOC / Library 装配中注册该模块（与 `apps-sandbox` 类似）
3. 由 `apps-home` 的动态路由合并菜单项

具体装配方式见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)。

## 在页面中使用 GrowDesigner

```vue
<template>
  <GrowDesigner />
</template>

<script setup lang="ts">
import { GrowDesigner } from '@grow-admin-rock/designer'
</script>
```

设计器内部通过 `provide` 注入画布配置（结构、样式、属性、数据源运行时 state 等），一般无需再包一层。

## 画布操作

| 操作 | 说明 |
|------|------|
| 拖入组件 | 从左侧「组件库」拖到画布空白处或容器内 |
| 选中 | 单击画布上的选区外框 |
| 排序 | 选中后拖动工具条上的移动手柄 |
| 复制 / 删除 | 选中后使用工具条按钮 |
| 添加子项 | 仅 `isAdd` 类容器（如表单项）显示「添加」 |
| 清空 | 工具栏「清空」清除整页结构 |

弹窗 / 抽屉在画布上为占位卡片；通过选中后的工具栏打开 **模拟编辑层**，在层内拖入子节点。

## 左侧面板

| 面板 | 说明 |
|------|------|
| 组件库 | 按分组展示可拖拽物料（基础 / 表单 / 布局等） |
| 结构树 | 树形定位节点并选中 |
| 查看数据 | 查看当前设计 JSON |
| 数据源 | 页面静态 / 变量数据，数组写入 `dataSource` |
| 数据请求 | 远程接口与处理函数，数组写入 `apiOutlined` |

数据源与数据请求见 [数据源与数据请求](/page-designer/data)。将数据源接到组件属性见 [变量绑定](/page-designer/variable-bind)。

## 右侧面板

选中节点后，右侧通常包含：

| Tab | 说明 |
|------|------|
| 属性 | 组件 props；部分字段为「输入 + 变量绑定」 |
| 样式 | 见 [样式面板](/page-designer/style) |
| 事件 | 交互事件配置（可按业务扩展） |
| 高级 | 节点渲染相关高级项（按组件开放） |

## 预览与渲染

- 工具栏「预览」：弹层内用 `GrowRenderer` 渲染当前 schema（含 `dataSource`、`propBindModes`，绑定字段会求值）
- 正式渲染同样使用 `GrowRenderer`，传入完整 schema：

```vue
<template>
  <GrowRenderer :schema="pageSchema" />
</template>

<script setup lang="ts">
import { GrowRenderer } from '@grow-admin-rock/designer'
// pageSchema 建议含：
// structures / renderArgument / props / styles / events
// dataSource / propBindModes / pageConfig / apiOutlined（按需）
</script>
```

::: warning
属性名为 **`schema`**（不是 `config`）。缺少 `dataSource` / `propBindModes` 时，绑定字段会按字面量表达式显示，无法解析为真实值。
:::

数据字段说明见 [数据模型](/page-designer/schema)。
