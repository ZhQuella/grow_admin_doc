# Findings: Grow Admin 设计器文档缺口

## 严重过时（必须改）

### data-prep
- 文档仍描述 `dimensions` / `measures` / `DataPrepAgg`（sum/avg/ratio/yoy…）
- 源码已改为：
  - `metricConfigs: DataPrepMetricConfig[]`（多维度字段 + 单条公式度量）
  - `outputFields: string[]`（预览/输出投影；空则不可预览）
  - `primarySourceId?: string`
  - 公式：`[alias.column]` + SUM/AVG/COUNT/MAX/MIN + IF/AND/OR/NOT/IFERROR
- 界面左轨：添加表 / 维度·度量 / 数据输出 / 数据集信息（非「字段/表关联/信息」）
- 表关联：画布连线 + JoinConfigDrawer（joins.md 里「右侧表关联」面板已不存在）
- 工厂：`createDataPrepMetricConfig` 取代 dimension/measure 工厂
- 导出：`FORMULA_FUNCTION_DOCS`、`previewMetricConfig`、`listOutputFieldCandidates` 等

### report-designer data-binding
- 文档写了 `sourceMode: 'state' | 'dataset'` 与 `ReportDatasetBinding`
- 源码 `dataBinding/types.ts` **仅有** state 绑定字段（xAxisData/seriesData/…），无 dataset 直选
- report index 同时存在「不直选 Dataset」与「Dataset 绑定 Phase 1」矛盾 → 应以源码为准删除 dataset 直选说明

## 需补充

### 工具链总览
- 缺少把 schema → data-prep → page/report + code-sandbox 串起来的导读页

### schema-designer
- usage 左侧面板仍写「表配置/关联配置」在左轨；实际左轨是「库信息 / SQL 查询」，表/关联为浮层
- `queries` / SqlQueryPanel 仅在 schema.md 提字段，usage 未写操作说明

### page-designer
- usage 左侧面板缺：属性计算、数据监听、页面事件
- schema / variable-bind 缺 `propBindModes` 的 `function` 模式、`computedProps`、`pageConfig.events/watchers`
- 事件面板说明过简

### design-rock.md
- data-prep 导出表仍偏旧模型措辞

## 相对准确
- page/schema/report/code-sandbox 基础结构文档大体可用
- schema relations、report chart-config、code-sandbox API 与源码大体对齐

## 文档改写清单
1. 新增 `docs/guide/designers/index.md`（低代码工具链总览）
2. 重写 data-prep：index / usage / schema；新增 formulas.md；校正 joins.md
3. 校正 report data-binding + index（去掉不存在的 dataset 直选）
4. 补 schema-designer usage（SQL + 面板布局）
5. 补 page-designer：usage 左轨、schema、variable-bind（function）、新增 events.md（可选）或并入 usage/data
6. 更新 config.js / guide/index.md / design-rock.md / 首页 features（可选）
