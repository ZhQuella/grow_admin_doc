---
title: Grow 契约组件
lang: zh-CN
---

# Grow 契约组件使用

`Grow*` 契约组件是 Grow Admin 的核心 UI 抽象层。业务代码通过 `Grow` 前缀组件与 UI 库交互，无需关心底层是 Element Plus、Naive UI 还是 Ant Design Vue。

## 在页面中使用（README 示例）

契约组件以 **`Grow` 前缀**全局注册，模板中可直接使用：

```vue
<template>
  <GrowButton type="primary">提交</GrowButton>
  <GrowInput v-model="value" placeholder="请输入" />
  <GrowSelect v-model="selected" :options="options" />
</template>
```

在 `<script>` 中需要底层驱动组件时：

```typescript
import { useDriverComponent, RockComponent } from '@grow-admin-rock/components';

const Button = useDriverComponent(RockComponent.Button);
```

## 全局注册

契约组件在 `componentsLib.onSetup` 阶段根据驱动字典全局注册，可直接在模板中使用，无需手动 import：

```vue
<template>
  <GrowButton type="primary" @click="handleClick">提交</GrowButton>
  <GrowInput v-model="username" placeholder="用户名" />
  <GrowSelect v-model="selected" :options="options" />
  <GrowForm :model="formData" :rules="rules">
    <GrowFormItem label="姓名" prop="name">
      <GrowInput v-model="formData.name" />
    </GrowFormItem>
  </GrowForm>
</template>
```

## 组件列表

三库共有的 **84 个契约组件**，通过 `RockComponent` 枚举定义：

### 布局

`GrowLayout`、`GrowLayoutHeader`、`GrowLayoutFooter`、`GrowLayoutSider`、`GrowLayoutContent`、`GrowGrid`、`GrowGridItem`、`GrowSpace`、`GrowDivider`

### 导航

`GrowMenu`、`GrowBreadcrumb`、`GrowBreadcrumbItem`、`GrowTabs`、`GrowTab`、`GrowTabPane`、`GrowPagination`

### 数据录入

`GrowInput`、`GrowInputNumber`、`GrowInputGroup`、`GrowInputGroupLabel`、`GrowSelect`、`GrowTreeSelect`、`GrowCascader`、`GrowDatePicker`、`GrowCheckbox`、`GrowCheckboxGroup`、`GrowRadio`、`GrowRadioGroup`、`GrowRadioButton`、`GrowRadioButtonGroup`、`GrowSwitch`、`GrowUpload`、`GrowUploadDragger`、`GrowForm`、`GrowFormItem`、`GrowFormItemGi`、`GrowDynamicInput`、`GrowDynamicTags`、`GrowPopSelect`

### 数据展示

`GrowCard`、`GrowTag`、`GrowAvatar`、`GrowBadge`、`GrowEmpty`、`GrowDescriptions`、`GrowDescriptionsItem`、`GrowList`、`GrowListItem`、`GrowTree`、`GrowTable`、`GrowTableColumn`、`GrowTimeline`、`GrowTimelineItem`、`GrowStatistic`、`GrowNumberAnimation`、`GrowEllipsis`、`GrowText`、`GrowSkeleton`、`GrowResult`、`GrowProgress`、`GrowPageHeader`

### 反馈

`GrowModal`、`GrowDrawer`、`GrowDrawerContent`、`GrowPopover`、`GrowTooltip`、`GrowSpinner`

### 通用

`GrowButton`、`GrowButtonGroup`、`GrowDropdown`、`GrowConfig`、`GrowScrollbar`、`GrowThing`、`GrowElement`、`GrowGradientText`

### 标题

`GrowH1` ~ `GrowH6`

### Provider

`GrowMessageProvider`、`GrowNotificationProvider`、`GrowDialogProvider`、`GrowDialog`

## 在 script 中使用

### 获取驱动组件

当需要在 script 中引用底层组件（如动态组件、JSX）：

```typescript
import { useDriverComponent, RockComponent } from '@grow-admin-rock/components';

const Button = useDriverComponent(RockComponent.Button);
const Input = useDriverComponent(RockComponent.Input);
```

### 使用 ComponentMap

```typescript
import ComponentMap from '@grow-admin-rock/components/ComponentMap';

const buttonComponent = ComponentMap.get(RockComponent.Button);
```

## Provider 包裹

部分组件（尤其是 Naive UI 的命令式 API）需要在 Provider 子树中使用。在宿主根组件中包裹：

```vue
<template>
  <GrowConfig>
    <GrowNotificationProvider>
      <GrowMessageProvider>
        <GrowDialogProvider>
          <router-view />
        </GrowDialogProvider>
      </GrowMessageProvider>
    </GrowNotificationProvider>
  </GrowConfig>
</template>
```

## 开发规范

| ✅ 推荐 | ❌ 禁止 |
|---------|---------|
| 模板中使用 `<GrowButton>` | `import { ElButton } from 'element-plus'` |
| `useDriverComponent(RockComponent.Button)` | 直接引用三方组件 |
| 通过 `projectSetting` 切换后自动适配 | 在组件中硬编码 UI 库判断 |

## 预设业务组件

除三库共有契约外，`@grow-admin-rock/components` 还内置若干**预设组件**（`isPresetComponent`），用于搜索、列设置、图标等场景：

| 组件 | 文档 |
|------|------|
| `GrowSearchBar` | [SearchBar](/components/search-bar) |
| `GrowColumnBar` | [ColumnBar](/components/column-bar) |
| `GrowAbstractEle` | [AbstractEle](/components/abstract-ele) |
| `GrowIconify` / `GrowSplitPane` | [其他组件](/components/other) |

更多入口：[组件文档](/components/)。

## 不纳入契约的旧参考封装

以下为历史参考项目中的重封装方案，**不等于**本仓库已提供的组件名；落地时请以本仓库 `RockComponent` 与驱动为准：

| 名称 | 说明 |
|------|------|
| 参考版 `GrowTable`（vxe-table） | 若需 vxe-table 能力，请在业务侧自行封装，勿与契约 `GrowTable` 混淆 |
| `GrowCubeTable` | 基于 @antv/s2，尚未纳入 |
| 参考版独立 LocalePicker | 请用布局内 `LoginLanguageSwitch` / `SwitchLanguage` |

## 下一步

- [组件文档](/components/) — SearchBar / ColumnBar 等
- [命令式 API](/guide/development/imperative-api) — Message / Notification / Dialog
- [局部覆盖组件库](/guide/development/local-override)
- [开发规范](/guide/development/dev-conventions)
