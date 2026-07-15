---
title: 基础用法
lang: zh-CN
---

# 基础用法

## 仅预览沙箱

适合嵌入页面，只提供 SFC 源码与宿主能力面：

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

完整拼接示例见 `DesignCornerstone/cornerstone-apps-sandbox` 的 `sandbox-overview` 页面。

## 下一步

- [`GrowCodeSandbox` Props / `SandboxExpose`](/code-sandbox/preview)
- [`GrowCodeDeps` 依赖模型](/code-sandbox/code-deps)
- [`GrowCodeEditor` 语言与主题](/code-sandbox/code-editor)
