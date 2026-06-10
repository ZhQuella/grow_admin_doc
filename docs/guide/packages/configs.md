---
title: 构建配置
lang: zh-CN
---

# configs 构建配置包说明

`configs/` 目录存放 Monorepo 共享的构建与工具配置，供 `sample` 宿主应用和所有 Rock / Cornerstone 包复用。

## 包总览

| 包名 | 职责 |
|------|------|
| `@grow-admin-config/vite` | 统一 Vite 构建配置 |
| `@grow-admin-config/tsconfig` | 共享 TypeScript 配置 |
| `@grow-admin-plugins/unplugin-auto-import` | 自动导入插件 |
| `@grow-admin-config/css-preprocess` | CSS 预处理（PostCSS） |

---

## @grow-admin-config/vite

统一 Vite 构建配置包，宿主应用通过 `createViteConfig` 函数获取完整配置。

### 使用方式

```typescript
// sample/vite.config.ts
import { createViteConfig } from '@grow-admin-config/vite';
import { defineConfig } from 'vite';

export default defineConfig(async ({ command, mode }) => {
  return await createViteConfig(command, mode, process.cwd(), { preset: 'ele' });
});
```

### preset 参数

`preset` 决定构建时使用的 UI 库自动导入策略，必须与 `projectSetting.componentLibrary` 一致：

| preset | 对应 UI 库 | 自动导入 resolver |
|--------|-----------|-------------------|
| `'ele'` | Element Plus | Element Plus resolver |
| `'naive'` | Naive UI | Naive UI resolver |
| `'antd'` | Ant Design Vue | Ant Design Vue resolver |

### 内置插件

| 插件 | 说明 |
|------|------|
| `@vitejs/plugin-vue` | Vue SFC 支持 |
| `@vitejs/plugin-vue-jsx` | JSX 支持 |
| `unplugin-vue-components` | 组件按需自动导入 |
| `unplugin-auto-import` | API 自动导入 |
| `vite-plugin-mock` | Mock 数据 |
| `vite-plugin-svg-icons` | SVG 图标 |
| `vite-plugin-compression` | Gzip 压缩 |
| `vite-plugin-html` | HTML 模板处理 |
| `unocss` | 原子化 CSS |
| `vite-plugin-monaco-editor` | Monaco 编辑器 |

### 预构建

根目录 `pnpm install` 后自动执行 `pnpm stub`，预构建此包：

```bash
pnpm --filter @grow-admin-config/vite prepack
```

---

## @grow-admin-config/tsconfig

共享 TypeScript 配置，提供多场景 tsconfig 基座：

| 文件 | 用途 |
|------|------|
| `base.json` | 基础 TS 配置 |
| `common-module.json` | 通用模块配置 |
| `server.json` | 服务端/脚本配置 |

各 Rock / Cornerstone 包的 `tsconfig.json` 通过 `extends` 引用：

```json
{
  "extends": "@grow-admin-config/tsconfig/common-module.json"
}
```

---

## @grow-admin-plugins/unplugin-auto-import

自动导入插件，根据 `preset` 自动导入 Vue API 和 UI 库 API。

**自动导入范围：**

- `vue`：ref、computed、watch 等
- `vue-router`：useRouter、useRoute 等
- `pinia`：defineStore、storeToRefs 等
- UI 库 API（根据 preset）

---

## @grow-admin-config/css-preprocess

CSS 预处理配置（PostCSS），处理样式兼容性。

```javascript
// postcss.js
module.exports = {
  plugins: {
    // autoprefixer 等
  }
};
```

---

## 目录结构

```
configs/
├── vite/
│   ├── src/
│   │   ├── index.ts           # createViteConfig 入口
│   │   ├── presets/
│   │   │   ├── ele.ts         # Element Plus preset
│   │   │   ├── naive.ts       # Naive UI preset
│   │   │   └── antd.ts        # Ant Design Vue preset
│   │   └── plugins/           # Vite 插件集合
│   ├── build.config.ts        # unbuild 配置
│   └── package.json
├── tsconfig/
│   ├── base.json
│   ├── common-module.json
│   └── server.json
├── grow-admin-autoimport/
│   └── src/                   # 自动导入插件源码
└── grow-admin-css-preprocess/
    └── postcss.js
```

## 自定义配置

如果需要在宿主应用中扩展 Vite 配置，可以在 `createViteConfig` 返回后合并：

```typescript
export default defineConfig(async ({ command, mode }) => {
  const config = await createViteConfig(command, mode, process.cwd(), { preset: 'ele' });
  return {
    ...config,
    server: {
      ...config.server,
      port: 3001,
    },
  };
});
```
