---
title: 包说明
lang: zh-CN
---

# 什么是包？

包可以简单的理解为不同存放程序的文件夹，包可以区分形同名字的函数以及变量等标识符，当程序很庞大时，我们往往将程序不同部分写在不一样的文件夹（包）中，方便我们对项目的管理，当我们想要控制函数以及变量的访问范围时，我们可以通过将其放置在不同的包来实现。

我们平时接触最多的就是`ndoe_modules`我们通常叫作`依赖包`，也就是项目中所用到的第三方的插件以及工具等，来帮助我们在项目中快速使用。在`Grwo Admin`中利用了`pnpm`的包管理机制，实现各个模块之间的精细化管理，可以让我们的项目更加的灵活和高可用。

## 每个包是做什么的？

在项目中包含了`7`个包，每个包在项目中都起到了很重要的作用，具体功能如下：

- grow_admin_icons: 用于处理svg相关图标
- grow_components: 非系统相关的公用组件
- grow_designer: 设计器引擎
- grow_flow: 规则引擎
- grow_up_admin: 管理系统(主要)
- grow_utils: 公用工具

## 目录结构

### grow_admin_icons 

```sh
grow_admin_icons
  ├──src # 主目录
  │   ├──index.ts # 主入口文件
  │   ├──svgs  # svg文件
  │   └──package # 组件管理文件
  ├──.babelrc # babel配置文件
  ├──rollup.config.mjs # rollup配置文件
  ├──shims.d.ts # 声名文件
  └──tsconfig.json # typescript配置文件
```

### grow_components 目录结构

```sh
grow_components
  ├──src # 主目录
  │   ├──index.ts # 主入口文件
  │   └──packages # 组件管理文件
  ├──.babelrc # babel配置文件
  ├──rollup.config.mjs # rollup配置文件
  ├──shims.d.ts # 声名文件
  └──tsconfig.json # typescript配置文件
```

### grow_designer 目录结构

```sh
grow_designer
  ├──src # 主目录
  │   ├──index.ts # 主入口文件
  │   └──packages # 组件管理文件
  ├──.babelrc # babel配置文件
  ├──rollup.config.mjs # rollup配置文件
  ├──shims.d.ts # 声名文件
  └──tsconfig.json # typescript配置文件
```

### grow_flow 目录结构

```sh
grow_flow
  ├──src # 主目录
  │   ├──index.ts # 主入口文件
  │   └──packages # 组件管理文件
  ├──.babelrc # babel配置文件
  ├──rollup.config.mjs # rollup配置文件
  ├──shims.d.ts # 声名文件
  └──tsconfig.json # typescript配置文件
```

### grow_rule_engine 目录结构

```sh
grow_rule_engine
  ├──src # 主目录
  │   ├──index.ts # 主入口文件
  │   └──packages # 组件管理文件
  ├──.babelrc # babel配置文件
  ├──rollup.config.mjs # rollup配置文件
  ├──shims.d.ts # 声名文件
  └──tsconfig.json # typescript配置文件
```

### grow_up_admin 目录结构

```sh
grow_up_admin
  ├──build # 打包相关配置
  ├──mock # mock数据
  ├──public # 公用打包文件
  ├──src # 主目录
  │   ├──index.ts # 主入口文件
  │   ├──apis
  │   ├──assets # 资源文件
  │   │   ├──icons # icon sprite 图标文件夹
  │   │   ├──images # 项目存放图片的文件夹
  │   │   └──svg # 项目存放svg图片的文件夹
  │   ├──components # 公共组件
  │   │   ├──base # 基础组件
  │   │   ├──business # 业务组件
  │   │   └──public # 公用组件
  │   ├──hooks # 公用hooks
  │   ├──language # 多语言配置文件
  │   ├──pages # 页面
  │   ├──plugins # 项目依赖的插件
  │   ├──routers # 路由配置文件
  │   ├──stores # 全局状态管理
  │   ├──styles # 样式
  │   ├──utils # 项目内部工具
  │   ├──index.ts # 主入口文件 
  │   └──setting.ts # 系统配置文件
  ├──types #  ts类型文件
  ├──postcss.config.js # css预处理配置
  ├──tailwind.config.cjs # tailwindcss配置文件
  ├──shims.d.ts # 声名文件
  ├──tsconfig.json # typescript配置文件
  └──vite.config.ts # vite配置文件
```

### grow_utils 目录结构

```sh
grow_utils
  ├──src # 主目录
  │   ├──index.ts # 主入口文件
  │   └──packages # 工具管理文件
  ├──types # 类型说明文件
  ├──.babelrc # babel配置文件
  ├──rollup.config.mjs # rollup配置文件
  ├──shims.d.ts # 声名文件
  └──tsconfig.json # typescript配置文件
```


