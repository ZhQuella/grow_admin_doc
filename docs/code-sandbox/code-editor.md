---
title: GrowCodeEditor
lang: zh-CN
---

# GrowCodeEditor

基于 Monaco 的代码编辑器。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string` | `''` | 编辑内容（`v-model`） |
| `defaultLanguage` | `CodeEditorLanguage` | `'javascript'` | **仅初始**语言 |
| `languageSwitchable` | `boolean` | `true` | 是否显示语言 Select |
| `options` | `CodeEditorOptions` | `{}` | Monaco 选项 |

`CodeEditorLanguage`：`javascript` | `html` | `css` | `json` | `vue` | `sql`（不含 TypeScript）。

`CodeEditorOptions`：

| 字段 | 类型 | 说明 |
|------|------|------|
| `readonly` | `boolean` | 只读 |
| `theme` | `'light' \| 'dark' \| 'auto'` | 主题；`auto` 跟随 `html.dark` |
| `lineNumbers` | `boolean` | 行号 |
| `wordWrap` | `boolean` | 自动换行 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `(value: string)` | 内容变更 |
| `beforeLanguageChange` | `(payload)` | 切换前；可 `preventDefault()` 取消 |
| `afterLanguageChange` | `({ from, to })` | 切换成功后 |

语言切换**默认不改写编辑器内容**。

## 引入

```ts
import { GrowCodeEditor } from '@grow-admin-rock/code-sandbox'
// 或子路径
import { GrowCodeEditor } from '@grow-admin-rock/code-sandbox/code-editor'
```

演示页：侧栏 **沙箱 → 代码编辑器**。
