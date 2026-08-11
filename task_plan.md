# Task Plan: 对齐数据清洗文档与源码

## Goal
对照 `grow_admin` 中 `@grow-admin-rock/data-clean` 的当前实现，补充/校正 `grow_admin_doc` 里数据清洗及相关指南文档。

## Current Phase
Phase 5

## Phases

### Phase 1: Requirements & Discovery
- [x] 对照源码与现有 data-clean / designers 文档
- [x] 记录缺口到 findings.md
- **Status:** complete

### Phase 2: Planning & Structure
- [x] 确定改写清单（data-clean 四页 + design-rock / playground / collaboration）
- **Status:** complete

### Phase 3: Implementation
- [x] 重写/校正 data-clean：index / usage / schema / nodes
- [x] 同步更新 design-rock、playground、collaboration、guide/index、designers/index
- [x] 更新 progress.md
- **Status:** complete

### Phase 4: Testing & Verification
- [x] 抽查链接与关键 API/字段与源码一致
- **Status:** complete

### Phase 5: Delivery
- [x] 汇总变更说明交付用户
- **Status:** complete

## Key Questions
1. 文档仍写「无本地引擎 / 无 Mock」是否过时？→ 是；已有 `runCleanFlowLocal` + `sample/mock/dataClean.ts`
2. 配置面板布局？→ 画布上浮层 `CleanConfigFloat`，非固定右栏
3. 预览是否仍为 `buildDemoPreview`？→ 设计器已改用 `runCleanFlowLocal`

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 以 types.ts / GrowDataCleanDesigner.vue / runCleanFlow.ts 为准 | 文档多处仍描述 M1 占位阶段 |
| 保留「调用时执行 / 消费者未对接」边界 | 本地预览 ≠ 生产调用侧绑定 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
|       | 1       |            |

## Notes
- 源码：`DesignRock/rock-data-clean`
- Mock：`sample/mock/dataClean.ts`
- 文档站：VitePress，侧栏已有 data-clean 分组，无需改 config
