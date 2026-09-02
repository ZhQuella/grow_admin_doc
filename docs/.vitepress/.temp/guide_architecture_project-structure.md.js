import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.cc2b3d55.js";
const __pageData = JSON.parse('{"title":"项目结构","description":"","frontmatter":{"title":"项目结构","lang":"zh-CN"},"headers":[],"relativePath":"guide/architecture/project-structure.md"}');
const _sfc_main = { name: "guide/architecture/project-structure.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="项目结构" tabindex="-1">项目结构 <a class="header-anchor" href="#项目结构" aria-label="Permalink to &quot;项目结构&quot;">​</a></h1><p>Grow Admin 采用 pnpm Monorepo 管理，按职责分为四个顶层目录。</p><div class="tip custom-block"><p class="custom-block-title">先读设计理念</p><p>若你想了解「为什么要这样分层」，建议先阅读 <a href="/guide/architecture/design-philosophy">架构设计理念</a>。</p></div><h2 id="设计理念-为什么分层" tabindex="-1">设计理念：为什么分层？ <a class="header-anchor" href="#设计理念-为什么分层" aria-label="Permalink to &quot;设计理念：为什么分层？&quot;">​</a></h2><p>传统 Vue Admin 把所有代码放在 <code>src/</code> 下，短期开发快，长期会遇到：</p><ul><li>框架代码与业务代码混在一起，升级框架牵一发动全身</li><li>业务模块无法拆成独立包给其他项目用</li><li>构建配置在每个子项目里复制粘贴</li></ul><p>Grow Admin 用 <strong>Rock（框架）/ Cornerstone（业务）/ sample（宿主）/ configs（工具链）</strong> 四层切开，并规定<strong>单向依赖</strong>。</p><table><thead><tr><th>设计决策</th><th>原因</th><th>好处</th></tr></thead><tbody><tr><td>Rock 不含业务页面</td><td>框架应可复用于不同行业</td><td>升级 Rock 不碰业务</td></tr><tr><td>Cornerstone 按能力分包</td><td>登录、首页、工作区独立演进</td><td>团队可并行开发</td></tr><tr><td>sample 只做装配</td><td>选型属于项目，不属于框架</td><td>同一套 Rock 适配多客户</td></tr><tr><td>configs 共享构建</td><td>Vite/TS 配置应一致</td><td>改一处，全仓生效</td></tr></tbody></table><p><strong>磐石（Rock）与砥柱（Cornerstone）</strong> 的命名也体现这一点：Rock 是稳定基座，Cornerstone 是承载业务的支柱，宿主把二者组合成完整应用。</p><h2 id="顶层目录" tabindex="-1">顶层目录 <a class="header-anchor" href="#顶层目录" aria-label="Permalink to &quot;顶层目录&quot;">​</a></h2><p>与 README 一致的核心结构：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">grow_admin/</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── DesignRock/              # 框架核心层</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-components/     # 契约组件（Grow* 前缀）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-layouts/        # 布局壳（设置抽屉、菜单、标签页等）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-state/          # 应用状态（主题、配置持久化）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-styles/         # 全局样式与 CSS 变量</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-component-driver/              # 驱动桥接基础包</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-component-driver-element-plus/   # Element Plus 驱动</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-component-driver-naive/          # Naive UI 驱动</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-component-driver-antdv/          # Ant Design Vue 驱动</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-ioc/            # 依赖注入</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-code-sandbox/   # 在线代码编辑与沙箱预览</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-designer/       # 低代码页面设计器</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-report-designer/# 报表设计器</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-schema-designer/# 可视化数据库建模</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── rock-data-prep/      # 数据准备（Dataset）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   └── ...</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── DesignCornerstone/       # 业务模块层</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── cornerstone-apps-login/     # 登录模块</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── cornerstone-apps-home/      # 首页（布局 + 动态路由）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── cornerstone-apps-workspace/ # 工作区（页面 + 路由配置）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── cornerstone-apps-sandbox/   # 代码沙箱演示</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── cornerstone-apps-designer/  # 页面 / 报表 / 建模 / 数据准备演示</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   └── cornerstone-apps-system/    # 系统管理（组织 / 人员 / 权限）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── configs/                 # 共享构建配置（含 UnoCSS 主题色映射）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">└── sample/                  # 宿主示例应用</span></span></code></pre></div><p>仓库内还有 <code>scripts/</code>、<code>package.json</code>、<code>pnpm-workspace.yaml</code>、<code>turbo.json</code> 等，用于 Monorepo 与构建调度。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">grow_admin/</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── DesignRock/              # 框架核心层（磐石）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── DesignCornerstone/       # 业务模块层（砥柱）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── configs/                 # 共享构建配置</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── sample/                  # 宿主示例应用</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── scripts/                 # 构建脚本</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── package.json             # 根工作区配置</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── pnpm-workspace.yaml      # 工作区声明</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">└── turbo.json               # Turbo 并行构建配置</span></span></code></pre></div><h2 id="designrock-—-框架核心层" tabindex="-1">DesignRock — 框架核心层 <a class="header-anchor" href="#designrock-—-框架核心层" aria-label="Permalink to &quot;DesignRock — 框架核心层&quot;">​</a></h2><p><code>DesignRock</code>（磐石）存放与具体业务无关的框架基础设施，所有包以 <code>@grow-admin-rock/*</code> 发布。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">DesignRock/</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-ioc/                          # IOC 依赖注入容器</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-base-package/                 # Library 基座与 AppContext</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-types/                        # 全局 TypeScript 类型</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-constants/                    # 枚举与常量</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-components/                   # Grow* 契约组件</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-component-driver/             # 组件驱动桥接基础包</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-component-driver-element-plus/  # Element Plus 驱动</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-component-driver-naive/         # Naive UI 驱动</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-component-driver-antdv/         # Ant Design Vue 驱动</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-layouts/                      # 布局壳（主题设置抽屉、菜单、标签页等）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-infrastructure/               # HTTP 请求基础设施</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-middleware-router/            # 路由与菜单中间件</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-settings/                     # 项目设置（主题、布局）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-state/                        # Pinia 状态管理封装</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-locale/                       # 国际化</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-hooks/                        # 通用 Hooks</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-utils/                        # 工具函数（含 VueUse 重导出）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-styles/                       # 全局样式</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-code-sandbox/                 # 在线代码编辑与 Vue SFC 沙箱预览</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-designer/                     # 低代码页面设计器</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-report-designer/              # 报表设计器（ECharts + 网格布局）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-schema-designer/              # 可视化数据库建模（Vue Flow）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-data-prep/                    # 数据准备 Dataset（Vue Flow + 聚合）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── rock-data-clean/                   # 数据清洗 CleanFlow（Vue Flow + 本地管道）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">└── rock-process-engine/               # 流程引擎 ProcessFlow（Vue Flow，设计期）</span></span></code></pre></div><h2 id="designcornerstone-—-业务模块层" tabindex="-1">DesignCornerstone — 业务模块层 <a class="header-anchor" href="#designcornerstone-—-业务模块层" aria-label="Permalink to &quot;DesignCornerstone — 业务模块层&quot;">​</a></h2><p><code>DesignCornerstone</code>（砥柱）存放可独立开发的业务功能模块，以 <code>@grow-admin-cornerstone/*</code> 发布。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">DesignCornerstone/</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── cornerstone-apps-login/      # 登录模块</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── cornerstone-apps-home/       # 登录后首页（布局壳 + 动态路由注册）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── cornerstone-apps-workspace/  # 工作区业务页（路由配置 + 页面组件）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── cornerstone-apps-sandbox/    # 代码沙箱演示（编辑器 / 依赖 / 预览）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── cornerstone-apps-designer/   # 页面 / 报表 / 建模 / 数据准备 / 清洗 / 流程引擎演示</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">└── cornerstone-apps-system/     # 系统管理（部门 / 人员 / 账号 / 角色 / 菜单）</span></span></code></pre></div><p>业务模块通过 Library 约定接入宿主应用，不自行安装组件驱动。系统管理模块说明见 <a href="/system-admin/">系统管理</a>。</p><h2 id="configs-—-共享构建配置" tabindex="-1">configs — 共享构建配置 <a class="header-anchor" href="#configs-—-共享构建配置" aria-label="Permalink to &quot;configs — 共享构建配置&quot;">​</a></h2><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">configs/</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── vite/                      # @grow-admin-config/vite — 统一 Vite 配置</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── tsconfig/                  # @grow-admin-config/tsconfig — 共享 TS 配置</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── grow-admin-autoimport/     # 自动导入插件</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">└── grow-admin-css-preprocess/ # CSS 预处理</span></span></code></pre></div><h2 id="sample-—-宿主示例应用" tabindex="-1">sample — 宿主示例应用 <a class="header-anchor" href="#sample-—-宿主示例应用" aria-label="Permalink to &quot;sample — 宿主示例应用&quot;">​</a></h2><p><code>sample</code> 是整个框架的宿主应用，负责：</p><ol><li>选择并加载组件库驱动</li><li>装配所有 IOC 模块（基础设施、状态、国际化、路由、业务模块、契约组件）</li><li>提供 <code>projectSetting.ts</code> 全局配置</li><li>注册宿主级路由与 Mock 数据</li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">sample/</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── src/</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── main.ts                    # 入口</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── App.vue                    # 根组件（Provider 包裹）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── projectSetting.ts          # 项目配置</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── init-components-driver.ts  # 驱动初始化</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── initAppConfig.ts           # projectSetting → useAppConfig 引导</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── removeAppLoading.ts        # 首屏 loading 移除</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── apis/infrastructure.ts     # GrowAxiosTransform / useRequest</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   └── plugin/initIoc.ts          # IOC 装配</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── mock/                          # 开发环境 Mock 接口</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── auth.ts                    # POST /api/login</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── routers.ts                 # GET /api/menu/list</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   ├── login.ts                   # 验证码、手机登录等</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│   └── dataPrep.ts                # /mock/data-prep/* 数据准备</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├── vite.config.ts                 # Vite 配置</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">└── package.json</span></span></code></pre></div><h2 id="工作区声明" tabindex="-1">工作区声明 <a class="header-anchor" href="#工作区声明" aria-label="Permalink to &quot;工作区声明&quot;">​</a></h2><p><code>pnpm-workspace.yaml</code> 定义了 Monorepo 的工作区范围：</p><div class="language-yaml"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#F07178" })}">packages</span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">  </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">-</span><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"> </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span><span style="${ssrRenderStyle({ "color": "#C3E88D" })}">configs/*</span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">  </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">-</span><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"> </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span><span style="${ssrRenderStyle({ "color": "#C3E88D" })}">DesignRock/*</span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">  </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">-</span><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"> </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span><span style="${ssrRenderStyle({ "color": "#C3E88D" })}">DesignCornerstone/*</span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">  </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">-</span><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"> </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span><span style="${ssrRenderStyle({ "color": "#C3E88D" })}">sample</span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">  </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">-</span><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"> </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span><span style="${ssrRenderStyle({ "color": "#C3E88D" })}">scripts</span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span></span></code></pre></div><h2 id="分层原则" tabindex="-1">分层原则 <a class="header-anchor" href="#分层原则" aria-label="Permalink to &quot;分层原则&quot;">​</a></h2><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">┌─────────────────────────────────────────┐</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│              sample（宿主）               │</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│  驱动选择 · 模块装配 · 全局配置 · 路由 · Mock │</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├─────────────────────────────────────────┤</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│         DesignCornerstone（业务）        │</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│  apps-login · apps-home · apps-workspace │</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├─────────────────────────────────────────┤</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│           DesignRock（框架核心）          │</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│  IOC · 契约组件 · 驱动 · 基础设施 · 路由  │</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">├─────────────────────────────────────────┤</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│            configs（构建配置）            │</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">│  Vite · TSConfig · 自动导入 · CSS 预处理  │</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">└─────────────────────────────────────────┘</span></span></code></pre></div><p><strong>依赖方向</strong>：<code>sample</code> → <code>DesignCornerstone</code> → <code>DesignRock</code> → <code>configs</code>，不允许反向依赖。</p><h3 id="单向依赖解决什么问题" tabindex="-1">单向依赖解决什么问题？ <a class="header-anchor" href="#单向依赖解决什么问题" aria-label="Permalink to &quot;单向依赖解决什么问题？&quot;">​</a></h3><p>若允许 <code>rock-components</code> import <code>apps-login</code> 的页面，框架就与具体业务焊死，无法：</p><ul><li>单独发布 <code>@grow-admin-rock/components</code> 供第三方使用</li><li>在不含登录模块的轻量宿主中复用布局</li><li>写不依赖业务的单元测试</li></ul><p>单向依赖是<strong>架构纪律</strong>：宁可多写一层 <code>Library</code> 导出，也不跨层引用。</p><h2 id="下一步" tabindex="-1">下一步 <a class="header-anchor" href="#下一步" aria-label="Permalink to &quot;下一步&quot;">​</a></h2><ul><li><p><a href="/guide/architecture/design-philosophy">架构设计理念</a> — 整体设计动机与权衡</p></li><li><p><a href="/guide/architecture/ioc">IOC 模块化架构</a> — 了解 Library 如何装配</p></li><li><p><a href="/guide/architecture/routing-and-menu">路由与菜单</a> — 动态路由注册与侧边菜单</p></li><li><p><a href="/guide/architecture/component-driver">组件驱动架构</a> — 了解 Grow* 组件与驱动桥接</p></li><li><p><a href="/guide/packages/design-rock">包说明</a> — 查看每个包的详细职责</p></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("guide/architecture/project-structure.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const projectStructure = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  projectStructure as default
};
