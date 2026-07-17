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
}
```

每个画布节点有唯一 `uuid`（如 nanoid）。`styles` / `props` / `events` / `renderArgument` 均以 uuid 为 key。

`dataSource`、`apiOutlined` 的字段、表单能力与交互说明见 [数据源与数据请求](/page-designer/data)。

## structures（结构树）

```ts
type StructureNode = {
  uuid: string
  children?: StructureNode[]  // 可嵌套容器才有
}
```

- 根数组对应画布顶层节点顺序
- 仅 `isChild: true` 的物料（如容器、表单）拥有 `children`

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

属性面板根据 `elementInfo` 中各组件的 props 配置动态生成表单项。

## styles

纯样式对象，键为 CSS 属性名（如 `width`、`margin-top`、`display`、`border-radius`、`box-shadow`）。

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
                         GrowRenderer  ──►  真实页面
```

保存后端时建议持久化完整 schema（至少 `structures` + `renderArgument` + `props` + `styles` + `events`，以及按需的 `dataSource` / `apiOutlined`），回读后既可继续编辑，也可只读渲染。
