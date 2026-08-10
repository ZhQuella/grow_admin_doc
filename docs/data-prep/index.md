---
title: 数据准备
lang: zh-CN
---

# 数据准备

基于 **Vue Flow** 的可视化数据准备（Dataset）：从已发布的数据库建模中选表、配置多表 Join、编写 **公式度量**，并通过 **数据输出** 投影字段，导出可持久化的 `DataPrepDataset` 并支持预览查询。

| 项 | 说明 |
|------|------|
| 核心包 | `@grow-admin-rock/data-prep` |
| 源码目录 | `DesignRock/rock-data-prep` |
| 演示模块 | `@grow-admin-cornerstone/apps-designer`（侧栏菜单：**设计器 → 数据准备**） |
| 主要组件 | `GrowDataPrepDesigner` |
| 当前范围 | 前端可视化 + 本地 / Mock 查询 |

与其它低代码工具的分工（完整链路见 [低代码设计器](/guide/designers/)）：

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
| [数据库建模](/schema-designer/) | 物理模型：表 / 字段 / 关系 |
| **数据准备** | 分析模型：选表、Join、公式度量、输出字段 |
| [页面设计器](/page-designer/) | 展示：页面物料 + 绑定 `state` |
| [报表设计器](/report-designer/) | 展示：图表布局 + 绑定 `state` |

## 界面分区

```
┌─────────────────────────────────────────────────────────────┐
│ 工具栏：数据集名称 / 预览数据 / 保存                           │
├────┬──────────────┬─────────────────────────────────────────┤
│ 轨 │ 左侧面板      │ Vue Flow 画布                            │
│ 道 │ 表/度量/输出  │ 表节点、Join 连线、小地图 / 缩放控件       │
└────┴──────────────┴─────────────────────────────────────────┘
```

| 区域 | 能力 |
|------|------|
| **工具栏** | 改名称；预览（需已配置输出字段）；保存 Dataset |
| **左侧轨道** | 添加表、维度 / 度量、数据输出、数据集信息 |
| **画布** | 表节点拖拽、连线配置 Join、设主表；Controls / MiniMap |
| **侧扩展** | 编辑度量时打开配置面板（公式编辑器） |

## 核心能力

1. **跨建模选表**：左轨「添加表」按建模分组列出表，可连续添加；第一张表自动设为主表
2. **手动表关联**：画布拖线打开抽屉，配置 INNER / LEFT / RIGHT 与多字段并 / 或条件
3. **维度 / 度量配置**：每条配置 = 多个维度字段 + 一条公式度量（`SUM([alias.col])` 等）
4. **数据输出**：勾选 / 排序 `outputFields`；预览与对外查询均按此投影（未配置则不可预览）
5. **本地 + Mock**：Dataset 写入 `localStorage`；查询走 `sample/mock/dataPrep.ts`

## 推荐阅读

1. [基础用法](/data-prep/usage) — 接入演示、操作流程、设计器 API
2. [数据模型](/data-prep/schema) — `DataPrepDataset` / `metricConfigs` / 查询结果
3. [公式度量](/data-prep/formulas) — 字段引用、聚合与逻辑函数
4. [表关联](/data-prep/joins) — Join 类型、多字段条件、并 / 或

::: tip 演示入口
登录后打开侧栏 **设计器 → 数据准备**（由 `apps-designer` 注册）。本地需装配 `@grow-admin-rock/data-prep` 与对应 Cornerstone 模块，并启用 `sample/mock/dataPrep.ts`。
:::
