---
title: 快速上手
lang: zh-CN
---

# 快速上手

本文将引导你在本地运行 Grow Admin 示例应用，并了解基本的开发流程。

## 前置知识

建议在开始之前掌握以下基础知识：

- [Vue 3](https://cn.vuejs.org/) — 组合式 API、响应式原理
- [TypeScript](https://www.typescriptlang.org/) — 类型系统、泛型
- [Vite](https://cn.vitejs.dev/) — 构建工具与开发服务器
- [Pinia](https://pinia.vuejs.org/zh/) — 状态管理
- [Vue Router 4](https://router.vuejs.org/zh/) — 路由与导航守卫

对 Inversify 依赖注入有基本了解会更容易理解模块装配机制，但并非硬性要求。

## 环境要求

| 工具 | 版本要求 |
|------|----------|
| Node.js | ≥ 18（推荐 LTS） |
| pnpm | ≥ 8（项目锁定 `pnpm@10.32.1`） |
| Git | 任意较新版本 |

::: warning 提示
如果需要在多个 Node 版本之间切换，推荐使用 [nvm](https://github.com/nvm-sh/nvm) 或 [fnm](https://github.com/Schniz/fnm)。
:::

## 步骤 1：克隆与安装

```bash
# 克隆仓库
git clone https://github.com/ZhQuella/grow_admin.git

# 进入项目目录
cd grow_admin

# 安装依赖（必须使用 pnpm）
pnpm install
```

`pnpm install` 会自动执行 `postinstall` 钩子，预构建 `@grow-admin-config/vite` 配置包。

## 步骤 2：启动开发服务器

```bash
pnpm serve
```

默认访问地址：**http://localhost:3000**

启动成功后，控制台应输出类似信息：

```
[ComponentDriver] 已加载组件库驱动: element-plus
```

这表示组件驱动桥接层已正确加载（默认使用 Element Plus）。

## 步骤 3：验证功能

启动后可以验证以下内容：

1. 页面正常渲染，`<GrowButton>`、`<GrowInput>` 等契约组件显示为 Element Plus 风格
2. 访问 `/` 路由，查看登录模块页面（支持主题/语言切换）
3. 登录后进入 `/home` 布局，侧边栏显示树形菜单
4. 点击「工作台」跳转至 `/home/workspace`，页面正常渲染
5. 直接访问 `/home/workspace` URL，确认动态路由已正确注册
5. 在设置抽屉或登录页测试 Message / Notification（参考 [命令式 API](/guide/development/imperative-api)）

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm serve` | 启动 sample 示例应用开发服务器 |
| `pnpm dev` | 交互式选择 workspace 包并行启动 dev（`scripts/dev.ts`） |
| `pnpm build` | 生产构建全部包（`scripts/build.ts --all`） |
| `pnpm stub` | 预构建 Vite 配置包 |
| `pnpm clean` | Turbo clean + 删除根 `node_modules` |
| `pnpm turbo:build` | 使用 Turbo 并行构建所有包 |
| `pnpm turbo:dev` | 使用 Turbo 并行启动所有包的 dev 模式 |
| `pnpm turbo:preview` | 使用 Turbo 并行预览构建产物 |

### sample 应用独立命令

在 `sample/` 目录下也可以直接运行：

```bash
# 开发
pnpm --filter grow-admin-sample dev

# 构建
pnpm --filter grow-admin-sample build

# 预览构建产物
pnpm --filter grow-admin-sample preview
```

## 项目入口说明

应用启动流程如下：

```
sample/src/main.ts
    ↓ createApp(App)
sample/src/plugin/initIoc.ts
    ↓ installComponentDriver()   ← 加载组件驱动
    ↓ IocPlugin + 各 Library     ← 装配 IOC 模块
    ↓ appContext.load()          ← 加载 IOC 容器
    ↓ bootstrapAppConfig()       ← 合并 projectSetting（首次）
    ↓ router.isReady()           ← 路由就绪后挂载
    ↓ removeAppLoading()         ← 移除首屏 loading（双 rAF）
```

关键文件：

| 文件 | 职责 |
|------|------|
| `sample/src/main.ts` | 应用入口 |
| `sample/src/plugin/initIoc.ts` | IOC 初始化与模块装配 |
| `sample/src/init-components-driver.ts` | 组件驱动加载 |
| `sample/src/projectSetting.ts` | 项目全局配置（含组件库选择） |
| `sample/vite.config.ts` | Vite 构建配置（含 preset） |

## 下一步

- 了解 [项目结构](/guide/architecture/project-structure) 与 Monorepo 分层
- 阅读 [IOC 模块化](/guide/architecture/ioc) 理解模块装配机制
- 学习 [路由与菜单](/guide/architecture/routing-and-menu) 了解动态路由注册
- 学习 [切换组件库](/guide/development/switch-component-library) 在三套 UI 库之间切换
