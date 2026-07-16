---
title: ColumnBar 表格列设置
lang: zh-CN
---

# ColumnBar 表格列设置

用树形勾选配置表格列显隐，支持多级 `children` 表头。关闭弹层或点确认时回写列配置。

- 组件：`GrowColumnBar`
- 包路径：`@grow-admin-rock/components/column-bar`
- 类型：预设组件（`RockComponent.ColumnBar`）
- 演示：功能示例 → **表格列设置**

## 基础用法

```vue
<template>
  <GrowColumnBar :columns="tableColumns" @confirm="onConfirm" />
  <GrowTable :data="tableData" border>
    <!-- 按 visible / children 渲染列 -->
  </GrowTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ColumnBarItem } from '@grow-admin-rock/components/column-bar'
import { GrowColumnBar } from '@grow-admin-rock/components/column-bar'

const tableColumns = ref<ColumnBarItem[]>([
  { title: '序号', field: 'serial', visible: true },
  { title: '账号', field: 'account', visible: true },
  {
    title: '状态信息',
    field: 'statusGroup',
    visible: true,
    children: [
      { title: '账号状态', field: 'status', visible: true },
      { title: '创建日期', field: 'createDate', visible: true },
    ],
  },
  { title: '操作', field: 'operate', visible: true },
])

function onConfirm(columns: ColumnBarItem[]) {
  tableColumns.value = columns
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `ColumnBarItem[]` | `[]` | 列配置树 |
| `nodeKey` | `string` | `'field'` | 节点唯一键字段 |

### ColumnBarItem

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 列标题（树节点文案） |
| `field` | `string` | 列字段 / 节点 key（由 `nodeKey` 指定） |
| `visible` | `boolean` | 是否显示，默认视为 `true` |
| `disabled` | `boolean` | 是否禁用勾选（也可由内部规则写入） |
| `children` | `ColumnBarItem[]` | 多级表头子列 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `confirm` | `(columns: ColumnBarItem[])` | 点击确认 / 系统默认时回传列树（已更新 `visible`） |

## 内置规则

- `field` 为 `serial` / `operate` 的节点会自动 `disabled`，不可取消勾选。
- 支持全选 / 半选；「系统默认」恢复**首次传入**的列显隐（不会被后续确认覆盖）。
- 弹层打开后会再同步勾选（兼容 Popover 懒挂载）。
- 点击「确认」或「系统默认」时触发 `confirm` 并关闭弹层。

## 与 GrowTable 配合

ColumnBar 只负责列配置；表格展示请用 `GrowTable`（或业务表格）根据 `visible` / `children` 渲染。样例见 `cornerstone-apps-feat` 的 `pages/column-bar`。

## 相关

- [其他组件](/components/other)
- 文案：`COLUMN_BAR.SELECT_ALL`、`SEARCH_BAR.RESET_SYETEM`、`PUBLIC.CONFIRM_TEXT`
