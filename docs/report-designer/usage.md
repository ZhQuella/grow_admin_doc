---
title: 报表设计器 · 基础用法
lang: zh-CN
---

# 基础用法

## 演示模块接入

演示包 `@grow-admin-cornerstone/apps-designer` 同时提供：

- **低代码设计器** → `GrowDesigner`
- **报表设计器** → `GrowReportDesigner`

宿主（如 `sample`）需：

1. 在 workspace 依赖中引入 `@grow-admin-cornerstone/apps-designer`
2. 在 IOC / Library 装配中注册该模块
3. 由 `apps-home` 的动态路由合并菜单项

具体装配方式见 [业务模块开发](/guide/development/business-module)、[DesignCornerstone](/guide/packages/design-cornerstone)。

## 在页面中使用 GrowReportDesigner

```vue
<template>
  <GrowReportDesigner ref="designerRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GrowReportDesigner } from '@grow-admin-rock/report-designer'

const designerRef = ref<InstanceType<typeof GrowReportDesigner>>()

const save = () => {
  const schema = designerRef.value?.getSchema()
  // 持久化 schema…
}
</script>
```

::: warning
当前设计器 **无 `schema` 入参**，不支持从已有 JSON 回填编辑。宿主自行 `getSchema()` 持久化；只读展示请用 `GrowReportRenderer`。
:::

### defineExpose

| 方法 / 属性 | 说明 |
|------|------|
| `getSchema()` | 导出完整 `ReportSchema`（layout + pageConfig + 页面数据） |
| `runtimeState` | 当前页面 state（reactive） |
| `refreshApiOutlined()` | 重建 state 并重跑 `autoLoad` 的 API |

## 画布操作

| 操作 | 说明 |
|------|------|
| 添加区块 | 工具栏添加图表区块（默认直角坐标系） |
| 拖拽 / 缩放 | 调整网格位置与宽高 |
| 选中 | 单击卡片，打开右侧配置 |
| 复制 / 删除 | 选中后使用区块工具操作 |
| 预览 | 弹层内用 `GrowReportRenderer` 渲染当前 schema |

## 左侧面板

复用 `@grow-admin-rock/designer` 导出的页面级数据面板：

| 面板 | 写入字段 | 说明 |
|------|----------|------|
| 数据源 | `dataSource` | 静态 / 变量数据 → `state.{name}` |
| 计算属性 | `computedProps` | 基于 state 的派生数据 |
| 数据请求 | `apiOutlined` | 远程接口，结果写入 state |

字段与表单细节见 [页面设计器 · 数据源与数据请求](/page-designer/data)。报表侧如何接到图表见 [数据绑定](/report-designer/data-binding)。

## 右侧面板

选中区块后通常包含：

| Tab | 说明 |
|------|------|
| 基础 | 标题、是否显示标题、图表类型等 |
| 图表 | 按类型展示的视觉配置（轴、系列、颜色等） |
| 数据绑定 | 将 `state.xxx` 绑定到轴 / 系列 / 整图 data |

## 预览与渲染

```vue
<template>
  <GrowReportRenderer
    :schema="reportSchema"
    :http-client="myHttpClient"
  >
    <template #empty>暂无内容</template>
  </GrowReportRenderer>
</template>

<script setup lang="ts">
import { GrowReportRenderer } from '@grow-admin-rock/report-designer'
import type { ReportSchema } from '@grow-admin-rock/report-designer'
</script>
```

### Props

| Prop | 类型 | 说明 |
|------|------|------|
| `schema` | `ReportSchema \| null` | 设计器导出的 JSON |
| `httpClient` | `ReportHttpClient \| null` | 可选；缺省原生 fetch（类型来自 designer） |

### defineExpose

| 方法 / 属性 | 说明 |
|------|------|
| `runtimeState` | 运行时 state |
| `refreshApiOutlined()` | 重新执行 autoLoad API |

网格默认：`colNum=24`，`rowHeight=30`（可被 `pageConfig` 覆盖）。

## 相关文档

- [数据绑定](/report-designer/data-binding)
- [数据模型](/report-designer/schema)
- [图表配置](/report-designer/chart-config)
