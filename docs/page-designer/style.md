---
title: 页面设计器 · 样式面板
lang: zh-CN
---

# 样式面板

右侧「样式」Tab 将常用 CSS 写成可视化配置，写入当前节点的 `styles[uuid]`，并作用在**映射组件**上（而非仅选区外框）。

## 样式分组

| 分组 | 说明 | 可见范围（概要） |
|------|------|------------------|
| **尺寸与间距** | 宽高、Margin、Padding，支持 px / % / vw·vh | 全部 |
| **圆角** | 四角半径；可四角联动 | 全部 |
| **边框** | 颜色 / 透明度、线型、宽度；可四边联动 | 图片、标题、正文、短语、容器 |
| **背景颜色** | 色板 + 十六进制 + 透明度 | 标题、正文、短语、容器 |
| **阴影** | 阴影色 + 透明度（写入 `box-shadow`） | 图片、标题、正文、短语、容器 |
| **布局模式** | `display` 与 flex 子项（主轴 / 对齐 / 换行） | 标题、正文、短语、容器、链接 |

::: tip
具体白名单以 `styleConfig.vue` 中 `*_ALLOWED_TAGS` 为准；未列出的组件不显示对应分组。
:::

## 布局模式（display）

可选：`inline` / `flex` / `block` / `inline-block`。

当 `display === 'flex'` 时，可继续配置：

- **主轴方向** `flex-direction`
- **主轴对齐** `justify-content`
- **辅轴对齐** `align-items`
- **换行** `flex-wrap`

切换为非 flex 时，会清理上述 flex 相关字段。

### 内外层 display 约定

对 **标题、正文、短语、容器、链接**：

| 层级 | `display: inline` 时的表现 |
|------|---------------------------|
| **选区外框**（`draggable-item`） | 使用 `inline-block` + `width: fit-content`，保证可选中、描边，且不占满整行 |
| **映射组件**（真实节点） | 保持配置中的 `inline`（或你设置的 `inline-block` / `inline-flex`） |

与 **链接** 默认行为对齐：行内级不携带默认 `width: 100%`。从块级切到行内时，样式面板会去掉历史遗留的 `width: 100%`；切回 `block` / `flex` 时，标题 / 正文 / 容器会恢复默认占满宽度。

### Flex 与画布

容器（`div`）设为 `display: flex` 时，样式作用在**子节点列表容器**（拖拽列表根节点）上，子选区才会按主轴横向 / 纵向排列。仅设在更外层空壳上不会生效。

## 尺寸与选区外框

- 宽高写在 `styles` 中；选区外框会同步尺寸相关属性，使选中框与内容一致
- 映射组件在「外框已承接尺寸」时，内部可用 `width/height: 100%` 铺满（**行内级除外**，避免再次撑满整行）

## 文字样式

标题 / 正文 / 短语在样式面板中还有 **文字** 分组（`ElementText`）：颜色、字号、粗体 / 斜体 / 下划线 / 删除线、对齐、字距、行高等。

源码：`GrowDesigner/optionComponent/ElementText/`。

## 实现位置（便于对照源码）

| 能力 | 路径 |
|------|------|
| 样式分组入口 | `GrowDesigner/components/eleOptions/styleConfig.vue` |
| 尺寸 / 圆角 / 边框 / 背景 / 阴影 / 布局 | `GrowDesigner/optionComponent/Element*` |
| 文字 | `GrowDesigner/optionComponent/ElementText` |
| 选区外框与 display | `GrowDesigner/components/draggableItem` |
| 样式应用到映射节点 | `GrowDesigner/components/abstractionComponent` |
