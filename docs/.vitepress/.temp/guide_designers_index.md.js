import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.cc2b3d55.js";
const __pageData = JSON.parse('{"title":"低代码设计器","description":"","frontmatter":{"title":"低代码设计器","lang":"zh-CN"},"headers":[],"relativePath":"guide/designers/index.md"}');
const _sfc_main = { name: "guide/designers/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="低代码设计器" tabindex="-1">低代码设计器 <a class="header-anchor" href="#低代码设计器" aria-label="Permalink to &quot;低代码设计器&quot;">​</a></h1><p>Grow Admin 在 DesignRock 中提供一套可组合的低代码工具链：从 <strong>物理建模</strong> 到 <strong>分析准备 / 数据清洗</strong>，再到 <strong>页面 / 报表展示</strong>；另有独立的 <strong>流程引擎</strong> 做业务流转编排。<strong>代码沙箱</strong> 作为共享能力，被各设计器内嵌（事件脚本、公式、变量绑定等）。</p><p>演示入口由 <code>@grow-admin-cornerstone/apps-designer</code>（设计器菜单）与 <code>@grow-admin-cornerstone/apps-sandbox</code>（沙箱菜单）注册；宿主 <code>sample</code> 经 IOC 装配后，登录即可在侧栏打开。</p><h2 id="工具链关系" tabindex="-1">工具链关系 <a class="header-anchor" href="#工具链关系" aria-label="Permalink to &quot;工具链关系&quot;">​</a></h2><div class="language-text"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">数据库建模 (schema-designer)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">  → DatabaseSchema（表 / 字段 / 关联 / SQL 配置）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">        ↓ 已发布元数据（Mock：/data-prep/schemas）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">        ├─→ 数据准备 (data-prep)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">        │     → DataPrepDataset（选表、Join、公式度量、输出字段）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">        │           ↓ 查询结果（Mock：POST /data-prep/query）写入页面 state</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">        │</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">        └─→ 数据清洗 (data-clean)     （亦可引用 Dataset 原始表 / 输出）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">              → CleanFlow（声明式 ETL：源 → 算子 → 输出；调用时执行）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">                    ↓ 后续对接报表数据集 / 页面数据源 / API</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"></span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">页面设计器 (designer)     → DesignerSchema + GrowRenderer</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">报表设计器 (report-designer) → ReportSchema + GrowReportRenderer</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">  ↑ 当前演示主路径仍是「数据准备查询 → state」；清洗流消费者绑定规划中</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"></span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">流程引擎 (process-engine)  （业务流转，与数据管道并行）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">  → ProcessFlow（人工 / 事件 / 系统 / 状态 / 决策 / 分支；设计期）</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">        ↓ 运行时执行与 formKey ↔ 页面对接规划中</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"></span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">代码沙箱 (code-sandbox)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">  → 被上述设计器内嵌；亦可独立演示（apps-sandbox）</span></span></code></pre></div><table><thead><tr><th>模块</th><th>包名</th><th>产物</th><th>文档</th></tr></thead><tbody><tr><td><a href="/schema-designer/">数据库建模</a></td><td><code>@grow-admin-rock/schema-designer</code></td><td><code>DatabaseSchema</code></td><td>表结构与关系</td></tr><tr><td><a href="/data-prep/">数据准备</a></td><td><code>@grow-admin-rock/data-prep</code></td><td><code>DataPrepDataset</code></td><td>Join + 公式度量</td></tr><tr><td><a href="/data-clean/">数据清洗</a></td><td><code>@grow-admin-rock/data-clean</code></td><td><code>CleanFlow</code></td><td>声明式清洗流编排 + 本地管道预览</td></tr><tr><td><a href="/process-engine/">流程引擎</a></td><td><code>@grow-admin-rock/process-engine</code></td><td><code>ProcessFlow</code></td><td>业务流转设计期编排</td></tr><tr><td><a href="/page-designer/">页面设计器</a></td><td><code>@grow-admin-rock/designer</code></td><td><code>DesignerSchema</code></td><td>拖拽页面</td></tr><tr><td><a href="/report-designer/">报表设计器</a></td><td><code>@grow-admin-rock/report-designer</code></td><td><code>ReportSchema</code></td><td>图表看板</td></tr><tr><td><a href="/code-sandbox/">代码沙箱</a></td><td><code>@grow-admin-rock/code-sandbox</code></td><td>SFC / 表达式编辑</td><td>Monaco + 预览</td></tr></tbody></table><h2 id="推荐阅读" tabindex="-1">推荐阅读 <a class="header-anchor" href="#推荐阅读" aria-label="Permalink to &quot;推荐阅读&quot;">​</a></h2><ol><li><a href="/guide/designers/collaboration">协同工作</a> — 模块如何靠产物与 <code>state</code> 衔接</li><li><a href="/guide/designers/playground">演示与接入</a> — 菜单对照、宿主装配、界面操作要点</li><li>再进入各设计器「概述 / 基础用法」专章</li></ol><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>若只想先跑通示例：登录 Demo → 侧栏 <strong>设计器</strong> / <strong>沙箱</strong> 打开对应 playground。</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("guide/designers/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
