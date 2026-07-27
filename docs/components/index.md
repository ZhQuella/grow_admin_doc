---
title: 组件文档
lang: zh-CN
---

# 组件文档

本模块说明 `@grow-admin-rock/components` 中与业务强相关的组件用法，按两类组织：

| 类型 | 含义 | 典型组件 |
|------|------|----------|
| **契约组件** | 三库共有能力的薄封装，靠驱动映射到 EP / Naive / Antdv | `GrowButton`、`GrowInput`… |
| **预设组件** | 框架内置业务封装（`isPresetComponent`），不依赖具体 UI 驱动实现 | `GrowSearchBar`、`GrowColumnBar`、`GrowIconify`… |

::: tip 先读什么？
- 想了解 Grow 怎么跟三套 UI 库对接 → [组件驱动架构](/guide/architecture/component-driver)
- 契约组件通用写法 → [Grow 契约组件](/guide/development/grow-components)
- 在线编辑与 SFC 预览 → [代码沙箱](/code-sandbox/)
- 拖拽页面 / 报表设计 → [页面设计器](/page-designer/)、[报表设计器](/report-designer/)
- 本页起是**具体组件 API / 示例**说明
:::

## 文档目录

### 预设业务组件

| 组件 | 说明 | 演示 |
|------|------|------|
| [SearchBar 高级搜索栏](/components/search-bar) | 可组合查询条件弹层 | 功能示例 → 高级搜索栏 |
| [ColumnBar 表格列设置](/components/column-bar) | 列显隐树形配置 | 功能示例 → 表格列设置 |
| [AbstractEle 动态表单项](/components/abstract-ele) | 按配置渲染 Grow 表单控件 | 配合 SearchBar |

### 其他组件

| 组件 | 说明 |
|------|------|
| [其他组件](/components/other) | Iconify、SplitPane 等 |
| [代码沙箱](/code-sandbox/) | 独立模块：编辑器 / 依赖 / SFC 预览 |
| [页面设计器](/page-designer/) | 低代码页面设计 |
| [报表设计器](/report-designer/) | 图表看板设计与渲染 |

## 引入方式

多数组件在宿主 `onSetup` 后已全局注册，模板可直接使用：

```vue
<GrowSearchBar :search="searchList" @search="onSearch" />
<GrowColumnBar :columns="columns" @confirm="onConfirm" />
```

需要类型或具名导出时：

```ts
import type { SearchBarField } from '@grow-admin-rock/components/search-bar'
import { GrowSearchBar } from '@grow-admin-rock/components/search-bar'

import type { ColumnBarItem } from '@grow-admin-rock/components/column-bar'
import { GrowColumnBar } from '@grow-admin-rock/components/column-bar'
```

## 国际化

预设组件文案依赖 `@grow-admin-rock/locale`，相关 key：

| 命名空间 | 用途 |
|----------|------|
| `PUBLIC.*` | 查询 / 重置 / 确认 / 暂无数据等公共文案 |
| `SEARCH_BAR.*` | 高级搜索栏 |
| `COLUMN_BAR.*` | 列设置（如全选） |
