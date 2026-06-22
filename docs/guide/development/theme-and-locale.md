---
title: 主题与语言
lang: zh-CN
---

# 主题与语言选择

主题与语言分为两套 UI：**登录页顶部工具栏**（`cornerstone-apps-login` 内专用组件）与 **项目配置抽屉**（`@grow-admin-rock/layouts`）。二者共用同一套运行时状态，切换会同步。

## 前置条件

宿主应用（`sample/src/plugin/initIoc.ts`）需注册：

```typescript
import { Lib as localeLib } from '@grow-admin-rock/locale'
import { Lib as stateLib } from '@grow-admin-rock/state'
import { Lib as componentsLib } from '@grow-admin-rock/components'

app
  .use(stateLib, appContext)
  .use(localeLib, appContext)
  .use(componentsLib, appContext)
```

根组件需挂载 `GrowMessageProvider` 等 Provider（参考 `sample/src/App.vue`）。

## 登录页：主题 / 语言

登录页使用本包专用组件，**不要**直接使用项目配置里的 `SwitchLanguage`。

| 组件 | 路径 | 说明 |
|------|------|------|
| `LoginThemeSwitch` | `cornerstone-apps-login/src/components/LoginThemeSwitch` | 暗色模式开关（亮色 ↔ 暗色） |
| `LoginLanguageSwitch` | `cornerstone-apps-login/src/components/LoginLanguageSwitch` | 语言下拉（简体中文 / English） |

```vue
<script setup lang="ts">
import { useLocale } from '@grow-admin-rock/locale'
import LoginThemeSwitch from '#/components/LoginThemeSwitch/index.vue'
import LoginLanguageSwitch from '#/components/LoginLanguageSwitch/index.vue'

const { getLocale } = useLocale()
</script>

<template>
  <div :key="getLocale">
    <LoginThemeSwitch />
    <LoginLanguageSwitch />
  </div>
</template>
```

参考：`DesignCornerstone/cornerstone-apps-login/src/pages/Login/index.vue`。

## 项目配置抽屉：主题 / 语言

完整主题（模式 + 主题色）与语言表单项在 `@grow-admin-rock/layouts`：

| 组件 | 导出 | 说明 |
|------|------|------|
| `SettingDrawer` | `@grow-admin-rock/layouts` | 项目配置抽屉（默认宽度 400px） |
| `SettingTheme` | `@grow-admin-rock/layouts` | 主题模式 + 主题色（`GrowForm`） |
| `SwitchLanguage` | `@grow-admin-rock/layouts` | 语言下拉（`GrowForm`） |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SettingDrawer, SettingTheme, SwitchLanguage } from '@grow-admin-rock/layouts'

const settingVisible = ref(false)
</script>

<template>
  <GrowButton @click="settingVisible = true">项目配置</GrowButton>
  <SettingDrawer v-model="settingVisible" />

  <!-- 也可单独拼装 -->
  <SettingTheme />
  <SwitchLanguage />
</template>
```

`SwitchLanguage` 可选 Props：

| Prop | 默认值 | 说明 |
|------|--------|------|
| `showLabel` | `true` | 是否显示表单项标签 |
| `labelKey` | `layout.setting.language` | i18n 标签 key |
| `selectClass` | `w-full` | 下拉框 class |

设置抽屉内点击「重置配置」会恢复主题默认值，并将语言重置为 **简体中文**（`zh_CN`）。

## 编程式调用

不渲染组件时，可直接操作状态 API：

```typescript
import { ThemeModeEnum } from '@grow-admin-rock/constants'
import { LOCALE, useLocale } from '@grow-admin-rock/locale'
import { useAppConfig } from '@grow-admin-rock/state'

const appConfig = useAppConfig()
appConfig.setThemeMode(ThemeModeEnum.DARK)
appConfig.setThemeColor('#8b5cf6')

const { changeLocale } = useLocale()
await changeLocale(LOCALE.zh)
await changeLocale(LOCALE.en)
```

| 能力 | 包 | API |
|------|-----|-----|
| 主题模式 / 主题色 | `@grow-admin-rock/state` | `useAppConfig()` |
| 语言切换 / 持久化 | `@grow-admin-rock/locale` | `useLocale().changeLocale()` |
| 文案 | `@grow-admin-rock/locale` | `useI18n().t('layout.login.*')` / `layout.setting.*` |

语言偏好保存在 `localStorage`（key：`LOCALE__`），登录页与项目配置抽屉共用。

## 文案扩展

在 `DesignRock/rock-locale/src/lang/` 下维护：

- 登录页：`zh-CN/layout/login.ts`、`en/layout/login.ts`
- 项目配置：`zh-CN/layout/setting.ts`、`en/layout/setting.ts`

新增语言时，同步修改 `rock-locale/src/config.ts` 的 `localeList` 与 `availableLocales`。

## 下一步

- [主题与颜色](/guide/development/theme-and-colors) — CSS 变量、UnoCSS 语义色
- [项目配置](/guide/development/project-setting) — 全局配置项
