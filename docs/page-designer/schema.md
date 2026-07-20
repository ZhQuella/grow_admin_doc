---
title: 页面设计器 · 数据模型
lang: zh-CN
---

# 数据模型

设计器运行时配置集中在 `draggableConfig`（`provide` 注入），与页面 schema 一一对应，可供保存、回放与 `GrowRenderer` 使用。

## 顶层结构

```ts
type DraggableConfig = {
  pageConfig: Record<string, any>      // 页面级配置
  dataSource: DesignerDataSourceItem[] // 数据源（数组）
  apiOutlined: DesignerApiOutlinedItem[] // 数据请求（数组）
  structures: StructureNode[]        // 树形结构（画布顺序）
  renderArgument: Record<string, RenderArgument> // 节点元信息
  styles: Record<string, CSSPropertiesLike>      // uuid → 样式
  events: Record<string, any>        // uuid → 事件
  props: Record<string, any>         // uuid → 组件 props
  /** 属性输入模式：uuid → modelKey → 'text' | 'bind' */
  propBindModes: Record<string, Record<string, 'text' | 'bind'>>
}
```

每个画布节点有唯一 `uuid`（如 nanoid）。`styles` / `props` / `events` / `renderArgument` / `propBindModes` 均以 uuid 为 key。

`dataSource`、`apiOutlined` 见 [数据源与数据请求](/page-designer/data)；绑定求值见 [变量绑定](/page-designer/variable-bind)。

`dataSource`、`apiOutlined` 的字段、表单能力与交互说明见 [数据源与数据请求](/page-designer/data)。

## structures（结构树）

```ts
type StructureNode = {
  uuid: string
  children?: StructureNode[]       // 默认子节点（正文区）
  footerSlot?: StructureNode[]     // 卡片 / 弹窗 / 抽屉 / 布局页脚
  optionSlot?: StructureNode[]     // 卡片标题右侧操作区
  contentSlot?: StructureNode[]    // Popover 弹出内容
  headerSlot?: StructureNode[]     // 布局顶栏
  asideSlot?: StructureNode[]      // 布局侧栏
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

属性面板根据 `elementInfo` 中各组件的 props 配置动态生成表单项。支持变量绑定的字段在绑定后存的是**表达式字符串**（如 `state.title`），需配合 `propBindModes` 求值。

## propBindModes

```ts
propBindModes[uuid][modelKey] = 'text' | 'bind'
```

| 值 | 含义 |
|------|------|
| `text`（或缺省） | `props` 中为普通字面量 |
| `bind` | `props` 中为表达式，渲染前按 `dataSource` 构建的 `state` 求值 |

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

## events

按 uuid 存储事件绑定（点击、变更等）。具体协议可随业务扩展；渲染器按约定挂到映射组件。

## 与渲染器的关系

```
GrowDesigner  ──编辑──►  DraggableConfig / PageSchema
                              │
                              ▼
                         GrowRenderer(:schema)  ──►  真实页面
```

保存后端时建议持久化完整 schema（至少 `structures` + `renderArgument` + `props` + `styles` + `events` + `propBindModes`，以及按需的 `dataSource` / `apiOutlined` / `pageConfig`），回读后既可继续编辑，也可只读渲染。
