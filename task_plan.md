# Task Plan: 补充 Grow Admin 设计器相关文档

## Goal
根据 `/Users/aaron/Desktop/grow_admin` 源码，补充并校正 `grow_admin_doc` 中各设计器的文档与使用说明，使文档与当前实现对齐、可操作。

## Current Phase
Phase 5

## Phases

### Phase 1: Requirements & Discovery
- [x] Understand user intent（补充文档，尤其设计器）
- [x] 对照源码与现有文档，找出缺口与过时内容
- [x] Document findings in findings.md
- **Status:** complete

### Phase 2: Planning & Structure
- [x] 确定要新增/改写的文档清单（见 findings.md）
- [x] 文档结构与导航：新增 designers 总览 + data-prep formulas；校正侧栏
- **Status:** complete

### Phase 3: Implementation
- [x] 更新各设计器文档与总览/工具链说明
- [x] 校正 usage / schema / API 与源码一致
- [x] 更新侧栏与首页导航（如需）
- **Status:** complete

### Phase 4: Testing & Verification
- [x] 核对链接、交叉引用、包名路径
- [x] 对照源码抽查关键 API/字段
- **Status:** complete

### Phase 5: Delivery
- [x] 汇总变更说明交付用户
- **Status:** complete

## Key Questions
1. 现有文档哪些已过时（尤其 data-prep 公式度量、outputFields、schema SQL）？→ 见 findings.md
2. 是否需要「低代码工具链总览」把五个模块串起来？→ 已新增
3. 页面设计器是否缺「事件 / 计算属性 / 业务组件」专页？→ 已新增 events.md，并更新 variable-bind / schema

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 以源码 types.ts 为准重写 data-prep | 文档仍停留在 dimensions/measures，与 metricConfigs 公式模型完全脱节 |
| 删除报表 Dataset 直选说明 | ReportBlockDataBinding 源码无 sourceMode/dataset |
| 新增 designers 总览 + formulas + events | 用户重点要设计器使用说明，需要工具链与操作深度 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
|       | 1       |            |

## Notes
- 源码权威位置：DesignRock 下各 rock-*-designer / rock-data-prep / rock-code-sandbox 的 types.ts 与主 Vue
- 文档站：VitePress，侧栏在 docs/.vitepress/config.js
