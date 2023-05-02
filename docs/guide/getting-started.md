---
title: Grwo Admin 快速上手
lang: zh-CN
---

# 快速上手

从这里开始我们将开始使用`Grwo Admin`，但是在开始之前我们需要做一些准备工作来帮助我们可以快速开发，项目本身环境会对与`Node`版本有所限制。本项目需要一定前端基础知识，请确保掌握`Vue`的基础知识，以便能处理一些常见的问题。

## 需要掌握的知识

建议在开发前先学一下以下内容，提前了解和学习这些知识，会对项目理解非常有帮助:

- [Vite2](https://cn.vitejs.dev/)
- [Vue3](https://cn.vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/zh/)
- [VueRouter4](https://router.vuejs.org/zh/)
- [VueUse](https://vueuse.org/)
- [axios](http://axios-js.com/)
- [Element-Plus](https://element-plus.gitee.io/zh-CN/)
- [Echarts](https://echarts.apache.org/zh/index.html)
- [xicons](https://xicons.org/#/)
- [taillwindCSS](https://tailwindcss.com/)

## 步骤 1: 环境准备

如果你已经对`Grwo Admin`的[介绍](/guide/)有过相关阅读，项目中使用了`packages`对项目整体进行管理。在开始之前我们应该对开发环境进行配置，具体环境要求如下：

- nodejs ≤ 16.20.0
- pnpm ≤ 8.3.1
- git 

::: warning 温馨提示
对于`Node`版本不方便切换的同学，可以使用`nvm`对`Node`版本进行管理
:::

### 安装pnpm

必须使用`pnpm`进行依赖安装（若其他包管理器安装不了需要自行处理）。

如果未安装`pnpm`，可以用下面命令来进行全局安装。

```sh
# 全局安装pnpm
npm install -g pnpm
# 验证
pnpm -v # 出现对应版本号即代表安装成功
```

## 步骤 2: 本地运行

通过如下操作对项目进行拉取到本第，安装依赖之后即可运行。

```sh
# 拉取代码
git clone https://github.com/ZhQuella/grow_up_admin.git

# 安装依赖
pnpm install

# 运行项目
pnpm run dev

# 打包
pnpm run build
```

::: warning 温馨提示
一定要使用`pnpm`安装项目依赖，否则依赖可能安装不上。
:::

## npm script介绍

```json
{
  "scripts": {
    //  限制工具为pnpm
    "preinstall": "npx only-allow pnpm",
    //  启动所有packages项目
    "dev": "node ./scripts/dev.js",
    //  打包所有packages项目
    "build": "node ./scripts/build.js",
    //  预览打包后系统
    "preview": "pnpm --filter grow_up_admin preview",
    //  只启动系统
    "grow_admin:dev": "pnpm --filter grow_up_admin dev",
    //  只打包系统
    "grow_admin:build": "pnpm --filter grow_up_admin build",
    //  只启动组件项目
    "grow_com:dev": "pnpm --filter grow_components dev",
    //  只打包组件项目
    "grow_com:build": "pnpm --filter grow_components build",
    //  只启动icon项目
    "grow_icon:dev": "pnpm --filter grow_admin_icons dev",
    //  只打包icon项目
    "grow_icon:build": "pnpm --filter grow_admin_icons build",
    //  只启动页面设计器项目
    "grow_des:dev": "pnpm --filter grow_designer dev",
    //  只打包页面设计器项目
    "grow_des:build": "pnpm --filter grow_designer build",
    //  只启动规则引擎项目
    "grow_rule:dev": "pnpm --filter grow_rule_engine dev",
    //  只打包规则引擎项目
    "grow_rule:build": "pnpm --filter grow_rule_engine build",
    //  只启动流程引擎项目
    "grow_flow:dev": "pnpm --filter grow_flow dev",
    //  只打包流程引擎项目
    "grow_flow:build": "pnpm --filter grow_flow build",
    //  只启动工具管理项目
    "grow_utils:dev": "pnpm --filter grow_utils dev",
    //  只打包工具管理项目
    "grow_utils:build": "pnpm --filter grow_utils build",
    //  美化代码
    "bea": "npx prettier -w -u .",
    //  代码格式化验证
    "lint": "eslint --no-error-on-unmatched-pattern --ext .vue --ext .ts --ext .tsx packages/**/ --fix"
  }
}
```
