---
title: Mock 数据
lang: zh-CN
---

# Mock 数据

Grow Admin 的 Mock 分为**开发环境文件 Mock**与 **IOC Mock 注册中心**两套机制，开发时主要使用 `sample/mock/` 下的文件 Mock。

## 双通道架构

```
开发环境（pnpm serve）
    sample/mock/*.ts
        ↓ vite-plugin-mock
    拦截 /api/* 请求

生产构建（可选）
    sample/mock/_mock-server.ts
        ↓ createAppMockServer
    独立 Mock 服务

业务包扩展
    registerMock() → MockRegistry
        ↓ sample/mock/packages.ts 聚合
    getMockModules()
```

## sample/mock 文件说明

| 文件 | 接口 | 说明 |
|------|------|------|
| `auth.ts` | `POST /api/login` | 账号密码登录（`admin` / `123456`） |
| `login.ts` | `/api/verification/code` 等 | 验证码、手机登录、改密 |
| `routers.ts` | `GET /api/menu/list` | 菜单/动态路由配置 |
| `packages.ts` | — | 聚合各包 `registerMock` 注册的 Mock |
| `_mock-server.ts` | — | 生产 Mock 服务入口（以 `_` 开头，dev 时忽略） |

### 菜单 Mock 与 route-config 分离

`routers.ts` 引用纯配置，避免 vite-plugin-mock 打包 `.vue`：

```typescript
import { WORKSPACE_ROUTE_CONFIGS } from '@grow-admin-cornerstone/apps-workspace/route-config'

export default [{
  url: '/api/menu/list',
  method: 'get',
  response: () => resultSuccess({ menuList: WORKSPACE_ROUTE_CONFIGS }),
}]
```

## @grow-admin-rock/mock

| 导出 | 说明 |
|------|------|
| `Lib` | IOC Library，注册 `MockRegistry` |
| `registerMock` | 业务包注册 Mock 方法 |
| `getMockModules` | 获取所有已注册 Mock |
| `resultSuccess` / `resultError` | 统一响应格式封装 |
| `getRequestToken` | 从请求头读取 Token |

### 统一响应格式

```typescript
import { resultSuccess, resultError } from '@grow-admin-rock/mock/util'

// 成功
resultSuccess({ menuList: [...] }, { message: '获取成功' })
// → { type: 'success', data: { menuList: [...] }, message: '...' }

// 失败
resultError('账号或密码错误')
// → { type: 'error', message: '...' }
```

与 `GrowAxiosTransform` 的解包逻辑对应，详见 [HTTP 基础设施](/guide/development/http-infrastructure)。

## 环境变量控制

| 变量 | 说明 |
|------|------|
| `VITE_USE_MOCK` | 是否启用 Mock（构建时注入 `__VITE_USE_MOCK__`） |

Vite 插件配置位于 `configs/vite/src/plugins/mock.ts`，`ignore: /^_/` 跳过 `_mock-server.ts` 等以下划线开头的文件。

## 新增 Mock 接口

1. 在 `sample/mock/` 新建或编辑 `.ts` 文件
2. 导出 `MockMethod[]` 数组（`url`、`method`、`response`）
3. 重启 dev server

若 Mock 来自业务包，在包的 `mock/register.ts` 中调用 `registerMock()`，并在 `sample/mock/packages.ts` 中确保 `getMockModules()` 能聚合到。

## 下一步

- [认证与登录](/guide/development/authentication) — 登录 Mock 与测试账号
- [路由与菜单](/guide/architecture/routing-and-menu) — 菜单 Mock 与动态路由
- [HTTP 基础设施](/guide/development/http-infrastructure) — 请求解包与错误处理
