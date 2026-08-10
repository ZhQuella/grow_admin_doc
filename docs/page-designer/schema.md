---
title: 页面设计器 · 数据模型
lang: zh-CN
---

# 数据模型

设计器运行时配置集中在 `draggableConfig`（`provide` 注入），与页面 schema（`DesignerSchema`）一一对应，可供保存、回放与 `GrowRenderer` 使用。

## 顶层结构

```ts
type DesignerSchema = {
  pageConfig?: Record<string, any> & {
    events?: Record<string, PageEventItem>
    watchers?: Record<string, PageWatcherItem>
  }
  dataSource?: DesignerDataSourceItem[]
  computedProps?: DesignerComputedPropItem[]
  apiOutlined?: DesignerApiOutlinedItem[]
  structures?: DesignerStructureNode[]
  renderArgument?: Record<string, DesignerRenderArgument>
  styles?: Record<string, CSSPropertiesLike>
  events?: Record<string, Record<string, ComponentEventItem>>
  props?: Record<string, any>
  /** uuid → modelKey → 'text' | 'bind' | 'function' */
  propBindModes?: Record<string, Record<string, 'text' | 'bind' | 'function'>>
}
```

每个画布节点有唯一 `uuid`（如 nanoid）。`styles` / `props` / `events` / `renderArgument` / `propBindModes` 均以 uuid 为 key。

`dataSource`、`apiOutlined` 见 [数据源与数据请求](/page-designer/data)；绑定求值见 [变量绑定](/page-designer/variable-bind)；事件见 [事件与生命周期](/page-designer/events)。

## structures（结构树）

```ts
type DesignerStructureNode = {
  uuid: string
  children?: DesignerStructureNode[]
  footerSlot?: DesignerStructureNode[]   // 卡片 / 弹窗 / 抽屉 / 布局页脚
  optionSlot?: DesignerStructureNode[]   // 卡片标题右侧操作区
  contentSlot?: DesignerStructureNode[]  // Popover 弹出内容
  headerSlot?: DesignerStructureNode[]   // 布局顶栏
  asideSlot?: DesignerStructureNode[]    // 布局侧栏
}
```

- 根数组对应画布顶层节点顺序
- 仅容器类物料拥有 `children` 或各类插槽数组

## renderArgument（物料元信息）

来自组件库定义（`moduleMap`），拖入时写入，例如：

| 字段 | 说明 |
|------|------|
| `elName` | 展示名 |
| `elType` | `basic` / `eleModule` 等 |
| `elTagName` | 映射标签或组件名（如 `BasicTitle`、`GrowLink`、`div`） |
| `refName` | 运行时 refs 键名；有值才收集，事件中通过 `refs.refName` 访问 |
| `isChild` | 是否可作为容器接收子节点 |
| `isAdd` | 是否显示「添加子项」 |
| `isInlineBlock` | 默认是否按行内级选区处理（如链接、短语） |
| `elIcon` | 物料图标 |

## props

组件运行参数，例如：

- 标题：`level`、`context`
- 正文 / 短语：`context`
- 链接 / 按钮：`content`、`type`、`href` 等
- 图片：`src`、`alt`
- 表单控件默认值：多为 `modelValue`（上传为 `file-list`）

属性面板根据 `elementInfo` 中各组件的 props 配置动态生成表单项。支持变量绑定的字段在绑定后存的是**表达式字符串**（如 `state.title`），需配合 `propBindModes` 求值；函数绑定字段存函数体代码。

## propBindModes

```ts
propBindModes[uuid][modelKey] = 'text' | 'bind' | 'function'
```

| 值 | 含义 |
|------|------|
| `text`（或缺省） | `props` 中为普通字面量 |
| `bind` | `props` 中为表达式，渲染前按 `state` 求值 |
| `function` | `props` 中为函数体，运行时编译为可调用函数（可访问 `state` / `refs` 与声明参数） |

复制、删除、清空画布时会同步维护该表。

## styles

纯样式对象，键为 CSS 属性名（如 `width`、`margin-top`、`display`、`border-radius`、`box-shadow`、`font-size`、`color` 等）。

常见约定：

| 场景 | 约定 |
|------|------|
| 标题 / 正文默认 | 常带 `width: '100%'`，便于块级占满 |
| 链接等行内物料 | 默认 `display: 'inline-block'` + `min-width` / `min-height` |
| 切到 `inline` | 去掉 `width: '100%'`，外框 `inline-block` + `fit-content` |

详见 [样式面板](/page-designer/style)。

## events / pageConfig

- 组件事件：`events[uuid][eventType]`
- 页面生命周期：`pageConfig.events`
- 数据监听：`pageConfig.watchers`

字段说明见 [事件与生命周期](/page-designer/events)。

## computedProps

```ts
type DesignerComputedPropItem = {
  id: string
  name: string
  description: string
  /** 函数体，可使用 state，须 return */
  code: string
}
```

与 `dataSource` 一并参与 `buildRuntimeState`，结果进入运行时 `state`，可被属性绑定引用。

## 与渲染器的关系

```
GrowDesigner  ──编辑──►  DesignerSchema
                              │
                              ▼
                         GrowRenderer(:schema)  ──►  真实页面
```

保存后端时建议持久化完整 schema（至少 `structures` + `renderArgument` + `props` + `styles` + `events` + `propBindModes`，以及按需的 `dataSource` / `computedProps` / `apiOutlined` / `pageConfig`），回读后既可继续编辑，也可只读渲染。
