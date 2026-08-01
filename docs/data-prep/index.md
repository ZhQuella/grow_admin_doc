---
title: 数据准备
lang: zh-CN
---

# 数据准备

基于 **Vue Flow** 的可视化数据准备（Dataset）：从已发布的数据库建模中选表、配置多表 Join、标记维度 / 度量，导出可持久化的 `DataPrepDataset` 并支持预览查询。

| 项 | 说明 |
|------|------|
| 核心包 | `@grow-admin-rock/data-prep` |
| 源码目录 | `DesignRock/rock-data-prep` |
| 演示模块 | `@grow-admin-cornerstone/apps-designer`（侧栏菜单：**设计器 → 数据准备**） |
| 主要组件 | `GrowDataPrepDesigner` |
| Phase 1 范围 | 前端可视化 + Mock 查询 |

与其它低代码工具的分工：

```text
数据库建模（PostgreSQL 物理模型）
    ↓ 已发布元数据
数据准备 Dataset（怎么算）          ← 本模块
    ↓ 查询结果（经数据请求写入 state）
    ├─→ 低代码设计器（页面组件绑定）
    └─→ 报表设计器（图表 dataBinding）
```

| 模块 | 定位 |
|------|------|
| [数据库建模](/schema-designer/) | 物理模型：表 / 字段 / 关系（方言 PostgreSQL） |
| **数据准备** | 分析模型：选表、Join、维度、度量、输出 key |
| [页面设计器](/page-designer/) | 展示：页面物料 + 绑定 `state` |
| [报表设计器](/report-designer/) | 展示：图表布局 + 绑定 `state` |

## 界面分区

```
┌─────────────────────────────────────────────────────────────┐
│ 工具栏：添加表 / 预览 / 保存                                   │
├────┬──────────────┬─────────────────────────────────────────┤
│ 轨 │ 右侧面板      │ Vue Flow 画布                            │
│ 道 │ 字段/关联/信息 │ 表节点、Join 连线、小地图 / 缩放控件       │
└────┴──────────────┴─────────────────────────────────────────┘
```

| 区域 | 能力 |
|------|------|
| **工具栏** | 添加表、数据预览（底部抽屉）、保存 Dataset |
| **右侧轨道** | 切换「字段」「表关联」「数据集信息」 |
| **画布** | 表节点（维 / 度切换）、关联边、Controls / MiniMap |

## 核心能力

1. **跨建模选表**：添加表抽屉按建模 Tab 列出表卡片，可连续添加多张表
2. **手动表关联**：侧栏或画布连线配置 INNER / LEFT / RIGHT；支持多组字段与「并 / 或」
3. **维度 / 度量**：在表节点上切换字段角色；侧栏可改名称、度量输出 key、聚合函数
4. **数据预览**：底部 `GrowDrawer` 展示聚合结果表
5. **本地 + Mock**：Dataset 写入 `localStorage`；查询走 `sample/mock/dataPrep.ts`

## 推荐阅读

1. [基础用法](/data-prep/usage) — 接入演示、设计器 API、操作流程
2. [数据模型](/data-prep/schema) — `DataPrepDataset` / 维度 / 度量 / 查询结果
3. [表关联](/data-prep/joins) — Join 类型、多字段条件、并 / 或

::: tip 演示入口
登录后打开侧栏 **设计器 → 数据准备**（由 `apps-designer` 注册）。本地需装配 `@grow-admin-rock/data-prep` 与对应 Cornerstone 模块，并启用 `sample/mock/dataPrep.ts`。
:::
