---
title: 组件
lang: zh-CN
---

# Componet包的作用是什么？

`Grow Admin`整体`UI`框架是基于`Element-plus`，虽然`Element-plus`相对来说功能组件相比`Element-ui`来说还是比较完善的，但是在开发过程中可能会有很多情况，
但是组件仍然覆盖不到。

其组件包中所有的组件都是与业务绝对独立的，没有和业务产生任何关联，建议开发者在使用的过程中同样保持该原则，这样可以对你的代码以及整体架构有一个清晰的分层。如果也想有一个业务型的组件管理，建议单独创建一个库去管理把业务组件和基础组件彻底分开。

# 组件全是自主开发组件吗？

组件中有部分是自主开发的组件，有的组件为了开发简单使用也引用了第三方的工具包，也有部分组件是基于`Element-plus`组件进行二开的在`Element-plus`之上做了一些通用
性的封装。 比如：`Dialog`的全屏和拖拽做了默认值的修改。

其中还添加了一些自主开发的组件，`数字滚动`、`分屏`、`详情展示`等，这些组件的开发，只是为了在项目整体开发上更加流畅，不再为了一些简单的事情做重复的工作，让使用框
架的开发者更加的专注业务。

内容待补充...

