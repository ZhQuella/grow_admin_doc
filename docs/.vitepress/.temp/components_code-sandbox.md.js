import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.cc2b3d55.js";
const __pageData = JSON.parse('{"title":"Code Sandbox 代码沙箱","description":"","frontmatter":{"title":"Code Sandbox 代码沙箱","lang":"zh-CN"},"headers":[],"relativePath":"components/code-sandbox.md"}');
const _sfc_main = { name: "components/code-sandbox.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="code-sandbox-代码沙箱" tabindex="-1">Code Sandbox 代码沙箱 <a class="header-anchor" href="#code-sandbox-代码沙箱" aria-label="Permalink to &quot;Code Sandbox 代码沙箱&quot;">​</a></h1><p>代码沙箱内容已单独成章，请前往：</p><p><strong><a href="/code-sandbox/">代码沙箱模块</a></strong></p><table><thead><tr><th>章节</th><th>说明</th></tr></thead><tbody><tr><td><a href="/code-sandbox/">概述</a></td><td>能力概览与演示入口</td></tr><tr><td><a href="/code-sandbox/usage">基础用法</a></td><td>仅预览 / 三分屏</td></tr><tr><td><a href="/code-sandbox/code-editor">GrowCodeEditor</a></td><td>Monaco 编辑器</td></tr><tr><td><a href="/code-sandbox/code-deps">GrowCodeDeps</a></td><td>依赖注入面板</td></tr><tr><td><a href="/code-sandbox/preview">GrowCodeSandbox</a></td><td>SFC 编译预览</td></tr><tr><td><a href="/code-sandbox/api">工具 API 与注意点</a></td><td>工具函数与常见坑</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/code-sandbox.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const codeSandbox = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  codeSandbox as default
};
