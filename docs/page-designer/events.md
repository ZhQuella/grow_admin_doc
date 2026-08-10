---
title: 页面设计器 · 事件与生命周期
lang: zh-CN
---

# 事件与生命周期

页面设计器把「脚本能力」拆成多处入口，编辑器统一为 `GrowCodeEditor`（`@grow-admin-rock/code-sandbox`）。本节按入口说明存储位置、可用 globals、表单校验与运行时机。

## 总览

| 类型 | 存储位置 | 入口 | 编辑器 globals（常量） |
|------|----------|------|------------------------|
| 组件事件 | `events[uuid][eventType]` | 选中节点 → 右侧「事件」 | `CODE_EDITOR_EVENT_GLOBALS`：`event` / `state` / `apis` / `refs` |
| 页面生命周期 | `pageConfig.events` | 左轨「页面事件」 | 同上（生命周期无 DOM event 时仍可注入） |
| 数据监听 | `pageConfig.watchers` | 左轨「数据监听」 | `CODE_EDITOR_WATCH_GLOBALS`：`value` / `oldValue` / `state` / `refs` |
| 属性计算 | `computedProps` | 左轨「属性计算」 | `CODE_EDITOR_STATE_GLOBALS`：`state` |
| 函数绑定（props） | `props` + `propBindModes=function` | 右侧「属性」 | 声明参数 + `state` / `refs` |

运行前会 `buildRuntimeState`，并提供：

- `state`：数据源 + 计算属性 + API 回写  
- `apis`：按数据请求 `name` 调用，如 `apis.getList()`  
- `refs`：仅当节点「高级」里配置了 **Ref 名称**（`renderArgument.refName`）  

## 组件事件

选中节点 →「事件」Tab。可选事件列表来自 `elementEvents`（按 `elTagName`），找不到时回落通用 DOM 事件集。

```ts
events: {
  [uuid: string]: {
    [eventType: string]: {
      name: string
      eventType: string  // 如 onClick、onChange
      code: string       // 函数体
      enabled: boolean
    }
  }
}
```

### 编写示例

```js
// 可用：event, state, apis, refs
apis.getList?.()
message // 若未注入则不可用；优先用宿主 expose 的能力
refs.form?.validate?.()
state.loading = true
```

| 字段 | 说明 |
|------|------|
| `enabled` | 关闭后不挂载监听 |
| `code` | 不需要包 `function () { ... }`，按编辑器约定写函数体 |

常见事件类型因组件而异：按钮点击、输入变更、弹层打开关闭、上传回调等。以面板列出的为准。

## 页面生命周期

左轨「页面事件」→ 列表 + 添加 / 编辑抽屉。选项来自 `PAGE_LIFECYCLE_EVENTS`：

| eventType | 中文 | 说明 |
|------|------|------|
| `onBeforeMount` | 挂载前 | 对应 Vue `onBeforeMount` |
| `onMounted` | 挂载完成 | 适合首次拉数（若未用 apiOutlined autoLoad） |
| `onBeforeUpdate` / `onUpdated` | 更新前 / 后 | 响应式更新周期 |
| `onBeforeUnmount` / `onUnmounted` | 卸载前 / 后 | 清理定时器等 |
| `onActivated` / `onDeactivated` | 被激活 / 停用 | keep-alive 场景 |
| `onErrorCaptured` | 捕获错误 | `event` 为错误对象 |

存储形状与组件事件项相同，落在 `pageConfig.events`。

空态提示类似：「暂无页面事件，点击右上角添加」。

`GrowRenderer` / 预览会在对应生命周期执行 `enabled` 为 true 的脚本。报表设计器左轨也复用「页面事件」面板，行为对齐。

## 数据监听

左轨「数据监听」为 `state` 建立 `watch`：

```ts
pageConfig.watchers: {
  [sourceKey: string]: {
    name: string
    source: string      // 监听源，如某数据源 name 或路径
    code: string
    enabled: boolean
    deep: boolean
    immediate: boolean
  }
}
```

| 字段 | 说明 |
|------|------|
| `source` | 监听哪一段 state |
| `deep` | 深度监听对象 / 数组 |
| `immediate` | 立即以当前值执行一次 |
| `code` | 变化时执行；globals 含 `value`、`oldValue` |

适合：接口回写后派生字段、联动清空表单、触发另一个 `apis.xxx()`。

## 属性计算

左轨「属性计算」：

```ts
type DesignerComputedPropItem = {
  id: string
  name: string          // 挂到 state.名称
  description: string
  code: string          // 须 return；可使用 state
}
```

校验：名称必填；不可与其它计算属性或数据源重名（warning「名称与计算属性或其它数据源重复」）。

```js
// 示例：从列表派生长度
return (state.list || []).length
```

求值顺序：先数据源字面量 → 再计算属性 → API 回写后可再 `recomputeComputedProps`。计算结果与数据源一样出现在变量绑定列表中。

## 函数绑定（属性级）

与「变量绑定」不同：目标是**回调函数**，不是求值后的静态值。

1. 属性面板中由 `functionBind(...)` 配置的字段可打开「函数绑定」对话框  
2. 提示可用参数（如上传的 file 列表参数）以及 `state`、`refs`  
3. 确定后 `propBindModes[uuid][key] = 'function'`  

详见 [变量绑定](/page-designer/variable-bind)。

## 与代码沙箱的关系

| 场景 | 组件 |
|------|------|
| 事件 / 监听 / 计算属性 | `GrowCodeEditor` + 对应 `CODE_EDITOR_*_GLOBALS` |
| 变量绑定弹窗 | `GrowCodeEditor`（表达式） |
| 函数绑定弹窗 | `GrowCodeEditor`（javascript） |

独立沙箱演示见 [代码沙箱](/code-sandbox/)；设计器内嵌时一般关闭语言切换，并注入限定 globals，避免用户选错语言。

## 调试建议

1. 先在「数据源」放静态数据，用变量绑定确认 `state.xxx` 通  
2. 再开「数据请求」autoLoad，在 `didFetch` 或页面 `onMounted` 里打日志（若宿主注入了 console / message）  
3. 需要调用组件方法时，在「高级」填 Ref 名称，事件里用 `refs.xxx`  
4. 「查看数据」核对 `events` / `pageConfig` / `computedProps` 是否写入 schema  

## 相关文档

- [基础用法](/page-designer/usage)
- [数据源与数据请求](/page-designer/data)
- [变量绑定](/page-designer/variable-bind)
- [数据模型](/page-designer/schema)
- [代码沙箱](/code-sandbox/)
- [报表设计器](/report-designer/)（复用页面事件与数据面板）
