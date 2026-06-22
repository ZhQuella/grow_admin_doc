---
title: 命令式 API
lang: zh-CN
---

# 命令式 API

除模板中的 `Grow*` 组件外，消息提示、通知、对话框等**命令式 API** 也通过桥接层统一暴露。切换组件库时业务代码无需 `import element-plus` / `naive-ui` / `ant-design-vue`。

## 绑定机制

宿主应用在 `init-components-driver.ts` 安装驱动时，调用 `setMessage` / `setNotice` / `setDialog` 注入当前组件库的实现：

| 组件库 | Message | Notification | Dialog |
|--------|---------|--------------|--------|
| Element Plus | `ElMessage` | `ElNotification` | `ElMessageBox` |
| Naive UI | `useMessage()` | `useNotification()` | `useDialog()` |
| Ant Design Vue | `message` | `notification` | `Modal` |

```
init-components-driver.ts
        ↓ setMessage / setNotice / setDialog
@grow-admin-rock/components
        ↓ useMessage() / useNotice() / useDialog()
业务代码（统一 import，无需感知底层库）
```

## Provider 包裹（必须）

Naive UI 的 `useMessage()` 等必须在 `GrowMessageProvider` 子树的组件 `setup` 中调用。Element Plus / Ant Design Vue 也建议保持相同结构，便于三库切换时代码一致。

```vue
<template>
  <GrowConfig>
    <GrowNotificationProvider>
      <GrowMessageProvider>
        <GrowDialogProvider>
          <router-view />
        </GrowDialogProvider>
      </GrowMessageProvider>
    </GrowNotificationProvider>
  </GrowConfig>
</template>
```

::: warning 调用位置
`useMessage()` 必须在 Provider **子组件** 的 `setup` 中调用，不可在根组件 `setup` 中直接调用（此时 Provider 尚未挂载）。
:::

## 统一入口

```typescript
import { useMessage, useNotice, useDialog } from '@grow-admin-rock/components';

// useMessage 是 useMsg 的别名，两者等价
const message = useMessage();
const notice = useNotice();
const dialog = useDialog();
```

## Message（消息提示）

三库均支持相同调用方式：

```typescript
message.success('操作成功');
message.error('操作失败');
message.warning('请注意');
message.info('提示信息');
```

## Notification（通知）

各库参数名略有差异，建议同时传入兼容字段：

```typescript
notice.success({
  title: '通知标题',
  content: '通知内容',      // Naive UI
  message: '通知内容',      // Element Plus
  description: '通知内容',  // Ant Design Vue
});
```

## Dialog（对话框）

三库 API 差异较大，需按库分支处理：

```typescript
import { ComponentLibraryType } from '@grow-admin-rock/types';
import { useDialog } from '@grow-admin-rock/components';
import { projectSetting } from '@/projectSetting';

function showConfirm() {
  const dialog = useDialog();
  if (!dialog) return;

  // Naive UI
  if (typeof dialog.warning === 'function') {
    dialog.warning({
      title: '确认操作',
      content: '确定要执行此操作吗？',
      positiveText: '确定',
      negativeText: '取消',
    });
    return;
  }

  // Ant Design Vue
  if (projectSetting.componentLibrary === ComponentLibraryType.AntDesignVue) {
    dialog.confirm({
      title: '确认操作',
      content: '确定要执行此操作吗？',
    });
    return;
  }

  // Element Plus
  if (typeof dialog.confirm === 'function') {
    dialog.confirm('确定要执行此操作吗？', '确认操作');
  }
}
```

## 完整示例

在任意业务页面中验证命令式 API（确保根组件已包裹 Provider，见 `sample/src/App.vue`）：

```vue
<script setup lang="ts">
import { useMessage, useNotice, useDialog } from '@grow-admin-rock/components';

const message = useMessage();
const notice = useNotice();
const dialog = useDialog();

function handleMessage(type: 'success' | 'error' | 'warning' | 'info') {
  message?.[type]?.('这是一条 Message 提示');
}

function handleNotice() {
  notice?.success?.({
    title: '通知标题',
    content: '这是一条 Notification 通知',
    message: '这是一条 Notification 通知',
    description: '这是一条 Notification 通知',
  });
}
</script>

<template>
  <GrowButton type="primary" @click="handleMessage('success')">Message Success</GrowButton>
  <GrowButton @click="handleNotice">Notification</GrowButton>
</template>
```

启动 `pnpm serve` 后点击页面按钮即可验证。

## API 对照速查

| 能力 | 统一入口 | 三库一致性 | 备注 |
|------|----------|-----------|------|
| 消息提示 | `useMessage()` / `useMsg()` | ✅ 完全一致 | `.success()` `.error()` `.warning()` `.info()` |
| 通知 | `useNotice()` | ⚠️ 参数名不同 | 建议同时传 `title` + `content`/`message`/`description` |
| 对话框 | `useDialog()` | ⚠️ 方法不同 | Naive `.warning()`，EP `confirm(msg, title)`，Antdv `confirm({ title, content })` |

## 开发规范

| ✅ 推荐 | ❌ 禁止 |
|---------|---------|
| `import { useMessage } from '@grow-admin-rock/components'` | `import { ElMessage } from 'element-plus'` |
| 在 Provider 子组件中调用 `useMessage()` | 在根组件 setup 中直接调用 |
| 通过 `projectSetting` 切换库后自动切换底层实现 | 业务模块内手动绑定各库 Message API |
