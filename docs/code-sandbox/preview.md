---
title: GrowCodeSandbox
lang: zh-CN
---

# GrowCodeSandbox

将完整 Vue SFC 编译为可挂载组件并在宿主树内预览。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string` | `''` | Vue SFC 源码（`v-model`） |
| `expose` | `SandboxExpose` | `{}` | 宿主能力面 |
| `dependencies` | `CodeDependency[]` | `[]` | 启用中的依赖（含 npm / host） |

## SandboxExpose

| 字段 | 说明 |
|------|------|
| `components` | 可选补充组件表；未填时，component 类依赖按名从宿主全局解析 |
| `apis` | 注入到 script 作用域的方法（如 `useRequest`） |
| `utils` | 注入到 script 的工具值 |
| `modules` | 可按包名 `import` 的模块表 |

预览运行在宿主 Vue 树内，可继续使用已注册的 `Grow*` 驱动组件与 IOC。

## Slots

| 插槽 | 说明 |
|------|------|
| `preview` | 自定义预览区；默认渲染编译结果 / 错误信息 |

## 引入

```ts
import { GrowCodeSandbox } from '@grow-admin-rock/code-sandbox'
// 或子路径
import { GrowCodeSandbox } from '@grow-admin-rock/code-sandbox/code-sandbox'
```

演示页：侧栏 **沙箱 → 代码沙箱** / **沙箱工具**。
