---
title: 组件驱动架构
lang: zh-CN
---

# 组件驱动架构

Grow Admin 通过**组件驱动桥接层**实现业务代码与具体 UI 组件库的解耦。业务模块只使用 `Grow*` 契约组件，组件库切换在宿主应用中统一配置。

## 设计理念：为什么要组件驱动？

### 传统做法的问题

```vue
<!-- 业务代码直接绑定 Element Plus -->
<el-button type="primary">提交</el-button>
```

一旦遇到以下情况，成本陡增：

- 公司设计规范要求换 Naive UI / Ant Design Vue
- 不同子公司使用不同组件库，但共用同一套业务模块
- 升级 major 版本时 API 大面积变更

全局搜索替换不仅费时，还容易漏改样式、指令、命令式 API（`ElMessage` 等）。

### 桥接层解决什么？

Grow Admin 在业务与 UI 库之间插入**稳定契约层**：

```
业务 ──认识──▶ GrowButton ──映射──▶ ElButton / NButton / AButton
              （不变）              （可替换）
```

| 原则 | 含义 |
|------|------|
| **只抽象共有能力** | 84 个三库都有的组件，不虚构统一 API |
| **切换在宿主** | 业务包不安装、不感知具体 UI 库 |
| **局部可覆盖** | `ComponentDriverProvider` 应对特殊子树 |

### 带来的好处

- **业务模块可发布为纯净 npm 包**（peer 依赖 `@grow-admin-rock/components`）
- **切换 UI 库 ≈ 改宿主两处配置**（`projectSetting` + `vite preset`）
- **契约清单 = 兼容承诺**，超出 84 个的由业务自行封装，不污染框架

### 为什么不做一个「超级 UI 组件库」？

大而全的二次封装往往：

- Props 与原生库差异大，文档难维护
- 新库特性滞后，成为瓶颈
- 业务同学既要学 Grow API 又要学底层库

**驱动映射**比**重新发明组件**更轻：Grow 组件本身是薄包装，主要做名称统一与驱动查找，行为尽量透传底层库。

## 三层结构

```
业务代码 / 业务模块（apps-login 等）
        ↓
Grow* 契约组件（@grow-admin-rock/components）
        ↓
组件驱动桥接层（@grow-admin-rock/component-driver）
        ↓
具体驱动包（element-plus / naive-ui / ant-design-vue）
```

## 设计原则

1. **业务模块只使用 `Grow*` 契约组件**，禁止直接 `import element-plus` / `naive-ui` / `ant-design-vue`
2. **组件库切换在宿主应用统一配置**，业务模块无需关心底层实现
3. **支持全局一种组件库 + 局部子树覆盖另一种**（通过 `ComponentDriverProvider`）

### 运行时 vs 构建时：为何要两处配置？

| 配置 | 控制什么 | 若不一致会怎样 |
|------|----------|----------------|
| `projectSetting.componentLibrary` | 运行时 Grow 组件映射到哪个驱动 | 组件能渲染但行为怪异 |
| `vite.config preset` | 构建时三方组件自动导入、样式预处理 | 样式缺失、类型报错 |

运行时决定「画什么」，构建时决定「怎么打包」——**双轨一致**才能既切换自由又构建正确。

## 契约组件（Grow*）

`@grow-admin-rock/components` 定义了 `RockComponent` 枚举，涵盖三库共有的 **84 个组件**：

```typescript
export enum RockComponent {
  Button = 'Button',
  Input = 'Input',
  Select = 'Select',
  Form = 'Form',
  Table = 'Table',  // 注：Table 不在共有组件中
  // ... 共 84 个
}
```

契约组件以 `Grow` 前缀全局注册，可直接在模板中使用：

```vue
<template>
  <GrowButton type="primary">提交</GrowButton>
  <GrowInput v-model="value" placeholder="请输入" />
  <GrowSelect v-model="selected" :options="options" />
</template>
```

### 框架内置、无驱动映射的组件

| 组件 | 说明 |
|------|------|
| `GrowIconify` | 框架自实现 Iconify 封装，全局注册，无三库驱动映射 |

### 参考项目封装（不纳入契约层）

| 组件 | 说明 |
|------|------|
| `GrowTable` | 基于 vxe-table 的表格封装 |
| `GrowCubeTable` | 基于 @antv/s2 的多维表格 |
| `GrowLocalePicker` | 自定义语言切换器 |

若业务需要类似能力，请在 `DesignCornerstone` 中自行实现。

## 驱动加载流程

```
projectSetting.componentLibrary
        ↓
sample/src/init-components-driver.ts   ← 动态 import 对应驱动包
        ↓
driver.builder().enableAll()           ← 注册全部组件映射
        ↓
AppContext.DriverComponentDictionary
        ↓
componentsLib.onSetup → registerGrowComponent()  ← 全局注册 Grow* 组件
```

`init-components-driver.ts` 根据 `projectSetting.componentLibrary` 动态加载驱动：

```typescript
const driverFactories = {
  [ComponentLibraryType.ElementPlus]: async () => {
    const { EPComponentDriver } = await import('@grow-admin-rock/component-driver-element-plus');
    // 绑定 Message / Notification / Dialog
    return () => EPComponentDriver.builder().enableAll();
  },
  // NaiveUI、AntDesignVue 同理...
};
```

## 驱动包对照

| 组件库 | 驱动包 | 映射组件数 |
|--------|--------|-----------|
| Element Plus（默认） | `@grow-admin-rock/component-driver-element-plus` | 84 |
| Naive UI | `@grow-admin-rock/component-driver-naive` | 84 |
| Ant Design Vue | `@grow-admin-rock/component-driver-antdv` | 84 |

三个驱动包已对齐全部共有契约组件，切换 `componentLibrary` 即可在同一套业务代码下切换 UI 库。

## 在 script 中获取驱动组件

```typescript
import { useDriverComponent, RockComponent } from '@grow-admin-rock/components';

const Button = useDriverComponent(RockComponent.Button);
```

## Builder API

驱动包提供 Builder 模式，可按需启用组件：

```typescript
import { EPComponentDriver } from '@grow-admin-rock/component-driver-element-plus';

const driver = EPComponentDriver.builder()
  .enableButton()
  .enableInput()
  .enableDatePicker()
  .finish();
```

`enableAll()` 启用全部 84 个组件映射。

## 局部覆盖

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
    <GrowButton>局部 Naive 按钮</GrowButton>
  </ComponentDriverProvider>
</template>
```

详见 [局部覆盖组件库](/guide/development/local-override)。

## 开发规范

| ✅ 推荐 | ❌ 禁止 |
|---------|---------|
| 模板中使用 `<GrowButton>` 等契约组件 | 直接 `import { ElButton } from 'element-plus'` |
| 通过 `projectSetting.componentLibrary` 切换库 | 在业务模块内安装/切换驱动 |
| 特殊场景使用 `ComponentDriverProvider` | 绕过桥接层直接使用三方组件 |

## 下一步

- [架构设计理念](/guide/architecture/design-philosophy) — 组件驱动在整体架构中的权衡
- [切换组件库](/guide/development/switch-component-library) — 实操切换流程
- [Grow 契约组件使用](/guide/development/grow-components) — 组件用法与 API
- [命令式 API](/guide/development/imperative-api) — Message / Notification / Dialog
