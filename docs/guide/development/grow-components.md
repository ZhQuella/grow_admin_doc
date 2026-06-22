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

`GrowCard`、`GrowTag`、`GrowAvatar`、`GrowBadge`、`GrowEmpty`、`GrowDescriptions`、`GrowDescriptionsItem`、`GrowList`、`GrowListItem`、`GrowTree`、`GrowTimeline`、`GrowTimelineItem`、`GrowStatistic`、`GrowNumberAnimation`、`GrowEllipsis`、`GrowText`、`GrowSkeleton`、`GrowResult`、`GrowProgress`、`GrowPageHeader`

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

## 不包含的组件（不纳入 84 个共有契约）

以下属于参考项目自行封装，**不纳入本项目契约层**。若业务需要，请在 `DesignCornerstone` 中自行实现：

| 组件 | 说明 |
|------|------|
| `GrowIconify` | 基于 Iconify 的自定义图标组件 |
| `GrowTable` | 基于 vxe-table 的表格封装 |
| `GrowCubeTable` | 基于 @antv/s2 的多维表格 |
| `GrowLocalePicker` | 自定义语言切换器（请用 `LoginLanguageSwitch` / `SwitchLanguage`） |

## 下一步

- [命令式 API](/guide/development/imperative-api) — Message / Notification / Dialog
- [局部覆盖组件库](/guide/development/local-override)
- [开发规范](/guide/development/dev-conventions)
