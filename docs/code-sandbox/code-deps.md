---
title: GrowCodeDeps
lang: zh-CN
---

# GrowCodeDeps

依赖注入面板：展示默认锁定项，支持添加 / 编辑 npm 或 host 依赖。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `CodeDependency[]` | `[]` | 依赖列表（`v-model`） |
| `defaultDependencies` | `CodeDependency[]` | `DEFAULT_SANDBOX_DEPENDENCIES` | 默认锁定依赖 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `(list)` | 列表变更 |
| `change` | `(list)` | 同列表变更（规范化后） |

## Slots

| 插槽 | 说明 |
|------|------|
| `title` | 标题区，默认文案「依赖注入」 |

## CodeDependency

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | `string` | 包名或注入标识（如 `nanoid` / `GrowButton` / `useRequest`） |
| `version` | `string` | npm 版本；host 可用作标签 |
| `source` | `'npm' \| 'host'` | 来源 |
| `kind` | `'component' \| 'api' \| 'util'` | 类型 |
| `enabled` | `boolean` | 是否启用（锁定项始终启用） |
| `locked` | `boolean` | 默认注入：不可取消、不可删除 |
| `injectAs` | `string[]` | npm 加载后注入到 script 的导出名（可直接调用） |

## source 两种来源

| source | 行为 |
|--------|------|
| `host` | 从宿主全局组件、`expose.apis` / `modules` 解析，不走 CDN |
| `npm` | 经 esm.sh 动态加载，可按 `injectAs` 挂到 script 作用域 |

## 引入

```ts
import { GrowCodeDeps, DEFAULT_SANDBOX_DEPENDENCIES, mergeDependencies } from '@grow-admin-rock/code-sandbox'
// 或子路径
import { GrowCodeDeps } from '@grow-admin-rock/code-sandbox/code-deps'
```
