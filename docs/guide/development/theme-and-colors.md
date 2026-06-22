---
title: 主题与颜色
lang: zh-CN
---

# 主题与颜色

框架通过 **CSS 变量 + Pinia 状态 + 三库 Config 驱动** 统一管理主题。开发时修改颜色，通常只需动下面几处；运行时用户在「项目配置」抽屉中选色会写入 `localStorage`，可能覆盖你改过的默认值。

## 架构概览

```
sample/src/projectSetting.ts          ← 宿主静态默认配置（themeColor 等）
        ↓ 首次启动 merge
@grow-admin-rock/state (useAppConfig) ← 运行时状态 + localStorage 持久化
        ↓ useTheme()
:root / :root.dark CSS 变量            ← @grow-admin-rock/styles
        ↓ GrowConfig 驱动
Element Plus / Naive UI / Ant Design Vue 主色与 hover/active
```

| 包 | 职责 |
|----|------|
| `@grow-admin-rock/styles` | `:root` 变量、亮/暗 token、主题切换过渡动画 |
| `@grow-admin-rock/state` | `themeMode`（亮/暗/跟随系统）、`themeColor`、动态写入 DOM |
| `@grow-admin-rock/layouts` | `SettingDrawer` 等项目配置 UI |
| `@grow-admin-rock/constants` | 预设色板 `APP_THEME_COLOR_LIST` |
| `configs/vite` UnoCSS | 语义类名 `bg-layout`、`text-text`、`bg-primary` 等 |

## 修改默认主题色

**推荐只改宿主应用的 `projectSetting.ts`：**

```typescript
// sample/src/projectSetting.ts
export const projectSetting: ProjectSetting = {
  themeColor: '#8b5cf6', // ← 改这里
  // ...
}
```

首次访问（`localStorage` 尚无 `APP_CONFIG`）时，`sample/src/initAppConfig.ts` 会把该值 merge 进 `useAppConfig`。

若本地已有持久化配置，需清除站点 `localStorage` 或在设置抽屉点击「重置配置」才能看到新默认值。

Pinia 内置默认值在 `DesignRock/rock-state/src/modules/appConfig.ts` 的 `themeColor`，一般**不必改**；以宿主 `projectSetting.ts` 为准即可。

## 增加 / 修改设置抽屉中的可选主题色

设置抽屉的色块来自常量 **`APP_THEME_COLOR_LIST`**：

```typescript
// DesignRock/rock-constants/src/designSetting.ts
export const APP_THEME_COLOR_LIST: string[] = [
  '#8b5cf6', // 第一项建议与默认 themeColor 一致
  '#0084f4',
  // 追加新颜色…
]
```

修改后重启 `pnpm serve` 即可；无需改 `SettingDrawer` 组件逻辑。

## 修改 CSS 变量

全局 design token 在 **`DesignRock/rock-styles/src/variables.css`**：

```css
:root {
  --primary-color: #8b5cf6;
  --primary-color-hover: #a78bfa;
  --primary-color-active: #7c3aed;
  --text-color: rgba(0, 0, 0, 0.85);
  --layout-container-background-color: #f0f2f5;
}

:root.dark {
  --text-color: rgba(255, 255, 255, 0.85);
  --layout-container-background-color: rgb(16, 16, 20);
}
```

::: tip 注意
- 运行时切换 `themeColor` 时，`useTheme` 会按主色**自动计算** hover / active 及 Element Plus 的 `--el-color-primary-light-*`，并写入 `:root` 行内样式。
- `variables.css` 里的 `--primary-color-hover` 等主要作**首屏回退**；动态主色以 JS 计算结果为准。
- 新增语义变量时，建议在 `:root` 与 `:root.dark` 各写一套。
:::

## 在页面中使用颜色（UnoCSS）

UnoCSS 已映射到 CSS 变量（`configs/vite/src/plugins/unocss.ts`），**无需写 `dark:` 前缀**，亮/暗随 `:root.dark` 自动切换：

| UnoCSS 类 | 含义 |
|-----------|------|
| `bg-primary` / `text-primary` | 主题主色 |
| `bg-layout` | 页面背景 |
| `bg-component` | 卡片 / 面板背景 |
| `text-text` | 主文字 |
| `text-muted` / `text-text-secondary` | 次要文字 |
| `border-border` | 边框 |
| `shadow-card` | 卡片阴影（随主题变化） |
| `surface-panel` | shortcut：`bg-component border border-border rounded-lg` |

示例（参考 `cornerstone-apps-login` 登录页）：

```vue
<template>
  <div class="min-h-screen bg-layout text-text">
    <div class="surface-panel shadow-card p-8">
      <h1 class="text-2xl font-semibold text-primary">标题</h1>
      <p class="text-muted">说明文字</p>
    </div>
  </div>
</template>
```

**新增 UnoCSS 语义色：** 在 `configs/vite/src/plugins/unocss.ts` 的 `theme.colors` 增加映射，并在 `variables.css` 定义对应变量：

```typescript
// configs/vite/src/plugins/unocss.ts
theme: {
  colors: {
    accent: 'var(--accent-color)', // 新增
  },
},
```

```css
/* rock-styles/src/variables.css */
:root { --accent-color: #f59e0b; }
:root.dark { --accent-color: #fbbf24; }
```

修改 UnoCSS 配置后需重启 dev server。

## 三库主色同步

`GrowConfig` 驱动会在运行时注入当前主题色及 hover/active：

| 组件库 | 实现位置 |
|--------|----------|
| Element Plus | `html.dark` + `--el-color-primary*` CSS 变量 |
| Naive UI | `rock-component-driver-naive/src/components/Config.vue` |
| Ant Design Vue | `rock-component-driver-antdv/src/components/Config.vue` |

业务代码使用 `GrowButton type="primary"` 等即可，**不要**在业务里单独写各库主色。

Ant Design Vue 构建期 Less 变量在 `configs/vite/src/presets/antd.ts` 的 `primary-color`；若默认主色与线上一致，可同步修改该文件（主要影响构建期 antd 基础样式）。

## 主题模式（亮 / 暗 / 跟随系统）

| 配置项 | 位置 | 说明 |
|--------|------|------|
| 默认模式 | `initAppConfig` → `themeMode: ThemeModeEnum.SYSTEM` | 跟随系统 |
| 运行时切换 | 登录页 `LoginThemeSwitch` / 设置抽屉 `SettingTheme` | 写入 `useAppConfig` |
| 暗色 class | `html.dark` | UnoCSS `dark:` 与 EP 暗色变量均依赖此类 |
| 切换动画 | `rock-styles/src/theme-transition.css` | 约 0.35s，可在 `variables.css` 调整 `--theme-transition-duration` |

## 开发自检清单

1. 改完 `projectSetting.themeColor` 后，清除 `localStorage` 或使用无痕窗口验证默认值。
2. 在设置抽屉切换色块，确认按钮 hover、主色、UnoCSS `text-primary` 同步变化。
3. 切换亮/暗模式，确认 `:root.dark` 下布局背景、文字、卡片阴影正常。
4. 切换 `componentLibrary` 后，主色在三库下表现一致。

## 下一步

- [主题与语言](/guide/development/theme-and-locale) — 登录页与设置抽屉中的主题/语言切换
- [项目配置](/guide/development/project-setting) — 全局配置项说明
