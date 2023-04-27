import { defineConfig } from 'vitepress';
const path = require('path');

export default defineConfig({
  title: "Grow Admin",
  base: '/docs/',
  cleanUrls: 'with-subfolders'，
  head: [
    [
      'link',{ rel: 'icon', href: '/favicon.ico' }
    ]
  ]
});
