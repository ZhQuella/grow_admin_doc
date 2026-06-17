const path = require('path');

module.exports = {
  title: "Grow Admin",
  base: '/',
  cleanUrls: 'with-subfolders',
  head: [
    [
      'link',{ rel: 'icon', href: './favicon.ico' }
    ]
  ],
  themeConfig: {
    logo: '/image/logo.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ZhQuella/grow_admin' }
    ],
    nav: [
      { text: '指南', link: '/guide/' },
      { text: 'Demo 演示', link: 'https://demo.gadmin.top/', target: '_blank' }
    ],
    sidebar: {
      "/guide/": [
        {
          text: '介绍',
          items: [
            { text: '简介', link: '/guide/' },
            { text: '快速上手', link: '/guide/getting-started' }
          ]
        },
        {
          text: '架构',
          items: [
            { text: '架构设计理念', link: '/guide/architecture/design-philosophy' },
            { text: '项目结构', link: '/guide/architecture/project-structure' },
            { text: 'IOC 模块化', link: '/guide/architecture/ioc' },
            { text: '组件驱动架构', link: '/guide/architecture/component-driver' },
            { text: '路由与菜单', link: '/guide/architecture/routing-and-menu' }
          ]
        },
        {
          text: '开发指南',
          items: [
            { text: '项目配置', link: '/guide/development/project-setting' },
            { text: '认证与登录', link: '/guide/development/authentication' },
            { text: 'HTTP 基础设施', link: '/guide/development/http-infrastructure' },
            { text: 'Mock 数据', link: '/guide/development/mock' },
            { text: '主题与颜色', link: '/guide/development/theme-and-colors' },
            { text: '主题与语言', link: '/guide/development/theme-and-locale' },
            { text: '切换组件库', link: '/guide/development/switch-component-library' },
            { text: 'Grow 契约组件', link: '/guide/development/grow-components' },
            { text: '命令式 API', link: '/guide/development/imperative-api' },
            { text: '业务模块开发', link: '/guide/development/business-module' },
            { text: '局部覆盖组件库', link: '/guide/development/local-override' }
          ]
        },
        {
          text: '包说明',
          items: [
            { text: 'DesignRock 核心层', link: '/guide/packages/design-rock' },
            { text: 'DesignCornerstone 业务层', link: '/guide/packages/design-cornerstone' },
            { text: '构建配置', link: '/guide/packages/configs' }
          ]
        }
      ]
    }
  }
};
