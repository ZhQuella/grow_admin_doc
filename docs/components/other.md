---
title: 其他组件
lang: zh-CN
---

# 其他组件

常用预设组件速览。

## GrowIconify

基于 Iconify / purge-icons 的图标组件。

```vue
<GrowIconify icon="ant-design:search-outlined" :size="18" />
```

| 属性 | 说明 |
|------|------|
| `icon` | 图标名，如 `ant-design:xxx`、`carbon:xxx` |
| `size` | 尺寸，默认 `16` |
| `color` / `hoverColor` / `hoverPointer` / `infinite` | 颜色与交互 |

演示中布局、SearchBar、ColumnBar 均大量使用。

## GrowSplitPane

分屏布局预设，子路径导出：

```ts
import type { SplitPaneItem } from '@grow-admin-rock/components/split-pane'
import { GrowSplitPane } from '@grow-admin-rock/components/split-pane'
```

演示：功能示例 → **分屏组件**。

```vue
<GrowSplitPane :tree-data="treeData" :root-horizontal="false">
  <template #ComA>面板 A</template>
  <template #ComB>面板 B</template>
</GrowSplitPane>
```

## 相关

- [组件文档首页](/components/)
- [Grow 契约组件](/guide/development/grow-components)
