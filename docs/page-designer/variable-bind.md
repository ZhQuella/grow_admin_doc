---
title: 页面设计器 · 变量绑定
lang: zh-CN
---

# 变量绑定

属性面板中带绑定能力的输入项支持最多三种模式（以该字段是否开放为准）：

| 模式 | `propBindModes` | 说明 |
|------|-----------------|------|
| **普通文本** | `text`（或缺省） | 直接输入字面量，写入 `props[uuid][字段]` |
| **变量绑定** | `bind` | 写入表达式（如 `state.title`），渲染前求值 |
| **函数绑定** | `function` | 写入函数体，运行时编译为回调（可用声明参数 + `state` / `refs`） |

画布与预览会按数据源 / 计算属性求值后展示；修改数据源保存后，引用该变量的组件会跟随更新。

## 变量绑定用法

1. 在左侧 **数据源**（或 **属性计算**）中新增项：填写 **名称**（如 `title`），在 **数据** 中写入 JS 字面量或表达式
2. 选中画布组件，打开右侧 **属性**
3. 在支持绑定的字段旁点击函数图标，打开「变量绑定」弹窗
4. 从左侧变量列表点选（写入 `state.名称`），或自行编写表达式后确定
5. 绑定成功后：输入框只读、按钮高亮；可再次打开编辑，或点「移除绑定」恢复普通文本

::: tip
非绑定态打开弹窗时，**不会**把当前普通文本带入表达式框；仅已绑定态会带回现有表达式。
:::

## 函数绑定用法

部分 props（如上传的各类回调、部分布局 / 展示组件的函数型属性）通过 `functionBind` 配置开放：

1. 在属性面板对应字段打开「函数绑定」弹窗（`PropFunctionBind`）
2. 按提示参数编写函数体；上下文始终包含 `state`、`refs`
3. 确定后 `propBindModes` 记为 `function`；可「清除」恢复

与变量绑定的差异：函数绑定的目标是**可调用函数**，不是求值后的静态值。

## 表达式约定

- 运行时上下文为 `state`，键为数据源 / 计算属性 **名称**
- 引用写法：`state.xxx`（与 `name` 对应）
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
| 上传 | **默认值** → `file-list`；以及各类回调 → 函数绑定 |

## 持久化：propBindModes

每个节点、每个字段记录输入模式：

```ts
propBindModes: {
  [uuid: string]: {
    [modelKey: string]: 'text' | 'bind' | 'function'
  }
}
```

- `text`：普通输入（或不存在该 key）
- `bind`：`props` 中对应值为表达式，渲染前需求值
- `function`：`props` 中对应值为函数体

复制 / 删除节点时会同步处理 `propBindModes`。

## 运行时求值

```
dataSource[] + computedProps[]  ──buildRuntimeState──►  state
props + propBindModes + state  ──resolveBoundProps──►  展示用 props
```

- 设计器：`useOption` 提供 `runtimeState`；叶子节点与卡片标题等使用解析后的值
- 预览 / `GrowRenderer`：schema 需包含 `dataSource`、`propBindModes`（及按需的 `computedProps`）；内部同样求值

源码：`GrowRenderer/utils/resolveBoundProps.ts`。

## 组件结构（源码）

```
optionComponent/PropVariableBind/   # 变量绑定
optionComponent/PropFunctionBind/   # 函数绑定
static/propBindModes.ts             # 模式常量与归一化
static/elementInfo/shared.ts        # variableBindInput / functionBind / …
```

## 相关文档

- [数据源与数据请求](/page-designer/data)
- [事件与生命周期](/page-designer/events)
- [数据模型](/page-designer/schema)
- [代码沙箱](/code-sandbox/)
