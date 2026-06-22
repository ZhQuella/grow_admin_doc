---
title: 局部覆盖组件库
lang: zh-CN
---

# 局部覆盖组件库

## 一句话

全局用一种 UI 库（在 `projectSetting` 里配置）；**某个页面或某块区域**想用另一种库时，用 `ComponentDriverProvider` 包一层。

这和 [切换组件库](/guide/development/switch-component-library) 不同：全局切换改两处配置；局部覆盖只影响被包裹的子树。

---

## 什么时候用？

| 场景 | 说明 |
|------|------|
| 局部换风格 | 某一页要 Naive 风格，其余仍是 Element Plus |
| 换库过渡期 | 部分页面已迁新库，其余还没迁 |
| A/B 对比 | 同页面对比两套 UI 效果 |

::: tip 大多数情况不用
整站换库请用 `projectSetting.componentLibrary` + `vite preset`，不要每个页面各自包 Provider。
:::

---

## 基本用法

当某个页面需要使用与全局不同的组件库时，用 `ComponentDriverProvider` 包裹子树：

```vue
<script setup>
import { ComponentDriverProvider } from '@grow-admin-rock/component-driver';
import { NaiveComponentDriver } from '@grow-admin-rock/component-driver-naive';

const driver = NaiveComponentDriver.builder()
  .enableButton()
  .enableInput()
  .finish();
</script>

<template>
  <ComponentDriverProvider :driver="driver">
    <!-- 此区域内的 Grow* 组件走 Naive UI 驱动 -->
    <GrowButton>局部 Naive 按钮</GrowButton>
    <GrowInput placeholder="Naive 输入框" />
  </ComponentDriverProvider>
</template>
```

外面仍是全局库，里面被 Provider 包住的 `Grow*` 会走你传入的 `driver`：

```vue
<template>
  <GrowButton>全局库按钮</GrowButton>

  <ComponentDriverProvider :driver="driver">
    <GrowButton>局部 Naive 按钮</GrowButton>
  </ComponentDriverProvider>
</template>
```

---

## 按需启用组件（Builder API）

驱动包用 Builder 模式，**只启用需要的组件**，不必每次都 `enableAll()`：

```typescript
// Element Plus — 只启用按钮和日期选择器
import { EPComponentDriver } from '@grow-admin-rock/component-driver-element-plus';

EPComponentDriver.builder()
  .enableButton()
  .enableDatePicker()
  .finish();
```

```typescript
// Naive UI — 启用全部 84 个共有组件
import { NaiveComponentDriver } from '@grow-admin-rock/component-driver-naive';

NaiveComponentDriver.builder().enableAll();
```

```typescript
// Ant Design Vue — 按需启用
import { AntdvComponentDriver } from '@grow-admin-rock/component-driver-antdv';

AntdvComponentDriver.builder()
  .enableButton()
  .enableInput()
  .enableSelect()
  .finish();
```

常用写法：`builder()` → `enableXxx()`（可多次）→ `finish()` 得到驱动实例，传给 `:driver`。

---

## 相关包

| 包名 | 职责 |
|------|------|
| `@grow-admin-rock/component-driver` | `ComponentDriverProvider`、Builder 桥接、`createDriverHook` |
| `@grow-admin-rock/component-driver-element-plus` | Element Plus 映射（84 个共有组件） |
| `@grow-admin-rock/component-driver-naive` | Naive UI 映射 |
| `@grow-admin-rock/component-driver-antdv` | Ant Design Vue 映射 |

局部覆盖时需要 **手动 import 对应驱动包**（例如上面示例里的 `NaiveComponentDriver`），宿主全局驱动不会自动替你做这件事。

---

## 工作原理

`ComponentDriverProvider` 通过 Vue 的 `provide/inject`，在子树里注入局部驱动字典：

```
全局驱动（projectSetting.componentLibrary 决定）
        ↓
ComponentDriverProvider（传入的 :driver）
        ↓
子树里的 Grow* → 优先用局部映射；未启用的组件回退全局
```

`ComponentDriverProvider` 还支持可选属性：

| 属性 | 说明 |
|------|------|
| `driver` | 局部驱动实例（`builder().finish()` 的返回值） |
| `abstract` | 为 `true` 时不渲染包裹 DOM，只提供驱动上下文 |
| `tag` | 包裹元素标签，默认 `div` |
| `driverCls` | 包裹元素 class 前缀 |

---

## 注意事项

1. **会增大打包体积** — 全局已加载一个驱动，局部再 import 另一个，可能同时打进 bundle
2. **命令式 API 不受影响** — `useMessage()`、`useDialog()` 仍走宿主在 `init-components-driver.ts` 里绑定的全局实现
3. **只 enable 用到的组件** — 减少映射开销
4. **业务模块仍用 Grow 组件** — 局部子树里也不要直接 `import { ElButton } from 'element-plus'`

---

## 开发规范

| ✅ 推荐 | ❌ 禁止 |
|---------|---------|
| 特殊场景使用 `ComponentDriverProvider` | 把局部覆盖当常规换库手段 |
| 按需 `enableXxx()` 启用组件 | 局部子树里直接 import 三方 UI 组件 |
| 全局换库用 `projectSetting.componentLibrary` | 每个页面各自配一套驱动 |
| 绕过桥接层时仍通过 Grow 组件 | 绕过桥接层直接使用三方组件 |

与 README 中整体开发规范一致：业务只写 `Grow*`，换库在宿主或局部 Provider 边界处理。

---

## 延伸阅读

- [组件驱动架构](/guide/architecture/component-driver) — Grow 组件与驱动三层结构
- [切换组件库](/guide/development/switch-component-library) — 全局切换（改两处配置）
- [Grow 契约组件](/guide/development/grow-components) — 84 个共有组件列表
- [命令式 API](/guide/development/imperative-api) — Message / Dialog（不受局部覆盖影响）
