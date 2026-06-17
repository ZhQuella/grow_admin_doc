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
themeColor: '#8b5cf6',
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

## 运行时配置引导（bootstrapAppConfig）

`projectSetting.ts` 定义**静态默认值**，首次启动时由 `sample/src/initAppConfig.ts` 合并进 `useAppConfig()`：

```typescript
export function bootstrapAppConfig() {
  const storageKey = `${createStorageName(import.meta.env)}__APP_CONFIG`
  if (localStorage.getItem(storageKey)) return  // 已有持久化配置则跳过
  useAppConfig().$patch(mapProjectSettingToAppConfig(projectSetting))
}
```

| 要点 | 说明 |
|------|------|
| 存储 key | `{createStorageName(env)}__APP_CONFIG` |
| `themeMode` | 固定为 `ThemeModeEnum.SYSTEM`，**不来自** projectSetting |
| 已有 localStorage | 不会覆盖用户已保存的配置 |
| 重置 | 设置抽屉「重置配置」或清除 localStorage |

`mapProjectSettingToAppConfig` 映射的字段包括：`themeColor`、`permissionMode`、`transition`、`showSettingDrawer` 等，详见 `initAppConfig.ts`。

## 环境变量

通过 `sample/.env` / `.env.development` / `.env.production` 配置，类型定义在 `@grow-admin-rock/types` 的 `ViteEnv`：

| 变量 | 说明 |
|------|------|
| `VITE_USE_MOCK` | 是否启用 Mock |
| `VITE_PROXY` | 开发代理（`[prefix, target]` JSON） |
| `VITE_GLOB_API_URL` | API 基础地址（`getGlobalConfig` 读取） |
| `VITE_GLOB_APP_AUTH_MODE` | 认证模式（OAuth 等，需装配 settings + hooks） |
| `VITE_UNOCSS_TYPE` | UnoCSS 加载方式 |
| `VITE_DROP_CONSOLE` | 生产构建移除 console |
| `VITE_BUILD_COMPRESS` | 构建压缩（gzip 等） |
| `VITE_LEGACY` | 是否启用 legacy 插件 |

生产构建时，`createConfigPlugin` 会生成 `_app.config.js` 注入 `window.__PRODUCTION__*__CONF__`，供运行时读取全局配置。

## 可选模块：settings + hooks

`@grow-admin-rock/settings` 与 `@grow-admin-rock/hooks` 提供 `useGlobConfig`、`useBreakpoint`、OAuth 配置等能力。当前 **sample 宿主未默认装配**，若需 `useAuthMode()` / `useOAuth2Config()` 等，需在 `initIoc.ts` 中额外注册：

```typescript
import { Lib as settingsLib } from '@grow-admin-rock/settings'
import { Lib as hooksLib } from '@grow-admin-rock/hooks'

app.use(settingsLib, appContext).use(hooksLib, appContext)
```

## 下一步

- [主题与颜色](/guide/development/theme-and-colors) — CSS 变量、UnoCSS 语义色
- [主题与语言](/guide/development/theme-and-locale) — 登录页与设置抽屉切换
- [切换组件库](/guide/development/switch-component-library)
