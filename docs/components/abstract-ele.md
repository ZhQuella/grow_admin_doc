---
title: AbstractEle 动态表单项
lang: zh-CN
---

# AbstractEle 动态表单项

按配置动态渲染 Grow 表单控件，常用于 SearchBar 条件值区域。

- 组件：`GrowAbstractEle`
- 包路径：`@grow-admin-rock/components/abstract-ele`
- 类型：预设组件（`RockComponent.AbstractEle`）

## 基础用法

```vue
<template>
  <GrowAbstractEle :search-data="form" :config="config" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { AbstractEleConfig } from '@grow-admin-rock/components/abstract-ele'

const form = reactive({ account: '', status: [] })

const config: AbstractEleConfig = {
  model: 'account',
  elType: 'GrowInput',
  placeholder: '请输入账号',
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `searchData` | `object` | `{}` | 值对象；`v-model` 绑定到 `searchData[config.model]` |
| `config` | `AbstractEleConfig` | `{ model: '' }` | 控件配置 |

### AbstractEleConfig

| 字段 | 类型 | 说明 |
|------|------|------|
| `model` | `string` | 绑定字段名 |
| `elType` | `string` | 组件名，如 `GrowInput`、`GrowSelect`、`GrowDatePicker` |
| `options` | `array` | Select 选项源 |
| `label` / `value` | `string` | 选项展示 / 值字段，默认 `label` / `value` |
| 其他 | — | 透传给目标控件（并强制 `teleported: true`） |

## 说明

1. Select 会把 `options` 规范为 `{ label, value }`，兼容自定义 `label` / `value` 字段名。
2. 不负责布局，父级需自行约束宽度（如 SearchBar 中的固定 value 列）。
3. 一般由 SearchBar 内部使用，也可单独用于动态表单场景。

## 相关

- [SearchBar](/components/search-bar)
