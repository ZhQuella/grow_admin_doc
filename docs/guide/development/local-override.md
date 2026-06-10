---
title: 局部覆盖组件库
lang: zh-CN
---

# 局部覆盖组件库

默认情况下，整个应用使用 `projectSetting.componentLibrary` 指定的组件库。当某个页面或子树需要使用不同的 UI 库时，可以通过 `ComponentDriverProvider` 实现局部覆盖。

## 使用场景

- 某个页面需要使用与全局不同的组件库风格
- A/B 测试不同 UI 库的视觉效果
- 渐进式迁移：部分页面已适配新库，其余仍用旧库

## 基本用法

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
  <!-- 全局使用 Element Plus -->
  <GrowButton>全局 EP 按钮</GrowButton>

  <!-- 此子树使用 Naive UI -->
  <ComponentDriverProvider :driver="driver">
    <GrowButton>局部 Naive 按钮</GrowButton>
    <GrowInput placeholder="Naive 输入框" />
  </ComponentDriverProvider>
</template>
```

## Builder API

驱动包提供 Builder 模式，可按需启用特定组件：

```typescript
// Element Plus — 只启用按钮和日期选择器
import { EPComponentDriver } from '@grow-admin-rock/component-driver-element-plus';

const driver = EPComponentDriver.builder()
  .enableButton()
  .enableDatePicker()
  .finish();

// Naive UI — 启用全部
import { NaiveComponentDriver } from '@grow-admin-rock/component-driver-naive';

const driver = NaiveComponentDriver.builder().enableAll();

// Ant Design Vue — 按需启用
import { AntdvComponentDriver } from '@grow-admin-rock/component-driver-antdv';

const driver = AntdvComponentDriver.builder()
  .enableButton()
  .enableInput()
  .enableSelect()
  .finish();
```

## 工作原理

`ComponentDriverProvider` 通过 Vue 的 `provide/inject` 机制，在子树中注入局部驱动字典。子组件渲染 `Grow*` 时优先使用局部驱动，未覆盖的组件回退到全局驱动。

```
全局驱动（projectSetting 决定）
    ↓
ComponentDriverProvider（局部驱动）
    ↓
子树中的 Grow* 组件 → 优先使用局部驱动映射
```

## 注意事项

1. **局部驱动需要手动 import 驱动包**，这会增加打包体积（三个驱动包可能同时存在）
2. **命令式 API 不受局部覆盖影响**，`useMessage()` 等仍使用全局驱动绑定的实现
3. **建议只启用需要的组件**，避免不必要的映射开销
4. 局部覆盖是特殊场景方案，大多数情况应通过全局 `componentLibrary` 统一切换

## 开发规范

| ✅ 推荐 | ❌ 禁止 |
|---------|---------|
| 特殊场景使用 `ComponentDriverProvider` | 将局部覆盖作为常规切换手段 |
| 按需 `enableXxx()` 启用组件 | 局部子树中直接 import 三方组件 |
| 全局切换用 `projectSetting` | 每个页面各自配置不同驱动 |
