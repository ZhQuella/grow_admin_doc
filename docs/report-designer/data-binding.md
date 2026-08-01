---
title: 报表设计器 · 数据绑定
lang: zh-CN
---

# 数据绑定

报表区块通过页面级 `state` 取数：左侧配置 `dataSource` / `apiOutlined` / `computedProps`，运行时写入 `state`，区块在「数据绑定」Tab 选择 `state.xxx`（或 map / 代码绑定），再由 `buildEChartsOption` 注入图表 data。

页面数据面板的字段与交互与页面设计器一致，见 [数据源与数据请求](/page-designer/data)。

## 数据流

```
页面配置（左侧轨）
  dataSource / apiOutlined / …
        │
        ▼
buildRuntimeState → …
        │
        ▼
provide(GROW_RUNTIME_STATE)
        │
        ▼
ReportBlockChart
  → resolveBlockDataBinding
  → buildEChartsOption → ECharts setOption
```

设计器预览与 `GrowReportRenderer` 走同一套链路。

## ReportDataBindRef

单路绑定：

```ts
type ReportDataBindMode = 'bind' | 'map' | 'code'

type ReportDataBindRef = {
  mode?: ReportDataBindMode
  /** 路径 / 表达式 / 函数体（code 模式须 return） */
  source?: string
  /** 兼容旧配置：求值后再按 path / fields 提取 */
  mapping?: {
    path?: string
    fields?: string[]
  }
}
```

设计器交互与页面设计器一致：输入框直接填 `state.xxx`，或点 **f** 打开变量绑定弹窗写代码（`mode: 'code'`）。

| 模式 | 行为 |
|------|------|
| `bind` | 输入框快捷绑定 |
| `code` | 弹窗编写 JS 函数体，可使用 `state`，须 `return` |
| `map` | 兼容旧数据：求值后再按 `path` / `fields` 提取 |

`code` 模式始终走 `resolveBoundExpression`；`bind` / `map` 下若 `source` 以 `state.` / `return` 开头等，同样按函数体求值。

## ReportBlockDataBinding

```ts
type ReportBlockDataBinding = {
  /** 类目轴 / X 轴 data */
  xAxisData?: ReportDataBindRef
  /** Y 轴类目 data（热力等） */
  yAxisData?: ReportDataBindRef
  /**
   * 按 seriesList 下标逐项绑定
   * seriesData[i] → seriesList[i].data
   */
  seriesData?: ReportDataBindRef[]
  /**
   * 非直角坐标：整图数据（雷达 / 漏斗 / 地图等）
   * graph / sankey / chord 可为 { data, links }
   */
  chartData?: ReportDataBindRef
  /** 雷达指示器（可选，覆盖 chartConfig.radar.indicator） */
  radarIndicator?: ReportDataBindRef
}
```

### 注入规则（概要）

| 图表场景 | 注入目标 |
|------|------|
| 直角坐标系 | `xAxis.data` + 各 `series[i].data` |
| 热力图等双类目轴 | `xAxisData` / `yAxisData` + series |
| 雷达 | 可选覆盖 `indicator`；系列 value 或整段 `chartData` |
| 关系类（graph / sankey / chord） | `chartData` → `{ data, links }` |
| 其它类型 | `chartData` 写入首个 series.data |

::: tip
`chartConfig` **不写业务 data**。演示/空数据时系列默认 `data: []`，靠绑定注入真实值。
:::

## 设计器 UI

| 组件 | 说明 |
|------|------|
| `BlockDataBindingPanel` | 按当前图表类型展示可绑字段 |
| `BindRefEditor` | 单路 bind / map / code 编辑，变量列表来自页面数据项 `name` → `state.{name}` |

多系列时在 `seriesData` 中按系列下标逐项配置，与 `chartConfig.seriesList` 顺序对齐。

## 与页面设计器变量绑定的差异

| | 页面设计器 | 报表设计器 |
|--|-----------|-----------|
| 绑定位置 | 组件 props（`propBindModes`） | 区块 `dataBinding` |
| 目标 | 任意属性表达式 | 轴 / 系列 / 整图 data |
| 页面 state | `dataSource` + API | 相同 |
| 映射 | 直接表达式 | 额外支持 `map` 抽字段 |

## 相关文档

- [数据模型](/report-designer/schema) — schema 中的 `dataBinding` 字段
- [图表配置](/report-designer/chart-config) — `buildEChartsOption` 注入点
- [页面设计器 · 变量绑定](/page-designer/variable-bind) — state 求值约定
- [数据准备](/data-prep/) — Dataset 配置与查询（独立模块，经页面请求写入 state 后绑定）
