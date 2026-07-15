---
title: 工具 API 与注意点
lang: zh-CN
---

# 工具 API 与注意点

## 工具 API

从 `@grow-admin-rock/code-sandbox` 导出：

| 导出 | 说明 |
|------|------|
| `composeVueSfc` / `parseVueSfc` | 组装 / 解析 template、script、style |
| `createPreviewComponent` | 编译 SFC → 宿主可挂载组件（沙箱内部也用此函数） |
| `DEFAULT_SANDBOX_DEPENDENCIES` | 默认锁定依赖列表 |
| `mergeDependencies` / `normalizeDependencies` | 合并并规范化依赖 |
| `resolveActiveExpose` / `resolveNpmDependencies` | 按依赖解析 host / npm 暴露面 |
| `loadNpmModule` | 经 CDN 加载单个 npm 包 |

```ts
import { composeVueSfc, parseVueSfc } from '@grow-admin-rock/code-sandbox'

const code = composeVueSfc({
  template: `<div>{{ msg }}</div>`,
  script: `const msg = 'hi'`,
  style: `.x { color: red }`,
  scriptLang: 'ts',
  styleScoped: true,
})

const parts = parseVueSfc(code)
```

## 子路径导出

```ts
import { GrowCodeEditor } from '@grow-admin-rock/code-sandbox/code-editor'
import { GrowCodeDeps } from '@grow-admin-rock/code-sandbox/code-deps'
import { GrowCodeSandbox } from '@grow-admin-rock/code-sandbox/code-sandbox'
```

也可从包根导入同名组件。

## 沙箱内写页面注意点

1. **模板直接用 Grow 组件**：如 `GrowButton`，无需在 SFC 里 `import` 组件（依赖宿主全局注册）。
2. **script 里 import 包**：包名必须出现在 `expose.modules`（或默认锁定模块已注入）。
3. **scoped 样式**：沙箱会补挂 `__scopeId`，根节点可命中 scoped CSS。
4. **`GrowWatchBox` 高度**：插槽 `height` 首帧可能为 `0`，表格等需等有高度再挂载：

```vue
<template #default="{ height }">
  <GrowTable v-if="height > 0" :height="height + 'px'" ... />
</template>
```

## 相关

- [DesignRock — code-sandbox](/guide/packages/design-rock#grow-admin-rockcode-sandbox)
- [DesignCornerstone — apps-sandbox](/guide/packages/design-cornerstone#grow-admin-cornerstoneapps-sandbox)
- [组件文档](/components/)
