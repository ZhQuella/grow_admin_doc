---
title: 代码沙箱 · 基础用法
lang: zh-CN
---

# 基础用法

代码沙箱提供三块能力，可单独使用，也可拼成「编辑器 + 依赖 + 预览」三分屏。各低代码设计器内嵌的脚本 / 公式 / SQL 编辑，底层同样是这里的 `GrowCodeEditor`。

演示菜单（`apps-sandbox`）：

| 菜单 | 说明 |
|------|------|
| 沙箱工具 | 三分屏完整示例 |
| 呈现沙箱 / 代码沙箱 | 仅预览 |
| 代码编辑器 | 仅编辑器（可切语言） |

## 仅预览沙箱

适合嵌入业务页，只提供 SFC 与宿主能力面：

```vue
<template>
  <div class="h-full overflow-hidden">
    <GrowCodeSandbox
      v-model="editorCode"
      :expose="sandboxExpose"
      :dependencies="dependencies"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CodeDependency, SandboxExpose } from '@grow-admin-rock/code-sandbox'
import {
  GrowCodeSandbox,
  composeVueSfc,
  DEFAULT_SANDBOX_DEPENDENCIES,
  mergeDependencies,
} from '@grow-admin-rock/code-sandbox'
import { useMsg } from '@grow-admin-rock/components'
import { diKT } from '@grow-admin-rock/ioc'
import { Lib as infrastructureLib } from '@grow-admin-rock/infrastructure'
import * as GrowState from '@grow-admin-rock/state'
import * as GrowRouter from '@grow-admin-rock/middleware-router'
import * as GrowUtils from '@grow-admin-rock/utils'
import * as GrowHooks from '@grow-admin-rock/hooks'

const useRequest = () => diKT(infrastructureLib.types.InfrastructureAxios)

const editorCode = ref(
  composeVueSfc({
    template: `<GrowButton type="primary" @click="onClick">Hello</GrowButton>`,
    script: `import { useMsg } from '@grow-admin-rock/components'
const message = useMsg()
function onClick() {
  message.success('ok')
}`,
    style: ``,
    scriptLang: 'ts',
    styleScoped: true,
  }),
)

const sandboxExpose = computed<SandboxExpose>(() => ({
  apis: { useRequest },
  modules: {
    '@grow-admin-rock/components': { useMsg },
    '@grow-admin-rock/state': GrowState,
    '@grow-admin-rock/middleware-router': GrowRouter,
    '@grow-admin-rock/utils': GrowUtils,
    '@grow-admin-rock/hooks': GrowHooks,
  },
}))

const dependencies = ref<CodeDependency[]>(
  mergeDependencies(DEFAULT_SANDBOX_DEPENDENCIES, [
    {
      name: '@grow-admin-rock/components',
      source: 'host',
      kind: 'util',
      enabled: true,
    },
  ]),
)
</script>
```

### GrowCodeSandbox 行为要点

| 项 | 说明 |
|------|------|
| Props | `modelValue` / `files` / `entry`（默认 `App.vue`）/ `expose` / `dependencies` |
| 预览文案 | 「正在加载 npm 依赖…」「请在左侧编辑 Vue SFC 以预览」；编译失败红色展示 |
| 挂载位置 | **宿主 Vue 树内**，可继续用已注册的 `Grow*` 与 IOC |

详见 [沙箱预览](/code-sandbox/preview)。

## 编辑器 + 依赖 + 沙箱

三分屏可配合 `GrowSplitPane`：

```vue
<template>
  <GrowSplitPane :tree-data="treeData" :root-horizontal="false">
    <template #Editor>
      <GrowCodeEditor
        v-model="editorCode"
        default-language="vue"
        :language-switchable="false"
        :options="{ theme: 'auto' }"
      />
    </template>
    <template #Deps>
      <GrowCodeDeps v-model="dependencies" />
    </template>
    <template #Sandbox>
      <GrowCodeSandbox
        v-model="editorCode"
        :expose="sandboxExpose"
        :dependencies="dependencies"
      />
    </template>
  </GrowSplitPane>
</template>
```

完整拼接见 `DesignCornerstone/cornerstone-apps-sandbox` 的 `sandbox-overview` 页面。

## GrowCodeEditor（设计器内嵌时）

| Prop | 常用值 |
|------|------|
| `defaultLanguage` | `javascript` / `sql` / `vue` / `expression` 等 |
| `languageSwitchable` | 设计器内嵌多为 `false` |
| `globals` | 注入补全：事件用 `CODE_EDITOR_EVENT_GLOBALS`，计算属性用 `CODE_EDITOR_STATE_GLOBALS` 等 |

| 场景 | 语言 | globals |
|------|------|---------|
| 页面 / 报表事件 | javascript | `event`, `state`, `apis`, `refs` |
| 数据监听 | javascript | `value`, `oldValue`, `state`, `refs` |
| 计算属性 / 报表 code 绑定 | javascript | `state` |
| 建模 SQL | sql | — |

详见 [GrowCodeEditor](/code-sandbox/code-editor)、[工具 API](/code-sandbox/api)。

## GrowCodeDeps

| 字段 | 说明 |
|------|------|
| 名称 | 必填；锁定项编辑时 disabled |
| 版本 | npm 版本，如 `5.1.5` |
| 来源 | `npm`（esm.sh CDN）或 `host`（宿主 `expose`） |
| 类型 | `api` / `component` / `util` |
| 注入方法名 | npm+api 时，逗号分隔 |
| 启用 | Checkbox |

**默认锁定依赖**（不可取消勾选 / 不可改）：`useRequest`、`@grow-admin-rock/state`、`middleware-router`、`utils`、`hooks`。

详见 [依赖注入](/code-sandbox/code-deps)。

## 与低代码设计器的关系

代码沙箱**不是**第五个画布设计器，而是共享基础设施：

- 数据库建模：SQL 查询表单  
- 页面 / 报表：事件、监听、计算属性、变量 / 函数 / 代码绑定  
- 数据准备：公式编辑对话框（自研公式引擎 + 编辑体验）  

协同关系见 [低代码设计器](/guide/designers/)。

## 下一步

- [`GrowCodeSandbox` Props / `SandboxExpose`](/code-sandbox/preview)
- [`GrowCodeDeps` 依赖模型](/code-sandbox/code-deps)
- [`GrowCodeEditor` 语言与主题](/code-sandbox/code-editor)
- [工具 API 与注意点](/code-sandbox/api)
