---
title: 数据库建模
lang: zh-CN
---

# 数据库建模

基于 **Vue Flow** 的可视化数据库建模：在画布上拖拽表节点、配置字段与类型，通过字段圆点连线创建关联，导出可持久化的 `DatabaseSchema` JSON。

| 项 | 说明 |
|------|------|
| 核心包 | `@grow-admin-rock/schema-designer` |
| 源码目录 | `DesignRock/rock-schema-designer` |
| 演示模块 | `@grow-admin-cornerstone/apps-designer`（侧栏菜单：**设计器 → 数据库建模**） |
| 主要组件 | `GrowSchemaDesigner` |
| 当前方言 | PostgreSQL（`dialect: 'postgresql'`） |

与 [页面设计器](/page-designer/)、[报表设计器](/report-designer/)、[数据准备](/data-prep/) 同属低代码工具链：本模块面向 **表结构与表间关系**（PostgreSQL）；数据准备消费已发布建模；页面 / 报表经 `state` 消费查询结果（后续亦可对接建模侧 SQL 查询管理）。

## 界面分区

```
┌─────────────────────────────────────────────────────────────┐
│ 工具栏：添加表 / 清空 / 复制 JSON / 导出 JSON                  │
├────┬──────────────┬─────────────────────────────────────────┤
│ 轨 │ 左侧面板      │ Vue Flow 画布                            │
│ 道 │ 库信息/表/关联 │ 表节点拖拽、字段连线、小地图 / 缩放控件   │
└────┴──────────────┴─────────────────────────────────────────┘
```

| 区域 | 能力 |
|------|------|
| **工具栏** | 添加表、清空画布、复制 / 下载 schema JSON |
| **左侧轨道** | 切换库信息、表配置、关联配置面板 |
| **画布** | 表节点（字段列表 + 连线手柄）、关联边、Controls / MiniMap |

## 核心能力

1. **表与字段**：新建表默认带 `id` 主键；可配置 PostgreSQL 类型、长度、主键 / 自增(IDENTITY) / 唯一 / 可空 / 索引等
2. **连线建关联**：从字段圆点拖拽到另一表字段，弹出抽屉选择 1:1 / 1:N / N:N 与参照动作
3. **外键与中间表**：1:1 / 1:N 可自动补外键列；N:N 自动生成 `isJunction` 中间表
4. **双向绑定**：支持 `v-model`（`modelValue`）与 `getSchema` / `setSchema`
5. **导出**：工具栏复制 / 下载，或 `exportSchemaJson` / 实例 `exportJson()`

## 推荐阅读

1. [基础用法](/schema-designer/usage) — 接入演示、设计器 API、画布与面板操作
2. [数据模型](/schema-designer/schema) — `DatabaseSchema` / 表 / 字段类型
3. [表关联](/schema-designer/relations) — 连线约定、1:1 / 1:N / N:N 与参照动作

::: tip 演示入口
登录后打开侧栏 **设计器 → 数据库建模**（由 `apps-designer` 注册）。本地需装配 `@grow-admin-rock/schema-designer` 与对应 Cornerstone 模块。
:::
