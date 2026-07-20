---
title: 页面设计器 · 变量绑定
lang: zh-CN
---

# 变量绑定

属性面板中带 **函数图标** 的输入项（`PropVariableBind`）支持两种模式：

| 模式 | 说明 |
|------|------|
| **普通文本** | 直接输入字面量，写入 `props[uuid][字段]` |
| **变量绑定** | 写入表达式（如 `state.title`），并在 `propBindModes` 中标记为 `bind` |

画布与预览会按数据源求值后展示；修改数据源保存后，引用该变量的组件会跟随更新。

## 使用方式

1. 在左侧 **数据源** 中新增项：填写 **名称**（如 `title`），在 **数据** 中写入 JS 字面量（如 `"你好"`、`123`、`true`、`{ a: 1 }`）
2. 选中画布组件，打开右侧 **属性**
3. 在支持绑定的字段旁点击函数图标，打开「变量绑定」弹窗
4. 从左侧变量列表点选（写入 `state.名称`），或自行编写表达式后确定
5. 绑定成功后：输入框只读、按钮高亮；可再次打开编辑，或点「移除绑定」恢复普通文本

::: tip
非绑定态打开弹窗时，**不会**把当前普通文本带入表达式框；仅已绑定态会带回现有表达式。
:::

## 表达式约定

- 运行时上下文为 `state`，键为数据源 **名称**
- 引用写法：`state.xxx`（与数据源 `name` 对应）
- 也可写完整 JS 表达式，例如：`state.count + 1`、`state.user?.name`
- 数据源 `data` 字段本身按 JS 表达式求值（与代码编辑器 `expression` 语言一致）

示例：

| 数据源 name | data（代码） | 绑定表达式 | 展示结果 |
|-------------|--------------|------------|----------|
| `title` | `"页面标题"` | `state.title` | 页面标题 |
| `count` | `10` | `state.count` | 10 |
| `flag` | `true` | `state.flag` | true（开关等） |
| `list` | `["a","b"]` | `state.list` | 数组（选择器多选等） |

## 已支持绑定的属性（概要）

以属性面板配置为准（`elementInfo`）：

| 组件 | 可绑定字段 |
|------|------------|
| 标题 / 正文 / 短语 | 展示内容 `context` |
| 图片 | 图片地址 `src`、替代文本 `alt` |
| 卡片 | 标题 `header` |
| 弹窗 / 抽屉 | 标题 `title` |
| 按钮 | 文字 `content` |
| 链接 | 文字 `content`、链接地址 `href` |
| 输入框、数字输入框、选择器、级联、开关、滑块、日期/时间选择器、单选、多选、树形选择、提及 | **默认值** → `modelValue` |
| 上传 | **默认值** → `file-list` |

## 持久化：propBindModes

每个节点、每个字段记录输入模式：

```ts
propBindModes: {
  [uuid: string]: {
    [modelKey: string]: 'text' | 'bind'
  }
}
```

- `text`：普通输入（或不存在该 key）
- `bind`：`props` 中对应值为表达式，渲染前需求值

复制 / 删除节点时会同步处理 `propBindModes`。

## 运行时求值

```
dataSource[]  ──buildRuntimeState──►  state
props + propBindModes + state  ──resolveBoundProps──►  展示用 props
```

- 设计器：`useOption` 提供 `runtimeState`；叶子节点与卡片标题等使用解析后的值
- 预览 / `GrowRenderer`：schema 需包含 `dataSource`、`propBindModes`；内部同样求值

源码：`GrowRenderer/utils/resolveBoundProps.ts`。

## 组件结构（源码）

```
optionComponent/PropVariableBind/
  index.vue              # 输入框 + 绑定按钮
  VariableBindDialog.vue # 变量列表 + GrowCodeEditor
  constants.ts
  use/useVariableList.ts

static/propBindModes.ts  # 模式常量与归一化
static/elementInfo/shared.ts  # variableBindInput / defaultValueBind
```

## 相关文档

- [数据源与数据请求](/page-designer/data) — 配置 `dataSource`
- [数据模型](/page-designer/schema) — `propBindModes` 字段
- [基础用法](/page-designer/usage) — 预览与 `GrowRenderer`
