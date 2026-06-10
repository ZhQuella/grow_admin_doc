---
title: 项目配置
lang: zh-CN
---

# 项目配置

Grow Admin 的全局配置集中在宿主应用的 `sample/src/projectSetting.ts` 中，类型为 `ProjectSetting`（来自 `@grow-admin-rock/types`）。

## 配置文件位置

```
sample/src/projectSetting.ts
```

该文件在开发和生产构建中均生效，是控制框架行为的核心入口。

## 核心配置项

### 组件库选择

```typescript
import { ComponentLibraryType } from '@grow-admin-rock/types';

export const projectSetting: ProjectSetting = {
  componentLibrary: ComponentLibraryType.ElementPlus,
  // ...
};
```

可选值：

| 枚举值 | 对应 UI 库 |
|--------|-----------|
| `ComponentLibraryType.ElementPlus` | Element Plus（默认） |
| `ComponentLibraryType.NaiveUI` | Naive UI |
| `ComponentLibraryType.AntDesignVue` | Ant Design Vue |

::: warning 两处配置必须一致
`componentLibrary` 控制运行时驱动，`vite.config.ts` 的 `preset` 控制构建时自动导入。两处必须保持一致，详见 [切换组件库](/guide/development/switch-component-library)。
:::

### 权限模式

```typescript
permissionMode: PermissionModeEnum.ROUTE_MAPPING,
permissionCacheType: CacheTypeEnum.LOCAL,
```

### 主题与布局

```typescript
themeColor: '#0960bd',
contentMode: ContentLayoutEnum.FULL,
showLogo: true,
showFooter: false,
showDarkModeToggle: true,
showSettingButton: true,
showSettingDrawer: true,
```

### 顶栏配置（headerSetting）

```typescript
headerSetting: {
  color: '#fff',
  bgColor: '#151515',
  fixed: true,
  show: true,
  theme: ThemeEnum.DARK,
  showFullScreen: true,
  useLockPage: true,
  showDoc: true,
  showNotice: true,
  showSearch: true,
  showLocalePicker: true,
},
```

### 菜单配置（menuSetting）

```typescript
menuSetting: {
  bgColor: '#001529',
  fixed: true,
  collapsed: false,
  menuWidth: 210,
  mode: MenuModeEnum.INLINE,
  type: MenuTypeEnum.SIDEBAR,
  theme: ThemeEnum.DARK,
  trigger: TriggerEnum.HEADER,
  accordion: true,
},
```

菜单类型 `MenuTypeEnum` 支持：

| 值 | 说明 |
|----|------|
| `SIDEBAR` | 左侧菜单 |
| `MIX` | 混合菜单 |
| `TOP_MENU` | 顶部菜单 |

### 多标签页（multiTabsSetting）

```typescript
multiTabsSetting: {
  cache: false,
  show: true,
  showQuick: true,
  canDrag: true,
  showRedo: true,
  showFold: true,
},
```

### 路由过渡（transitionSetting）

```typescript
transitionSetting: {
  enable: true,
  basicTransition: RouterTransitionEnum.FADE_SIDE,
  openPageLoading: true,
  openNProgress: true,
},
```

### 其他常用项

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `openNProgress` | `true` | 页面切换进度条 |
| `openKeepAlive` | `true` | 页面缓存 |
| `showBreadCrumb` | `true` | 面包屑导航 |
| `canEmbedIFramePage` | `true` | 内嵌 iframe 页面 |
| `sessionTimeoutProcessing` | `ROUTE_JUMP` | 会话超时处理方式 |
| `grayMode` | `false` | 灰色模式 |
| `colorWeak` | `false` | 色弱模式 |

## 按环境区分配置

若需开发环境与生产环境使用不同组件库：

```typescript
export const projectSetting: ProjectSetting = {
  componentLibrary: import.meta.env.PROD
    ? ComponentLibraryType.NaiveUI
    : ComponentLibraryType.ElementPlus,
  // ...
};
```

对应的 `vite.config.ts` 也需按 `mode` 传入不同 `preset`。

## Vite 配置

`sample/vite.config.ts` 使用共享配置包：

```typescript
import { createViteConfig } from '@grow-admin-config/vite';
import { defineConfig } from 'vite';

export default defineConfig(async ({ command, mode }) => {
  return await createViteConfig(command, mode, process.cwd(), { preset: 'ele' });
});
```

`preset` 可选值：`'ele'` | `'naive'` | `'antd'`，必须与 `componentLibrary` 一致。

## 下一步

- [切换组件库](/guide/development/switch-component-library)
- [Grow 契约组件使用](/guide/development/grow-components)
