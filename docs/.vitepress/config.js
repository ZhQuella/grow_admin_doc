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
    nav: [
      { text: '指南', link: '/guide/' }
    ],
    sidebar: [
      {
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
      }
    ]
  }
};
