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
      { text: '组件', link: '/components/' },
      { text: 'Demo 演示', link: 'https://demo.gadmin.top/', target: '_blank' }
    ],
    sidebar: {
      "/components/": [
        {
          text: '组件',
          items: [
            { text: '概览', link: '/components/' },
            { text: 'SearchBar 高级搜索栏', link: '/components/search-bar' },
            { text: 'ColumnBar 表格列设置', link: '/components/column-bar' },
            { text: 'AbstractEle 动态表单项', link: '/components/abstract-ele' },
            { text: '其他组件', link: '/components/other' }
          ]
        }
      ],
      "/guide/": [
        {
          text: '入门',
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
            { text: '路由与菜单', link: '/guide/architecture/routing-and-menu' }
          ]
        },
        {
          text: '配置与主题',
          items: [
            { text: '项目配置', link: '/guide/development/project-setting' },
            { text: '主题与颜色', link: '/guide/development/theme-and-colors' },
            { text: '主题与语言', link: '/guide/development/theme-and-locale' }
          ]
        },
        {
          text: '认证与权限',
          items: [
            { text: '认证与登录', link: '/guide/development/authentication' },
            { text: '权限模式', link: '/guide/development/permission-mode' }
          ]
        },
        {
          text: '网络与数据',
          items: [
            { text: 'HTTP 基础设施', link: '/guide/development/http-infrastructure' },
            { text: 'Mock 数据', link: '/guide/development/mock' }
          ]
        },
        {
          text: '组件库',
          items: [
            { text: '组件驱动架构', link: '/guide/architecture/component-driver' },
            { text: 'Grow 契约组件', link: '/guide/development/grow-components' },
            { text: '组件文档（SearchBar 等）', link: '/components/' },
            { text: '命令式 API', link: '/guide/development/imperative-api' },
            { text: '切换组件库', link: '/guide/development/switch-component-library' },
            { text: '局部覆盖组件库', link: '/guide/development/local-override' }
          ]
        },
        {
          text: '业务开发',
          items: [
            { text: '业务模块开发', link: '/guide/development/business-module' }
          ]
        },
        {
          text: '规范与约定',
          items: [
            { text: '开发规范', link: '/guide/development/dev-conventions' }
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
