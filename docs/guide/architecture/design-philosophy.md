---
title: 架构设计理念
lang: zh-CN
---

# 架构设计理念

Grow Admin 不是「把 Vue Admin 模板拆成几个文件夹」，而是一套围绕**可组合、可替换、可演进**目标设计的 Monorepo 框架。本章说明核心设计决策背后的动机，以及这些决策带来的长期收益。

阅读本章后，你会更容易理解：为什么要有 Rock / Cornerstone 分层、为什么要 IOC、为什么要组件驱动、为什么路由要动静分离。

## 设计目标

| 目标 | 含义 |
|------|------|
| **框架与业务解耦** | 换业务不换框架，换框架少动业务 |
| **模块可独立演进** | 登录、首页、工作区可单独开发、测试、发版 |
| **技术选型可替换** | UI 库、HTTP 层、宿主部署方式可在边界处替换 |
| **约定优于配置** | Library 契约、Grow* 组件、路由 meta 降低协作成本 |

## 与传统 Admin 模板的对比

```
传统单应用 Admin                    Grow Admin
─────────────────                  ─────────────────
src/views/ 全部堆在一起      →      DesignCornerstone 按业务能力分包
直接 import Element Plus     →      Grow* 契约 + 驱动桥接
main.ts 手写注册路由         →      Library.routes + 动态注册
utils/request.ts 全局单例    →      IOC 注入 InfrastructureAxios
改一个页面可能影响全局       →      依赖方向单向，边界清晰
```

传统模板适合快速出 Demo；Grow Admin 适合**多项目复用、多团队并行、长期维护**的中后台场景。

---

## 一、Monorepo 四层分离

### 为什么这样设计？

中后台项目往往同时存在三类变化：

1. **框架能力变化**（路由中间件、主题、国际化、组件桥接）
2. **业务能力变化**（登录、审批、报表、工作流）
3. **部署环境变化**（不同客户、不同 API、不同 UI 规范）

若全部写在一个 `src/` 里，三者会缠在一起：改主题可能误触业务路由，换 UI 库要全局搜索 `el-` 前缀。

Grow Admin 用四层职责切开：

| 层级 | 职责 | 变化频率 |
|------|------|----------|
| `configs` | 构建与工具链 | 低 |
| `DesignRock` | 与业务无关的框架能力 | 中 |
| `DesignCornerstone` | 可复用的业务模块 | 高 |
| `sample` | 宿主：选型、装配、环境配置 | 按项目 |

**依赖方向单向**：`sample → Cornerstone → Rock → configs`，禁止反向依赖。这样 Rock 包永远不会 import 某个具体业务页面。

### 带来的好处

- **框架可独立发版**：升级 `rock-components` 不必改业务源码
- **业务可跨项目复用**：`apps-login` 可装配进不同宿主
- **职责清晰**：新人看目录就知道该改哪一层
- **CI 可分层构建**：Turbo 按包增量编译

### 宿主角色的意义

`sample` 不是「示例代码随便写写」，而是**组合根（Composition Root）**：

- 选哪个 UI 库 → `projectSetting` + `init-components-driver`
- 装哪些模块 → `initIoc.ts`
- 环境差异 → `.env`、`GrowAxiosTransform`

框架故意把「选型」放在宿主，而不是写死在 Rock 里——**同一个 Rock，可以长出不同风格的管理后台**。

---

## 二、IOC 模块化（Library 契约）

### 为什么不用「到处 import」？

单应用里常见写法：

```typescript
import router from './router'
import { http } from './utils/request'
import Login from './views/login.vue'
```

问题是：模块之间通过**文件路径**耦合，拆包后路径断裂；测试时难以替换实现；启动顺序藏在各个 `import` 的副作用里，无人知晓全貌。

Grow Admin 采用 **Library + AppContext + Inversify**：

```
各模块声明 Lib（routes / module / onSetup）
        ↓
宿主 app.use(Lib, appContext) 收集能力
        ↓
appContext.load() 统一加载 IOC + 执行生命周期
        ↓
diKT(Beans.Xxx) 按标识符获取服务
```

### 为什么需要 AppContext？

