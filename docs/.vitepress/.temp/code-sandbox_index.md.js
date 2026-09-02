import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.cc2b3d55.js";
const __pageData = JSON.parse('{"title":"代码沙箱","description":"","frontmatter":{"title":"代码沙箱","lang":"zh-CN"},"headers":[],"relativePath":"code-sandbox/index.md"}');
const _sfc_main = { name: "code-sandbox/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="代码沙箱" tabindex="-1">代码沙箱 <a class="header-anchor" href="#代码沙箱" aria-label="Permalink to &quot;代码沙箱&quot;">​</a></h1><p>在线编辑 Vue SFC，并在<strong>宿主 Vue 树内</strong>即时预览。预览可继续使用全局已注册的 <code>Grow*</code> 组件、IOC 能力（如 <code>useRequest</code>），也可通过 CDN 动态加载 npm 包。</p><table><thead><tr><th>项</th><th>说明</th></tr></thead><tbody><tr><td>包路径</td><td><code>@grow-admin-rock/code-sandbox</code></td></tr><tr><td>源码目录</td><td><code>DesignRock/rock-code-sandbox</code></td></tr><tr><td>演示模块</td><td><code>@grow-admin-cornerstone/apps-sandbox</code>（侧栏菜单：<strong>沙箱</strong>）</td></tr></tbody></table><h2 id="三个核心组件" tabindex="-1">三个核心组件 <a class="header-anchor" href="#三个核心组件" aria-label="Permalink to &quot;三个核心组件&quot;">​</a></h2><table><thead><tr><th>组件</th><th>职责</th><th>文档</th></tr></thead><tbody><tr><td><code>GrowCodeEditor</code></td><td>Monaco 单编辑器</td><td><a href="/code-sandbox/code-editor">代码编辑器</a></td></tr><tr><td><code>GrowCodeDeps</code></td><td>依赖列表（锁定项 + 自定义 npm / host）</td><td><a href="/code-sandbox/code-deps">依赖注入</a></td></tr><tr><td><code>GrowCodeSandbox</code></td><td>将 Vue SFC 编译并挂载为预览组件</td><td><a href="/code-sandbox/preview">沙箱预览</a></td></tr></tbody></table><h2 id="能力概览" tabindex="-1">能力概览 <a class="header-anchor" href="#能力概览" aria-label="Permalink to &quot;能力概览&quot;">​</a></h2><ol><li><strong>完整 Vue SFC</strong>：<code>template</code> / <code>script setup</code> / <code>style</code>（含 scoped）</li><li><strong>宿主内挂载</strong>：预览组件跑在当前应用树中，可复用驱动组件与 IOC</li><li><strong>依赖注入</strong><ul><li><strong>host</strong>：组件按名从宿主 <code>appContext.components</code> 解析；API / 模块由 <code>expose</code> 注入</li><li><strong>npm</strong>：经 esm.sh CDN 动态加载，无需装进项目</li></ul></li><li><strong>默认锁定依赖</strong>：<code>useRequest</code>、<code>@grow-admin-rock/state</code>、<code>middleware-router</code>、<code>utils</code>、<code>hooks</code>（不可取消勾选）</li></ol><div class="tip custom-block"><p class="custom-block-title">演示入口</p><p>登录后打开侧栏 <strong>沙箱</strong>：</p><ul><li><strong>沙箱工具</strong> — 编辑器 + 依赖 + 预览三分屏</li><li><strong>代码沙箱</strong> — 仅预览（完整 SFC 示例）</li><li><strong>代码编辑器</strong> — 仅编辑器（可切换语言）</li></ul><p>各设计器内嵌的事件 / 公式 / 绑定编辑也依赖本包能力，工具链说明见 <a href="/guide/designers/">低代码设计器</a>。</p></div><h2 id="推荐阅读" tabindex="-1">推荐阅读 <a class="header-anchor" href="#推荐阅读" aria-label="Permalink to &quot;推荐阅读&quot;">​</a></h2><ol><li><a href="/code-sandbox/usage">基础用法</a> — 先拼出一个可预览的页面</li><li><a href="/code-sandbox/preview">沙箱预览</a> — <code>expose</code> / <code>dependencies</code> 能力面</li><li><a href="/code-sandbox/code-deps">依赖注入</a> / <a href="/code-sandbox/code-editor">代码编辑器</a> — 按需深入</li><li><a href="/code-sandbox/api">工具 API 与注意点</a> — <code>composeVueSfc</code>、子路径导出、常见坑</li></ol></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("code-sandbox/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
