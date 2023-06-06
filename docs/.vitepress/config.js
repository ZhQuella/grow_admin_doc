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
      { icon: 'github', link: 'https://github.com/ZhQuella/grow_up_admin' }
    ],
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/built-component/' },
      { text: '工具', link: '/built-utils/' },
      { text: '表单设计器', link: '/form-designer/' },
      { text: '流程设计器', link: '/process-designer/' },
      { text: '规则设计器', link: '/rule-designer/' }
    ],
    sidebar: {
      "/guide/": [{
        text: '介绍',
        collapsible: true,
        collapsed: true,
        items: [
          {
            text: "简介",
            link: '/guide/'
          },
          {
            text: "快速上手",
            link: '/guide/getting-started'
          },
          {
            text: "包说明",
            link: '/guide/module-description'
          }
        ]
      }],
      "/built-component/": [{
        text: '介绍',
        collapsible: true,
        collapsed: true,
        items: [{
          text: "简介",
          link: '/built-component/'
        }]
      }],
      "/built-utils/": [{
        text: '介绍',
        collapsible: true,
        collapsed: true,
        items: [{
          text: "简介",
          link: '/built-utils/'
        }]
      }],
      "/form-designer/": [{
        text: '介绍',
        collapsible: true,
        collapsed: true,
        items: [{
          text: "简介",
          link: '/form-designer/'
        }]
      }],
      "/process-designer/": [{
        text: '介绍',
        collapsible: true,
        collapsed: true,
        items: [{
          text: "简介",
          link: '/process-designer/'
        }]
      }],
      "/rule-designer/": [{
        text: '介绍',
        collapsible: true,
        collapsed: true,
        items: [{
          text: "简介",
          link: '/rule-designer/'
        }]
      }]
    }
  }
};
