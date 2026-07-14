---
title: SearchBar 高级搜索栏
lang: zh-CN
---

# SearchBar 高级搜索栏

可组合查询条件的弹层搜索组件。以 Popover 触发，支持添加 / 删除条件、重置与恢复系统默认。

- 组件：`GrowSearchBar`
- 包路径：`@grow-admin-rock/components/search-bar`
- 类型：预设组件（`RockComponent.SearchBar`）
- 演示：功能示例 → **高级搜索栏**

## 基础用法

```vue
<template>
  <GrowSearchBar :search="searchList" @search="onSearch" />
</template>

<script setup lang="ts">
import type { SearchBarField } from '@grow-admin-rock/components/search-bar'
import { GrowSearchBar } from '@grow-admin-rock/components/search-bar'

const searchList: SearchBarField[] = [
  {
    labelText: '账号',
    placeholder: '请输入账号',
    elType: 'GrowInput',
    isDefault: true,
    model: 'account',
    noDelete: true,
  },
  {
    labelText: '创建日期',
    elType: 'GrowDatePicker',
    isDefault: true,
    type: 'daterange',
    model: 'createDate',
    valueFormat: 'YYYY-MM-DD',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
  },
  {
    labelText: '状态',
    elType: 'GrowSelect',
    isDefault: true,
    model: 'status',
    multiple: true,
    label: 'label',
    value: 'code',
    options: [
      { label: '启用', code: '1' },
      { label: '禁用', code: '0' },
    ],
  },
]

function onSearch(data: Recordable) {
  // data 已经过 formatConversion 处理
  console.log(data)
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `search` | `SearchBarField[]` | `[]` | 可选查询字段配置 |
| `defaultData` | `object` | `{}` | 重置时的默认值 |

### SearchBarField

| 字段 | 类型 | 说明 |
|------|------|------|
| `labelText` | `string` | 条件下拉展示名 |
| `model` | `string` | 字段名（支持点路径，最终交给 `formatConversion`） |
| `elType` | `string` | 渲染控件，如 `GrowInput` / `GrowSelect` / `GrowDatePicker` |
| `isDefault` | `boolean` | 打开时是否默认展示该条件 |
| `noDelete` | `boolean` | 是否禁止删除（需配合 `isDefault`） |
| `options` / `label` / `value` | — | Select 选项及字段映射 |
| 其他 | — | 透传给对应 Grow 控件（如 `placeholder`、`type`、`multiple`） |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `search` | `(data: object)` | 查询 / 重置 / 系统默认后触发，返回转换后的查询对象 |

## Slots

| 插槽 | 说明 |
|------|------|
| `option` | 弹层底部左侧扩展操作区 |

## 行为说明

1. 值控件下拉默认 `teleported: true`，避免被弹层高度裁切。
2. 点击外挂下拉（Select / DatePicker）时会拦截 Popover 误关闭。
3. 查询结果会通过 `@grow-admin-rock/utils` 的 `formatConversion` 转换后再抛出。

## 相关

- [AbstractEle](/components/abstract-ele) — 动态渲染条件值控件
- 文案：`SEARCH_BAR.*`、`PUBLIC.SEARCH_TEXT`、`PUBLIC.RESET_TEXT`
