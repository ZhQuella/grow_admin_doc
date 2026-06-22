---
title: 切换组件库
lang: zh-CN
---

# 切换组件库

Grow Admin 支持在 Element Plus、Naive UI、Ant Design Vue 三套 UI 组件库之间切换。切换时需要同时修改**两处配置**。

## 配置对照表

| 组件库 | `componentLibrary` | `vite preset` | 驱动包 |
|--------|-------------------|---------------|--------|
| Element Plus（默认） | `ComponentLibraryType.ElementPlus` | `'ele'` | `@grow-admin-rock/component-driver-element-plus` |
| Naive UI | `ComponentLibraryType.NaiveUI` | `'naive'` | `@grow-admin-rock/component-driver-naive` |
| Ant Design Vue | `ComponentLibraryType.AntDesignVue` | `'antd'` | `@grow-admin-rock/component-driver-antdv` |

| 配置位置 | 作用 | 影响范围 |
|----------|------|----------|
| `sample/src/projectSetting.ts` | 运行时加载哪个驱动包 | `Grow*` 组件实际渲染的 UI 库 |
| `sample/vite.config.ts` 的 `preset` | 构建时 `unplugin-vue-components` 的 resolver | 三方组件按需自动导入、样式预处理 |

::: danger 两处必须保持一致
只改一处会导致样式缺失或组件行为异常。
:::

## 切换流程（运行时）

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

## 切换到 Element Plus（默认）

**第一步** — `sample/src/projectSetting.ts`：

```typescript
import { ComponentLibraryType } from '@grow-admin-rock/types';

export const projectSetting: ProjectSetting = {
  componentLibrary: ComponentLibraryType.ElementPlus,
  // ...
};
```

**第二步** — `sample/vite.config.ts`：

```typescript
export default defineConfig(async ({ command, mode }) => {
  return await createViteConfig(command, mode, process.cwd(), { preset: 'ele' });
});
```

**第三步** — 重启开发服务器：

```bash
pnpm serve
```

控制台应输出：`[ComponentDriver] 已加载组件库驱动: element-plus`

::: info Message / Dialog 自动绑定
Element Plus 的 Message、Notification、Dialog 会在 `init-components-driver.ts` 中自动绑定（`ElMessage` / `ElNotification` / `ElMessageBox`），无需额外配置。
:::

## 切换到 Naive UI

**第一步** — `projectSetting.ts`：

```typescript
componentLibrary: ComponentLibraryType.NaiveUI,
```

**第二步** — `vite.config.ts`：

```typescript
{ preset: 'naive' }
```

**第三步** — 重启，确认控制台输出：`naive-ui`

::: info Provider 包裹
Naive UI 的 `useMessage()`、`useNotification()`、`useDialog()` 会在 `init-components-driver.ts` 中自动绑定；调用时须在 `GrowMessageProvider` 子树中。确保 `App.vue` 已正确包裹 Provider，参考 [命令式 API](/guide/development/imperative-api)。
:::

## 切换到 Ant Design Vue

**第一步** — `projectSetting.ts`：

```typescript
componentLibrary: ComponentLibraryType.AntDesignVue,
```

**第二步** — `vite.config.ts`：

```typescript
{ preset: 'antd' }
```

**第三步** — 重启，确认控制台输出：`ant-design-vue`

## 验证切换是否成功

1. 控制台出现 `[ComponentDriver] 已加载组件库驱动: xxx`
2. 页面中 `<GrowButton>`、`<GrowInput>` 渲染为对应 UI 库风格
3. 浏览器开发者工具中，对应 UI 库的 CSS 已加载（驱动包在入口自动引入样式）

## 按环境使用不同组件库

`projectSetting.ts` 在 `pnpm serve` 与 `pnpm build` 中均生效。若开发用 Element Plus、生产用 Naive UI，可在 `projectSetting.ts` 分支：

```typescript
export const projectSetting: ProjectSetting = {
  componentLibrary: import.meta.env.PROD
    ? ComponentLibraryType.NaiveUI
    : ComponentLibraryType.ElementPlus,
  // ...
};
```

`vite.config.ts` 也需按 `mode` 传入不同 `preset`，或通过 `.env.development` / `.env.production` 配合脚本选择。

## 常见问题

| 现象 | 原因 | 解决 |
|------|------|------|
| 组件无样式 | `preset` 与 `componentLibrary` 不一致 | 对照配置表同步修改两处 |
| 控制台报「缺少驱动」 | 未重启 dev server | 修改配置后重新 `pnpm serve` |
| 切换后组件行为异常 | 只改了 `projectSetting` 没改 `preset` | 两处必须同时切换 |
| `ComponentMap is not defined` | 驱动包构建缓存问题 | 清除缓存：`rm -rf sample/node_modules/.vite` |

## 局部覆盖（特殊场景）

若只是**某一个页面**要用与全局不同的 UI 库，不必改 `projectSetting`，用 `ComponentDriverProvider` 包裹子树即可。详见 [局部覆盖组件库](/guide/development/local-override)。

## 下一步

- [局部覆盖组件库](/guide/development/local-override) — 单页换库
- [Grow 契约组件使用](/guide/development/grow-components)
- [命令式 API](/guide/development/imperative-api)
