# Findings: 数据清洗文档 vs 源码（2026-08-11）

## 严重过时（必须改）

### 能力边界
- 文档写：尚无本地执行引擎 / Mock HTTP / 仅 Demo 占位采样
- 源码已有：
  - `runCleanFlowLocal` + `CLEAN_IMPLEMENTED_NODE_TYPES`（15 种节点均实现变换）
  - `sample/mock/dataClean.ts`：`GET /data-clean/tables`、`GET /data-clean/table-rows`、`POST /data-clean/preview`
  - 设计器预览走本地管道（`limit` 默认 50），失败回退包内 `demoTables`

### UI / 交互
- 文档写固定右侧 320px 配置栏；实际为画布浮层 `CleanConfigFloat` + `NodeConfigPanel`
- 文档写「预览须选中节点」；实际：有选中 → 预览该节点；无选中 → `toOutput: true` 跑全流至输出
- 文档写仅 table/filter/condition/split-field/output 有配置 UI；实际**全部节点类型**均有配置表单
- 画布限制：只能有一个 `output` 节点

### 数据模型细节
- `fields`（table / output）：`undefined`/`null` = 全部；`[]` = 不输出任何字段（文档写「空 = 全选」不准确）
- `CleanPreviewResult` 已含 `warnings` / `error` / `targetNodeId` / `targetNodeName`
- `CleanOutlierConfig` 含 `min` / `max` / `pattern` / `enumValues`
- 默认 config：`table` 不再默认 `fields: []`；`join.keys` / `groupby.metrics` 有默认占位行
- 导出新增：`runCleanFlowLocal`、`countOutputNodes`、`loadCleanTableRowsMap`、`fetchCleanDemoTables`、`fetchCleanTableRows`、demo 表相关常量

### 仍成立的边界
- 发布状态切换 UI 仍无
- 输出 `consumers` / 与页面·报表正式绑定仍未接通
- Demo 源表列表仍为前端 / Mock 写死，非真实建模/Dataset API
- `buildDemoPreview` 仍导出，但设计器主路径已不用

## 改写清单
1. `docs/data-clean/index.md`
2. `docs/data-clean/usage.md`
3. `docs/data-clean/schema.md`
4. `docs/data-clean/nodes.md`
5. `docs/guide/packages/design-rock.md`（data-clean 段）
6. `docs/guide/designers/playground.md`
7. `docs/guide/designers/collaboration.md`
8. `docs/guide/index.md`（数据清洗章节说明，轻改）
