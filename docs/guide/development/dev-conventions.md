---
title: 开发规范
lang: zh-CN
---

# 开发规范

本文汇总 README 中的**推荐做法与禁止事项**，以及日常开发常用命令。写业务代码前扫一眼，能避免大部分架构踩坑。

## 推荐 vs 禁止

| ✅ 推荐 | ❌ 禁止 |
|---------|---------|
| 模板中使用 `<GrowButton>` 等 `Grow*` 契约组件 | 直接 `import { ElButton } from 'element-plus'` |
| 通过 `projectSetting.componentLibrary` 切换 UI 库 | 在业务模块内安装或切换驱动 |
| 业务模块 peer 依赖 `@grow-admin-rock/components` | 业务模块直接依赖三方 UI 库 |
| 特殊场景使用 `ComponentDriverProvider` | 绕过桥接层直接使用三方组件 |
| `useMessage()` / `useNotice()` / `useDialog()` 统一调用 | 直接 `import { ElMessage }` 等三方 API |
| 通过 `library.ts` 声明模块路由与能力 | 在宿主里 deep import 业务内部实现 |
| 动态路由：`config.ts` 与 `.vue` 分离 | Mock 文件里 import 页面组件 |
| 通过 IoC 获取 `router`（`RouteTable`） | 布局/工具里随意混用全局单例 |

更细的说明见：

- [Grow 契约组件](/guide/development/grow-components)
- [命令式 API](/guide/development/imperative-api)
- [局部覆盖组件库](/guide/development/local-override)
- [业务模块开发](/guide/development/business-module)

---

## 常用命令

与根目录 `package.json` / README 一致：

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装依赖（自动 `postinstall` → `pnpm stub`） |
| `pnpm serve` | 启动 sample 示例应用（默认 `http://localhost:3000`） |
| `pnpm build` | 生产构建（`scripts/build.ts --all`） |
| `pnpm stub` | 预构建 `@grow-admin-config/vite` 配置包 |
| `pnpm clean` | Turbo clean + 删除根 `node_modules` |
| `pnpm dev` | 交互式选择 workspace 包并行 dev |
| `pnpm turbo:build` | Turbo 并行构建所有包 |
| `pnpm turbo:dev` | Turbo 并行启动各包 dev |
| `pnpm turbo:preview` | Turbo 并行预览构建产物 |

仅操作 sample：

```bash
pnpm --filter grow-admin-sample dev
pnpm --filter grow-admin-sample build
pnpm --filter grow-admin-sample preview
```

---

## 业务模块依赖声明

业务包 `package.json` 示例（与 README 一致）：

```json
{
  "peerDependencies": {
    "vue": "~3.3.4",
    "@grow-admin-rock/components": "workspace:*"
  },
  "devDependencies": {
    "@grow-admin-rock/components": "workspace:*"
  }
}
```

业务模块**不需要**自行安装组件驱动，由宿主 `installComponentDriver` 完成。

---

## 宿主装配顺序（要点）

`sample/src/plugin/initIoc.ts` 中：

1. **先** `installComponentDriver`（定 UI 库、绑定 Message 等）
2. **再** `.use()` 各 Library（请求、状态、路由、业务模块…）
3. **最后** `componentsLib`（注册 Grow 组件，依赖驱动字典）
4. `appContext.load()` 后挂载 `router`

顺序错误会导致 Grow 组件找不到驱动映射。完整列表见 [IOC 模块化](/guide/architecture/ioc)。

---

## 84 个共有契约组件

三个驱动包已对齐全部 **84 个**三库共有 `Grow*` 组件。切换 `projectSetting.componentLibrary`（并同步 `vite preset`）即可换 UI 库，**页面里的 Grow 组件写法不用改**。

### 不纳入契约层的能力

以下属于参考项目或业务自行封装，**不要放进 `rock-components` 契约层**：

| 组件 | 说明 |
|------|------|
| `GrowIconify` | 基于 Iconify 的图标（若项目已全局注册，仍建议业务侧按需封装） |
| `GrowTable` | 基于 vxe-table 的表格 |
| `GrowCubeTable` | 基于 @antv/s2 的多维表格 |
| `GrowLocalePicker` | 自定义语言切换器（请用 `LoginLanguageSwitch` / `SwitchLanguage`） |

若业务需要类似能力，在 `DesignCornerstone` 业务模块中实现。

---

## 相关包速查

| 包名 | 职责 |
|------|------|
| `@grow-admin-rock/components` | `RockComponent` 枚举、`Grow*` 契约组件、`ComponentMap` |
| `@grow-admin-rock/layouts` | 布局壳：`SettingDrawer`、`SettingTheme`、`SwitchLanguage` 等 |
| `@grow-admin-rock/locale` | `useI18n`、`useLocale`、语言包与持久化 |
| `@grow-admin-rock/state` | `useAppConfig`、`useTheme`、`useAuthStore`（含 `backMenuList`） |
| `@grow-admin-rock/middleware-router` | 路由表 IoC、`RouteTable`、`RouteOperator` |
| `@grow-admin-rock/styles` | 全局 CSS 变量、UnoCSS 入口、主题过渡 |
| `@grow-admin-rock/code-sandbox` | Monaco 编辑器、依赖注入、Vue SFC 沙箱预览 |
| `@grow-admin-rock/designer` | 低代码页面设计器（`GrowDesigner` / `GrowRenderer`） |
| `@grow-admin-rock/report-designer` | 报表设计器（`GrowReportDesigner` / `GrowReportRenderer`） |
| `@grow-admin-rock/schema-designer` | 可视化数据库建模（`GrowSchemaDesigner`） |
| `@grow-admin-rock/constants` | `APP_THEME_COLOR_LIST` 等设计常量 |
| `@grow-admin-rock/component-driver` | 抽象驱动、`ComponentDriverProvider`、Builder |
| `@grow-admin-rock/component-driver-element-plus` | Element Plus 映射（84 个） |
| `@grow-admin-rock/component-driver-naive` | Naive UI 映射（84 个） |
| `@grow-admin-rock/component-driver-antdv` | Ant Design Vue 映射（84 个） |

更完整的 Rock 包列表见 [DesignRock 核心层](/guide/packages/design-rock)。