IOC 容器解决「服务从哪来」，AppContext 解决「应用级编排」：

- 汇总所有模块的 `routes`，再交给 `middleware-router` 建表
- 收集 `iocModules`，一次性 `loadAsync`
- `registerParam` 传递跨模块参数（如 `DriverComponentDictionary`）
- `beforeSetup` / `onSetup` 有序执行（支持 priority）

**一次 `load()`，全局就绪**——避免「A 模块 onMounted 时 B 模块还没注册」的竞态。

### 带来的好处

| 收益 | 说明 |
|------|------|
| **可装配** | 不需要的模块不 `.use()` 即可 |
| **可测试** | IOC 里换 Mock 实现，无需改业务 import |
| **可观测** | `initIoc.ts` 即应用能力清单 |
| **可扩展** | 新业务包只需实现 Library 契约 |

### 装配顺序为何敏感？

组件驱动 → 基础设施 → 状态/语言 → 路由 → 业务 → 契约组件，不是随意排列：

- 驱动必须先于 `componentsLib.onSetup`，否则 Grow 组件找不到映射
- 路由中间件先于业务模块，业务 `routes` 才能汇入路由表
- `router` 在 `load()` 之后由宿主挂载，保证守卫注册时容器已就绪

顺序即**架构文档**，写死在 `initIoc.ts` 是有意为之。

---

## 三、组件驱动桥接（Grow* 契约）

### 为什么要多一层，而不是直接用 Element Plus？

中后台项目生命周期长，UI 库选型常变：

- 团队熟悉度、设计规范、组件缺失、License、包体积……

若在几百个 `.vue` 里直接写 `<el-button>`，换库成本 ≈ 重写前端。抽象太早（大而全的二次封装）又会导致 API 失真、维护地狱。

Grow Admin 选择 **「契约组件 + 驱动映射」** 的中间路线：

```
业务只认识 GrowButton
        ↓
契约层保持统一 Props / 插槽约定
        ↓
驱动层把 GrowButton 映射到 ElButton / NButton / AButton
```

只抽象三库**共有的 84 个组件**，不虚构不存在的 API。

### 为什么切换在宿主，而不是业务模块？

若每个业务包自己 `import element-plus`，会出现：

- A 模块用 EP，B 模块用 Naive，全局样式冲突
- 业务包无法作为纯净 npm 包发布
- 树摇与按需加载策略无法统一

**宿主统一 `installComponentDriver`**，业务包 peer 依赖 `@grow-admin-rock/components` 即可——业务包是「UI 库无关」的。

### ComponentDriverProvider 解决什么问题？

少数页面需要与全局不同的 UI（如嵌入旧系统、A/B 对比）。全局切换不现实，**子树级覆盖**既保留默认一致性，又留出逃生舱。

### 带来的好处

- **业务代码稳定**：切换 `componentLibrary` + `preset`，页面零改动
- **契约边界清晰**：84 个组件清单 = 可承诺的兼容范围
- **命令式 API 同样统一**：Message / Dialog 经桥接注入，不散落 `ElMessage`

---

## 四、路由与菜单：静态 + 动态

### 为什么分「静态基础路由」和「动态业务路由」？

中后台路由有两类本质不同的来源：

| 类型 | 来源 | 特点 |
|------|------|------|
| 基础路由 | 前端框架约定 | 登录、布局壳——不随权限变 |
| 业务路由 | 后端权限 / 菜单 | 随用户、租户、角色变化 |

全静态：每次加菜单要发版；全动态：登录页、404 等框架页也要走接口，启动慢、体验差。

**静态注册骨架 + 动态注入业务子路由**，各取所长。

### 为什么业务路由挂在 Home 下？

```
/home          ← 布局壳（侧栏、顶栏、设置抽屉）只挂载一次
/home/xxx      ← 业务页在 <router-view /> 内切换
```

避免每个业务页重复布局；权限重置时只清 `appRoutes`，`basicRoutes`（Login、Home）保留。

### 为什么菜单与路由共用数据、却分开处理？

同一份 `menuList` 有两种消费方式：

