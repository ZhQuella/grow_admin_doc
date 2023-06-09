---
title: 指南
lang: zh-CN
---

# Grow Admin是什么？

`Grow Admin`是一个基于`Vue3.0+`、`Vite`、`Element Plus`、`TypeScript`的后台解决方案，目标是为了是给企业级开发提供一个快速且方便的解决方案。

项目中包含的`二次封装组件`、`utils`、`hooks`、`动态菜单`、`权限校验`、`按钮级别权限`等企业开发所需要的功能，以便达到开箱即用的效果，可以帮助你可以快速的搭建企业级中后台产品原型。

## 与其他Admin框架有什么不同？

`Grow Admin`框架整体项目结构上与传统的`Admin`框架相比，打破了以往的项目结构，使用的了`packages`的方式，将于项目自身关联性较弱的组件以及公共方法独立管理开发。除了基于组件库二开组件之外，还开发了很多组件库中不包含的组件以便减少开发者的开发成本。

除此之外框架内部会添加表格转化图形的功能，用户可以通过透视表格更快速的浏览数据。

## 为什么使用packages?

在企业级项目开发过程中会有多个项目开发，但是这些分散的项目会有很多冗余的代码，这些代码是又是可以相互使用的，使用`packages`对冗余的代码进行分割，在部署的时候将独立打包的库分别部署到线上，如果代码中存在`Bug`的话只需要更改远程库所有的项目所依赖的问题得到了统一的解决。

使用`packages`对项目进行分割，使得项目更加的清晰，对于项目中一些复杂的代码逻辑以及组件可以独立维护。

::: warning 温馨提示
`Grow Admin`中对于`packages`的管理是基于`pnpm`进行开发的，所以对于构建工具的请使用`pnpm`。
:::

## 未来的规划是什么？

`Grow Admin`对于迭代版本将会逐步的添加`流程引擎`、`低代码引擎`、`规则引擎`等一系列的内容，构建一个可以快速开发迭代的平台型框架，用极少数的代码完成项目中模块的迭代。同时项目中也可以使用代码开发的模式进行，低代码和项目本身是相互不受影响的。这也是使用`packages`的好处项目中将会把上述引擎进行模块化开发，使得项目自身不会很臃肿。

目前系统的搭建全部都是前端开发人员，还没有架设同步的`admin`框架系统，当前端内容完善之后会考虑架设后端管理系统。目前考虑会架设两个版本分别是`Java`与`Golang`两种语言供开发者选择。
