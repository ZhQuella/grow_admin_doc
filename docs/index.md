---
layout: home

title: "Grow Admin"
titleTemplate: 一个开箱即用的Admin框架

hero:
  image:
    src: "/image/logo.png"
    alt: "Grow Admin"
  name: "Grow Admin"
  text: "开箱即用的\n中台前端解决方案"
  tagline: "基于Vue3\\Vite\\TypeScript\n最新技术栈开发轻松构建规范且美观的系统"
  actions:
    - theme: brand
      text: "开始使用"
      link: "/guide/"
    - theme: alt
      text: "组件文档"
      link: "/components/"
    - theme: alt
      text: "Demo 演示"
      link: "https://demo.gadmin.top/"
      target: _blank
    # - theme: alt
    #   text: "Pro 版本"
    #   link: ""
    #   target: _blank
features:
  - title: 💡 最新的技术栈
    details: 基于 Vue3 / Vite / TypeScript 等最新技术栈开发
  - title: 🔥 IOC 模块化架构
    details: 基于 Inversify 的依赖注入，业务模块以 Library 形式独立开发、按需装配
  - title: 🎨 组件驱动桥接
    details: Grow* 契约组件 + 驱动包，一套业务代码适配 Element Plus / Naive UI / Ant Design Vue
  - title: 🗂️ 动态路由与菜单
    details: 静态基础路由 + 接口驱动动态注册，目录与叶子节点职责分离
  - title: 🧩 低代码设计器
    details: 数据库建模、数据准备、页面 / 报表设计器与代码沙箱组成可组合工具链
  - title: 💈 主题与国际化
    details: CSS 变量 + UnoCSS 语义色，登录页与设置抽屉均支持主题/语言切换
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme';

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/82251521?v=4',
    name: '张鱼烧',
    title: '作者',
    orgLink: "https://juejin.cn/user/2788017220107640/posts",
    org: "掘金",
    links: [
      { icon: 'github', link: 'https://github.com/ZhQuella' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/54763364?v=4',
    name: 'null',
    title: '前端-开发者',
    links: [
      { icon: 'github', link: 'https://github.com/lowProfileH' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/79799040?v=4',
    name: 'xiaogonggong-w',
    title: '前端-开发者',
    links: [
      { icon: 'github', link: 'https://github.com/xiaogonggong-w' }
    ]
  }
];
const partners = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/82251521?v=4',
    name: '张鱼烧'
  }
];
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      <div class="team-title">团队介绍</div>
    </template>
    <template #lead>
      Grow Admin 的主要开发人员包括
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />

  <VPTeamPageSection>
    <template #title>赞助商</template>
    <template #members>
      <VPTeamMembers size="small" :members="partners" />
    </template>
  </VPTeamPageSection>

</VPTeamPage>


<style>
.team-title {
    font-size: 34px;
}
.VPHero .image-bg {
  z-index: 1;
  opacity: 0.7;
  background-image: linear-gradient(to bottom, #8b5cf6, #a78bfa);
  filter: blur(70px);
  transform: translate(-50%,-50%);
}
.VPHero .clip {
  background: linear-gradient(to bottom, #8b5cf6, #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.VPNav {
  --nav-dot-color: #fff;
  background-image: radial-gradient(transparent 1px, var(--nav-dot-color) 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(6px);
  -webkit-backdrop-filter: saturate(50%) blur(6px);
}

.dark .VPNav {
  --nav-dot-color: var(--vp-c-bg);
}
.VPNavBar, .content-body {
  background: none !important;
}
</style>