| 消费者 | 需要的数据形态 | 原因 |
|--------|----------------|------|
| Vue Router | 扁平叶子路由 | 路由器不认识「纯目录节点」 |
| 侧边菜单 | 树形结构 | 用户需要折叠目录 |

`flatten` 注册路由 + `toMenuList` 保留树——**一次请求，两种视图**，避免菜单接口与路由接口不一致。

### 为什么配置与组件映射分离？

`apps-workspace/route-config` 不含 `.vue`：

- Mock / 后端 API 只返回 JSON 元数据
- vite-plugin-mock 不会误打包页面组件
- 组件映射留在前端 `resolveWorkspaceRoute()`，安全且灵活

这是**前后端职责分界**：后端管「谁能看什么」，前端管「页面长什么样」。

### 为什么通过 IOC 拿 router？

`rock-layouts` 是框架布局包，不应强依赖 `vue-router` 的 composable 上下文。通过 `RouteTable` 服务：

- 布局包与路由实现解耦
- 与 IOC 体系一致，便于测试替换
- 动态 `addRoute` 与菜单跳转共用同一实例

### 守卫 + Bootstrap 双触发

| 机制 | 时机 | 目的 |
|------|------|------|
| 路由守卫 | 导航前 | 直链 `/home/workspace` 时路由必须已存在 |
| `useAppBootstrap` | Home 挂载后 | 页面 Loading、用户信息等体验逻辑 |

`isDynamicAddedRoute` 防重复——**正确性**与**体验**分开，不互相牺牲。

---

## 五、横切关注点的设计

### 主题：CSS 变量 + 状态 + 三库 Config

为什么不用各业务页写死颜色？

- 亮/暗切换、主题色、UnoCSS 语义类需要**单一数据源**
- `useTheme` 动态写 `:root`，三库 `GrowConfig` 同步主色——改一处，全局生效

### HTTP：Transform 在宿主扩展

框架提供 `InfrastructureAxios` 管道，宿主注入 `GrowAxiosTransform`：

- 框架不假设你的后端响应格式
- Mock 的 `resultSuccess` 与 Transform 解包规则对齐——开发生产一致

### Mock：开发便利但不污染业务

Mock 是宿主能力，业务包通过 `route-config` 导出纯数据。业务模块不 import mock 文件，**上线时去掉 mock 装配即可**。

---

## 六、设计权衡（诚实说明）

没有银弹。Grow Admin 为上述目标付出了一些成本：

| 权衡 | 我们选择了 | 代价 |
|------|-----------|------|
| 抽象 vs 直接 | Grow* 契约层 | 新组件需补驱动映射 |
| 灵活 vs 简单 | IOC + Library | 上手需理解装配顺序 |
| 动态 vs 静态 | 接口驱动菜单 | 需处理守卫时机、直链访问 |
| 统一 vs 自由 | 84 个共有组件 | 特殊组件需业务自封装 |

若项目只有 3～5 个固定页面、团队永远不换 UI 库，传统单应用可能更轻。**当模块数、团队数、项目寿命增长时，这套架构的收益会放大。**

---

## 架构全景

```
                    ┌─────────────────────────────────┐
                    │           sample 宿主            │
                    │  选型 · 装配 · 环境 · Mock      │
                    └───────────────┬─────────────────┘
                                    │ .use(Lib)
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
   apps-login              apps-home                 apps-workspace
   登录/Token              守卫/动态路由              页面/路由配置
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    ▼
                    ┌─────────────────────────────────┐
                    │         DesignRock 框架            │
                    │  IOC · Grow* · 驱动 · 路由 · 状态  │
                    └───────────────┬─────────────────┘
                                    ▼
                    ┌─────────────────────────────────┐
                    │            configs               │
                    │     Vite · TS · UnoCSS · Mock    │
                    └─────────────────────────────────┘
```

## 延伸阅读

| 章节 | 内容 |
|------|------|
| [项目结构](/guide/architecture/project-structure) | 目录与分层细节 |
| [IOC 模块化](/guide/architecture/ioc) | Library 契约与装配 |
| [组件驱动架构](/guide/architecture/component-driver) | Grow* 与驱动加载 |
| [路由与菜单](/guide/architecture/routing-and-menu) | 动态路由与菜单树 |
