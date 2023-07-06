---
layout: home

title: "Grow Admin"
titleTemplate: 一个开箱即用的Admin框架

hero:
  image:
    src: /image/logo.png
    alt: Grow Admin
  name: "Grow Admin"
  text: "开箱即用的\n中台前端解决方案"
  tagline: "基于Vue3\\Vite\\TypeScript\n最新技术栈开发轻松构建规范且美观的系统"
  actions:
    - theme: brand
      text: "开始使用"
      link: "/guide/"
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
    details: 基于Vue3/Vite/Typescript等最新技术栈开发
  - title: 🔥 企业级结构体系
    details: 采用企业级结构体系结构分层，基于packages区别开发
  - title: 🛠️ 丰富的示例
    details: 丰富的Web端插件示例实现
  - title: 📦 组件封装
    details: 对日常使用频率较高的组件二次封装满足基础工作需求
  - title: 🔭 优秀的布局方案
    details: 丰富的布局模式，具有高可配性，满足您的各类布局需求
  - title: 💈 主题配置
    details: 丰富的主题配置及黑暗主题适配
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
    orgLink: "https://juejin.cn/user/2788017220107640",
    org: "掘金",
    links: [
      { icon: 'github', link: 'https://github.com/ZhQuella' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/54763364?v=4',
    name: 'null',
    title: '开发者',
    links: [
      { icon: 'github', link: 'https://github.com/lowProfileH' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/79799040?v=4',
    name: 'xiaogonggong-w',
    title: '开发者',
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
  background-image: linear-gradient(to bottom, #8b5cf6, fuchsia);
  filter: blur(70px);
  transform: translate(-50%,-50%);
}
.VPHero .clip {
  background: linear-gradient(to bottom, #8b5cf6, #d946ef);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}
</style>
