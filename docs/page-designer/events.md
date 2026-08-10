---
title: 页面设计器 · 事件与生命周期
lang: zh-CN
---

# 事件与生命周期

页面设计器支持三类「脚本型」能力，均基于代码编辑（Monaco / 代码沙箱）：

| 类型 | 存储位置 | 入口 |
|------|----------|------|
| 组件事件 | `events[uuid][eventType]` | 选中节点 → 右侧「事件」 |
| 页面生命周期 | `pageConfig.events` | 左轨「页面事件」 |
| 数据监听 | `pageConfig.watchers` | 左轨「数据监听」 |
| 属性计算 | `computedProps` | 左轨「属性计算」 |

运行时可通过 `state`、`refs`（需节点配置 `refName`）等上下文执行脚本。

## 组件事件

选中节点后，右侧「事件」Tab 按组件类型列出可绑事件（来自 `elementEvents`，如点击、变更、打开关闭等）。

```ts
events: {
  [uuid: string]: {
    [eventType: string]: {
      name: string
      eventType: string
      code: string
      enabled: boolean
    }
  }
}
```

| 字段 | 说明 |
|------|------|
| `eventType` | 如 `onClick`、`onChange` |
| `code` | 事件处理函数体 |
| `enabled` | 是否启用 |

## 页面生命周期

左轨「页面事件」配置 Vue 风格生命周期，写入 `pageConfig.events`：

| eventType | 说明 |
|------|------|
| `onBeforeMount` | 挂载前 |
| `onMounted` | 挂载完成 |
| `onBeforeUpdate` / `onUpdated` | 更新前 / 后 |
| `onBeforeUnmount` / `onUnmounted` | 卸载前 / 后 |
| `onActivated` / `onDeactivated` | keep-alive 激活 / 停用 |
| `onErrorCaptured` | 捕获后代错误（`event` 为错误对象） |

结构与组件事件项相同（`name` / `eventType` / `code` / `enabled`）。

## 数据监听

左轨「数据监听」对 `state` 上的路径建立 `watch`：

```ts
pageConfig.watchers: {
  [source: string]: {
    name: string
    source: string      // 监听路径，如 state.xxx 或字段名
    code: string        // 变化时执行的脚本
    enabled: boolean
    deep: boolean
    immediate: boolean
  }
}
```

适合在数据源 / 接口回写后联动更新其它 state 或触发副作用。

## 属性计算

左轨「属性计算」配置基于 `dataSource` 派生的计算项，结果并入运行时 `state`（与数据源同级可被变量绑定引用）。

```ts
type DesignerComputedPropItem = {
  id: string
  name: string
  description: string
  /** 函数体，可使用 state，须 return 返回值 */
  code: string
}
```

`buildRuntimeState(dataSource, computedProps)` 会先求值数据源，再求值计算属性。

## 函数绑定（props）

部分组件 props（回调类）支持 **函数绑定**（`propBindModes = 'function'`），与变量绑定不同：

- 变量绑定（`bind`）：表达式求值后作为属性值
- 函数绑定（`function`）：属性为可调用函数；编辑器提示可用参数及 `state` / `refs`

详见 [变量绑定](/page-designer/variable-bind)。

## 相关文档

- [基础用法](/page-designer/usage)
- [数据源与数据请求](/page-designer/data)
- [变量绑定](/page-designer/variable-bind)
- [数据模型](/page-designer/schema)
- [代码沙箱](/code-sandbox/)
