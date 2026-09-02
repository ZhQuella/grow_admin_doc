import { unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { V as VPTeamPage, a as VPTeamPageTitle, b as VPTeamMembers, c as VPTeamPageSection } from "./VPTeamMembers.d97b287d.js";
import "./plugin-vue_export-helper.cc2b3d55.js";
const index_md_vue_type_style_index_0_lang = "";
const __pageData = JSON.parse('{"title":"Grow Admin","titleTemplate":"一个开箱即用的Admin框架","description":"","frontmatter":{"layout":"home","title":"Grow Admin","titleTemplate":"一个开箱即用的Admin框架","hero":{"image":{"src":"/image/logo.png","alt":"Grow Admin"},"name":"Grow Admin","text":"开箱即用的\\n中台前端解决方案","tagline":"基于Vue3\\\\Vite\\\\TypeScript\\n最新技术栈开发轻松构建规范且美观的系统","actions":[{"theme":"brand","text":"开始使用","link":"/guide/"},{"theme":"alt","text":"Demo 演示","link":"https://demo.gadmin.top/","target":"_blank"}]},"features":[{"title":"💡 最新的技术栈","details":"基于 Vue3 / Vite / TypeScript 等最新技术栈开发"},{"title":"🔥 IOC 模块化架构","details":"基于 Inversify 的依赖注入，业务模块以 Library 形式独立开发、按需装配"},{"title":"🎨 组件驱动桥接","details":"Grow* 契约组件 + 驱动包，一套业务代码适配 Element Plus / Naive UI / Ant Design Vue"},{"title":"🗂️ 动态路由与菜单","details":"静态基础路由 + 接口驱动动态注册，目录与叶子节点职责分离"},{"title":"🧩 低代码设计器","details":"数据库建模、数据准备、数据清洗、流程引擎、页面 / 报表设计器与代码沙箱组成可组合工具链"},{"title":"💈 主题与国际化","details":"CSS 变量 + UnoCSS 语义色，登录页与设置抽屉均支持主题/语言切换"}]},"headers":[],"relativePath":"index.md"}');
const __default__ = { name: "index.md" };
const _sfc_main = Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const members = [
      {
        avatar: "https://avatars.githubusercontent.com/u/82251521?v=4",
        name: "张鱼烧",
        title: "作者",
        orgLink: "https://juejin.cn/user/2788017220107640/posts",
        org: "掘金",
        links: [
          { icon: "github", link: "https://github.com/ZhQuella" }
        ]
      },
      {
        avatar: "https://avatars.githubusercontent.com/u/54763364?v=4",
        name: "null",
        title: "前端-开发者",
        links: [
          { icon: "github", link: "https://github.com/lowProfileH" }
        ]
      },
      {
        avatar: "https://avatars.githubusercontent.com/u/79799040?v=4",
        name: "xiaogonggong-w",
        title: "前端-开发者",
        links: [
          { icon: "github", link: "https://github.com/xiaogonggong-w" }
        ]
      }
    ];
    const partners = [
      {
        avatar: "https://avatars.githubusercontent.com/u/82251521?v=4",
        name: "张鱼烧"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(unref(VPTeamPage), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(VPTeamPageTitle), null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="team-title"${_scopeId2}>团队介绍</div>`);
                } else {
                  return [
                    createVNode("div", { class: "team-title" }, "团队介绍")
                  ];
                }
              }),
              lead: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Grow Admin 的主要开发人员包括 `);
                } else {
                  return [
                    createTextVNode(" Grow Admin 的主要开发人员包括 ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VPTeamMembers), { members }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VPTeamPageSection), null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`赞助商`);
                } else {
                  return [
                    createTextVNode("赞助商")
                  ];
                }
              }),
              members: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(VPTeamMembers), {
                    size: "small",
                    members: partners
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(VPTeamMembers), {
                      size: "small",
                      members: partners
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(VPTeamPageTitle), null, {
                title: withCtx(() => [
                  createVNode("div", { class: "team-title" }, "团队介绍")
                ]),
                lead: withCtx(() => [
                  createTextVNode(" Grow Admin 的主要开发人员包括 ")
                ]),
                _: 1
              }),
              createVNode(unref(VPTeamMembers), { members }),
              createVNode(unref(VPTeamPageSection), null, {
                title: withCtx(() => [
                  createTextVNode("赞助商")
                ]),
                members: withCtx(() => [
                  createVNode(unref(VPTeamMembers), {
                    size: "small",
                    members: partners
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
