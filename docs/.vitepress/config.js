const path = require('path');

/** 低代码设计器：与代码沙箱相同——本组「概述 + 子文档」 */
const designersSidebar = [
  {
    text: '低代码设计器',
    items: [
      { text: '概述', link: '/guide/designers/' },
      { text: '协同工作', link: '/guide/designers/collaboration' },
      { text: '演示与接入', link: '/guide/designers/playground' }
    ]
  }
]

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
      {
        text: '低代码集成',
        items: [
          { text: '低代码设计器', link: '/guide/designers/' },
          { text: '代码沙箱', link: '/code-sandbox/' },
          { text: '页面设计器', link: '/page-designer/' },
          { text: '报表设计器', link: '/report-designer/' },
          { text: '数据库建模', link: '/schema-designer/' },
          { text: '数据准备', link: '/data-prep/' }
        ]
      },
      { text: 'Demo 演示', link: 'https://demo.gadmin.top/', target: '_blank' }
    ],
    sidebar: {
      // 须写在 /guide/ 之前：更长前缀优先
      "/guide/designers": designersSidebar,
      "/report-designer/": [
        {
          text: '报表设计器',
          items: [
            { text: '概述', link: '/report-designer/' },
            { text: '基础用法', link: '/report-designer/usage' },
            { text: '数据绑定', link: '/report-designer/data-binding' },
            { text: '数据模型', link: '/report-designer/schema' },
            { text: '图表配置', link: '/report-designer/chart-config' }
          ]
        }
      ],
      "/schema-designer/": [
        {
          text: '数据库建模',
          items: [
            { text: '概述', link: '/schema-designer/' },
            { text: '基础用法', link: '/schema-designer/usage' },
            { text: '数据模型', link: '/schema-designer/schema' },
            { text: '表关联', link: '/schema-designer/relations' }
          ]
        }
      ],
      "/data-prep/": [
        {
          text: '数据准备',
          items: [
            { text: '概述', link: '/data-prep/' },
            { text: '基础用法', link: '/data-prep/usage' },
            { text: '数据模型', link: '/data-prep/schema' },
            { text: '公式度量', link: '/data-prep/formulas' },
            { text: '表关联', link: '/data-prep/joins' }
          ]
        }
      ],
      "/page-designer/": [
        {
          text: '页面设计器',
          items: [
            { text: '概述', link: '/page-designer/' },
            { text: '基础用法', link: '/page-designer/usage' },
            { text: '样式面板', link: '/page-designer/style' },
            { text: '数据源与数据请求', link: '/page-designer/data' },
            { text: '变量绑定', link: '/page-designer/variable-bind' },
            { text: '事件与生命周期', link: '/page-designer/events' },
            { text: '数据模型', link: '/page-designer/schema' }
          ]
        }
      ],
      "/code-sandbox/": [
        {
          text: '代码沙箱',
          items: [
            { text: '概述', link: '/code-sandbox/' },
            { text: '基础用法', link: '/code-sandbox/usage' },
            { text: 'GrowCodeEditor', link: '/code-sandbox/code-editor' },
            { text: 'GrowCodeDeps', link: '/code-sandbox/code-deps' },
            { text: 'GrowCodeSandbox', link: '/code-sandbox/preview' },
            { text: '工具 API 与注意点', link: '/code-sandbox/api' }
          ]
        }
      ],
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
            { text: '组件文档', link: '/components/' },
            { text: '命令式 API', link: '/guide/development/imperative-api' },
            { text: '切换组件库', link: '/guide/development/switch-component-library' },
            { text: '局部覆盖组件库', link: '/guide/development/local-override' }
          ]
        },
        {
          text: '低代码设计器',
          items: [
            { text: '概述', link: '/guide/designers/' },
            { text: '协同工作', link: '/guide/designers/collaboration' },
            { text: '演示与接入', link: '/guide/designers/playground' }
          ]
        },
        {
          text: '代码沙箱',
          items: [
            { text: '概述', link: '/code-sandbox/' },
            { text: '基础用法', link: '/code-sandbox/usage' },
            { text: '工具 API 与注意点', link: '/code-sandbox/api' }
          ]
        },
        {
          text: '页面设计器',
          items: [
            { text: '概述', link: '/page-designer/' },
            { text: '基础用法', link: '/page-designer/usage' },
            { text: '样式面板', link: '/page-designer/style' },
            { text: '数据源与数据请求', link: '/page-designer/data' },
            { text: '变量绑定', link: '/page-designer/variable-bind' },
            { text: '事件与生命周期', link: '/page-designer/events' },
            { text: '数据模型', link: '/page-designer/schema' }
          ]
        },
        {
          text: '报表设计器',
          items: [
            { text: '概述', link: '/report-designer/' },
            { text: '基础用法', link: '/report-designer/usage' },
            { text: '数据绑定', link: '/report-designer/data-binding' },
            { text: '数据模型', link: '/report-designer/schema' },
            { text: '图表配置', link: '/report-designer/chart-config' }
          ]
        },
        {
          text: '数据库建模',
          items: [
            { text: '概述', link: '/schema-designer/' },
            { text: '基础用法', link: '/schema-designer/usage' },
            { text: '数据模型', link: '/schema-designer/schema' },
            { text: '表关联', link: '/schema-designer/relations' }
          ]
        },
        {
          text: '数据准备',
          items: [
            { text: '概述', link: '/data-prep/' },
            { text: '基础用法', link: '/data-prep/usage' },
            { text: '数据模型', link: '/data-prep/schema' },
            { text: '公式度量', link: '/data-prep/formulas' },
            { text: '表关联', link: '/data-prep/joins' }
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
