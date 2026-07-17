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

设计器内部通过 `provide` 注入画布配置（结构、样式、属性等），一般无需再包一层。

## 画布操作

| 操作 | 说明 |
|------|------|
| 拖入组件 | 从左侧「组件库」拖到画布空白处或容器内 |
| 选中 | 单击画布上的选区外框 |
| 排序 | 选中后拖动工具条上的移动手柄 |
| 复制 / 删除 | 选中后使用工具条按钮 |
| 添加子项 | 仅 `isAdd` 类容器（如表单项）显示「添加」 |
| 清空 | 工具栏「清空」清除整页结构 |

## 左侧面板

| 面板 | 说明 |
|------|------|
| 组件库 | 按分组展示可拖拽物料（基础 / 表单 / 布局等） |
| 结构树 | 树形定位节点并选中 |
| 查看数据 | 查看当前设计 JSON |
| 数据源 | 页面静态 / 变量数据，数组写入 `dataSource` |
| 数据请求 | 远程接口与处理函数，数组写入 `apiOutlined` |

数据源与数据请求的字段、表单与排序说明见 [数据源与数据请求](/page-designer/data)。

## 右侧面板

选中节点后，右侧通常包含：

| Tab | 说明 |
|------|------|
| 属性 | 组件 props（文案、类型、开关等） |
| 样式 | 见 [样式面板](/page-designer/style) |
| 事件 | 交互事件配置（可按业务扩展） |

## 预览与渲染

- 工具栏「预览」用于设计态预览（可按产品接入弹层 / 路由）
- 正式渲染使用 `GrowRenderer`，传入与设计器相同结构的 schema：

```vue
<template>
  <GrowRenderer :config="pageSchema" />
</template>

<script setup lang="ts">
import { GrowRenderer } from '@grow-admin-rock/designer'
// pageSchema 含 structures / props / styles / events 等
</script>
```

数据字段说明见 [数据模型](/page-designer/schema)。
