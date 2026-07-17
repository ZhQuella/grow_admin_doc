---
title: 页面设计器 · 数据源与数据请求
lang: zh-CN
---

# 数据源与数据请求

左侧轨道中的 **数据源**、**数据请求** 面板用于配置页面级静态数据与远程请求。配置写入 `draggableConfig`，以 **数组** 形式持久化，可在「查看数据」中看到完整 JSON。

| 面板 | 配置字段 | 源码目录 |
|------|----------|----------|
| 数据源 | `dataSource` | `components/dataSource/` |
| 数据请求 | `apiOutlined` | `components/apiOutlined/` |

## 通用交互

两个列表面板行为一致：

| 操作 | 说明 |
|------|------|
| 添加 | 右上角「添加」，打开右侧抽屉表单 |
| 编辑 | 仅点击列表项的 **编辑** 按钮打开表单（点击整行不会打开） |
| 删除 | 列表项悬停后的删除按钮 |
| 排序 | 拖拽左侧手柄调整数组顺序 |

表单抽屉标题：新增为「添加…」，编辑为「修改…」。保存校验名称必填且不可与同列表其它项重名。

## 数据源

用于存放页面可用的静态 / 变量数据（编辑器内写法与 JS 一致）。

### 字段

```ts
type DesignerDataSourceItem = {
  id: string
  name: string          // 名称（唯一）
  description: string   // 描述
  data: string          // 数据内容（GrowCodeEditor，默认空）
}
```

### 表单说明

- **名称 / 描述**：基础信息
- **数据**：代码编辑区；悬停「查看示例」可看到类型写法（字符串、数字、布尔、对象、数组、空值）

存储示例：

```json
{
  "dataSource": [
    {
      "id": "…",
      "name": "dp2",
      "description": "",
      "data": "{ list: [], total: 0 }"
    }
  ]
}
```

## 数据请求

用于配置远程接口：地址、方法、参数、生命周期处理函数与默认数据。

### 字段

```ts
type DesignerApiParam = { key: string; value: string }

type DesignerApiProcessorType = 'willFetch' | 'fit' | 'didFetch' | 'onError'

type DesignerApiProcessor = {
  id: string
  type: DesignerApiProcessorType
  code: string
}

type DesignerApiOutlinedItem = {
  id: string
  name: string
  description: string
  autoLoad: boolean                 // 自动加载
  loadType: 'serial' | 'parallel'   // 串行 / 并行
  url: string                       // 请求地址
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params: DesignerApiParam[]        // 请求参数键值对
  shouldFetch: boolean              // 是否发送请求
  processors: DesignerApiProcessor[] // 数据处理函数
  defaultData: string               // 默认数据（代码字符串）
}
```

### 表单分区

| 区块 | 说明 |
|------|------|
| 基础 | 名称、描述、自动加载、加载方式、请求地址、请求方法 |
| 请求参数 | 「添加一项」维护 `key` / `value` 列表 |
| 是否发送请求 | 开关；关闭后不发起请求 |
| 数据处理 | 见下文 |
| 默认数据 | 首屏可用的默认值；**不含** `success`、`content` 一层包装 |

### 数据处理函数

点击「+」从下拉选择类型添加；**每种类型只能添加一个**：

| 类型 | 说明 |
|------|------|
| `willFetch` | 请求发送前处理 |
| `fit` | 请求返回时的数据适配 |
| `didFetch` | 请求完成回调 |
| `onError` | 请求错误处理 |

四种均已添加后，「+」禁用。删除某一项后可再次添加该类型。

### 存储示例

```json
{
  "apiOutlined": [
    {
      "id": "…",
      "name": "dp5",
      "description": "",
      "autoLoad": true,
      "loadType": "parallel",
      "url": "https://example.com/api/list",
      "method": "GET",
      "params": [{ "key": "page", "value": "1" }],
      "shouldFetch": true,
      "processors": [
        { "id": "…", "type": "fit", "code": "return data" }
      ],
      "defaultData": ""
    }
  ]
}
```

## 组件结构（源码）

便于二次开发时定位：

```
dataSource/
  index.vue          # 面板入口
  SourceList.vue     # 可排序列表
  SourceForm.vue     # 新增 / 编辑表单
  types.ts
  use/useDataSource.ts

apiOutlined/
  index.vue
  ApiList.vue
  ApiForm.vue
  ApiProcessors.vue  # 数据处理
  ApiDefaultData.vue # 默认数据
  types.ts / constants.ts
  use/useApiOutlined.ts

shared/
  DataExamplePopover.vue  # 「查看示例」
```

## 相关文档

- [数据模型](/page-designer/schema) — `draggableConfig` 顶层字段
- [基础用法](/page-designer/usage) — 左侧面板一览
