---
title: 报表设计器 · 基础用法
lang: zh-CN
---

# 基础用法

本文说明 `GrowReportDesigner` / `GrowReportRenderer` 的接入、工具栏、左轨页面数据、区块配置与预览注意点。图表视觉与绑定见专页。

## 演示模块接入

菜单：**设计器 → 报表设计器**，path：`report-designer-playground`。

依赖 `@grow-admin-rock/report-designer`（并间接依赖 `@grow-admin-rock/designer` 的页面级面板）。装配见 [业务模块开发](/guide/development/business-module)、[低代码设计器](/guide/designers/)。

## 在页面中使用 GrowReportDesigner

```vue
<template>
  <div class="report-designer-playground">
    <GrowReportDesigner ref="designerRef" />
  </div>
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

::: warning 编辑回填
设计器当前 **无 `schema` / `v-model` 入参**，不支持从已有 JSON 回填继续编辑。宿主用 `getSchema()` 落库；只读展示用 `GrowReportRenderer`。
:::

### defineExpose（设计器）

| 方法 / 属性 | 说明 |
|------|------|
| `getSchema()` | 导出完整 `ReportSchema`：`layout` + `pageConfig` + `dataSource` / `apiOutlined` / `computedProps` |
| `runtimeState` | 当前页面 state（reactive） |
| `refreshApiOutlined()` | 重建 state 并重跑 `autoLoad` API |

无 props / emits。

## 界面总览

```
┌──────────────────────────────────────────────────────────────┐
│ [添加区块] [清空] [预览]    左侧配置页面数据；悬停区块可操作…   │
├────┬───────────────┬────────────────────────┬────────────────┤
│轨  │ 页面配置/数据  │ 24 列 GridLayout        │ 区块配置浮层    │
│道  │ 源/请求/事件  │ 拖拽缩放图表卡片        │ 图表/绑定/基础  │
└────┴───────────────┴────────────────────────┴────────────────┘
```

空态：`GrowEmpty`「点击上方「添加区块」开始设计」。

## 工具栏

| 按钮 | 行为 | 禁用 / 说明 |
|------|------|-------------|
| **添加区块** | `createLayoutItem`：默认占满行宽（w=24）、h=4、`title=区块 {n}`、`showTitle=true`、`chartType=cartesian` | — |
| **清空** | 清空 `layout` 并关闭配置浮层 | 无区块时禁用；**无确认框** |
| **预览** | Drawer「报表预览」；内部用渲染器展示 | 预览时**强制** `pageConfig.responsive=false`，避免抽屉宽度触发列数切换；并卸载设计态 GridLayout，防止全局 eventBus 串扰 |

## 左侧轨道（复用页面设计器面板）

| 面板 | 组件 | 写入字段 |
|------|------|----------|
| 页面配置 | `PageConfigPanel` | `pageConfig`（网格参数） |
| 数据源 | `DesignerDataSourcePanel` | `dataSource` |
| 属性计算 | `DesignerComputedPropsPanel` | `computedProps` |
| 数据请求 | `DesignerApiOutlinedPanel` | `apiOutlined` |
| 页面事件 | `DesignerPageEventsPanel` | 页面生命周期（与页面设计器同源能力） |

数据源 / 请求表单文案与校验与页面设计器一致，见 [数据源与数据请求](/page-designer/data)。

### 页面配置常用字段

默认由 `createDefaultPageConfig` 提供，设计器可改：

| 字段 | 默认 | 说明 |
|------|------|------|
| 列数 `colNum` | 24（范围约 1–96） | 网格列 |
| 行高 `rowHeight` | 30 | 像素 |
| 水平 / 垂直间距 | 10 / 10 | margin |
| 缩放 | 1 | 0.1–4 |
| 可拖拽 / 可缩放等 | 多项 Switch | 多数带 Tip：部分仅影响预览 / 运行时 |
| 响应式 | `false` | 预览会强制关闭，保证按设计列数看 |

## 画布与区块操作

| 操作 | 说明 |
|------|------|
| 拖拽 / 缩放 | `vue3-grid-layout`；过程中可显示占比与 `w × h` |
| 选中 | 单击卡片打开右侧配置 |
| 点击空白 | 取消选中 |
| 悬停工具 | 设置、复制、删除 |
| 复制 | 标题变为「{原标题} 副本」，深拷贝 `chartConfig` / `dataBinding` |
| 删除 | 界面按钮；**无 Delete 快捷键** |

## 右侧区块配置（BlockConfigPanel）

三 Tab：

### 1. 报表配置（图表视觉）

- 图表类型网格：约 17 种（`REPORT_CHART_TYPE_OPTIONS`：直角坐标、雷达、地图、热力、漏斗等）  
- **切换类型**会确认：「从「A」切换为「B」将清空当前图表配置…」，确认「清空并切换」  
- 下方 `ChartOptionFields` 按类型展示轴、系列、颜色等视觉项（**不含业务 data**）  

详见 [图表配置](/report-designer/chart-config)。

### 2. 数据绑定

按图表类型显示可绑槽位，例如：

| 槽位 | 用途 |
|------|------|
| `xAxisData` | 类目轴 / X |
| `yAxisData` | 双类目（如热力） |
| `seriesData[i]` | 与 `seriesList` 下标对齐的系列 data |
| `chartData` | 非直角坐标整图数据 |
| `radarIndicator` | 雷达指示器（可选覆盖） |

`BindRefEditor`：

- placeholder「请输入或绑定变量」  
- 快捷 chip：页面数据项 → `state.{name}`  
- **f** 打开代码绑定（`mode: 'code'`，须 `return`）  

**不要**在报表里直选 Dataset；经数据请求写入 `state` 后再绑。见 [数据绑定](/report-designer/data-binding)、[低代码设计器](/guide/designers/)。

### 3. 基础信息

| 字段 | 说明 |
|------|------|
| 显示标题 | Switch `showTitle` |
| 区块标题 | Input；`showTitle=false` 时禁用 |

## 预览与 GrowReportRenderer

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
import {
  GrowReportRenderer,
  createReportSchema,
  type ReportSchema,
} from '@grow-admin-rock/report-designer'
</script>
```

### Props

| Prop | 说明 |
|------|------|
| `schema` | 设计器导出的 `ReportSchema` |
| `httpClient` | 可选；缺省走框架解析的请求客户端 |

### defineExpose（渲染器）

| 方法 / 属性 | 说明 |
|------|------|
| `runtimeState` | 运行时 state |
| `refreshApiOutlined()` | 重跑 autoLoad API |
| `apiMethods` | 供页面事件调用 |

运行时与页面设计器相同：`buildRuntimeState` → API → `GROW_RUNTIME_STATE` → 各区块 `resolveBlockDataBinding` → `buildEChartsOption`。

## 工厂函数

```ts
import {
  createReportSchema,
  createDefaultPageConfig,
  createDefaultChartConfig,
  REPORT_CHART_TYPE_OPTIONS,
} from '@grow-admin-rock/report-designer'
```

## 相关文档

- [数据绑定](/report-designer/data-binding)
- [数据模型](/report-designer/schema)
- [图表配置](/report-designer/chart-config)
- [页面设计器 · 数据源](/page-designer/data)
- [数据准备](/data-prep/)
- [低代码设计器](/guide/designers/)
