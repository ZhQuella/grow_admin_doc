---
title: 认证与登录
lang: zh-CN
---

# 认证与登录

Grow Admin 的登录能力由 `apps-login` 提供页面与接口调用，**路由守卫与动态路由注册由 `apps-home` 负责**。二者分工明确，不要混淆。

## 模块职责

| 模块 | 职责 |
|------|------|
| `apps-login` | 登录页 UI、多形态表单（账号/手机/扫码等）、登录 API 调用、Token 写入 |
| `apps-home` | 路由守卫（Token 校验、白名单、动态路由触发）、Home 布局壳 |

::: warning 注意
`apps-login/src/routes/guard.ts` 当前为**占位实现**（直接 `next()`），真正的认证守卫在 `apps-home/src/routes/guard.ts`，由 `apps-home/library.ts` 的 `onSetup` 注册。
:::

## 登录流程

```
用户访问 /
    ↓
Login 页（whiteRoute: true）
    ↓ POST /api/login（Mock 或真实接口）
useLoginSuccess → sessionStorage[AUTHORITY_TOKEN] = accessToken
    ↓
router.push({ name: 'Home' })
    ↓
apps-home 守卫检测 Token → registerDynamicRoutes() → /home/*
```

### Token 存储

登录成功后，`useLoginSuccess` 将 `accessToken` 写入 `sessionStorage`，key 为 `AUTHORITY_TOKEN`（来自 `@grow-admin-rock/constants`）。

守卫通过同一 key 判断登录状态：

```typescript
function getToken() {
  return sessionStorage.getItem(AUTHORITY_TOKEN)
}
```

### 开发环境测试账号

Mock 接口 `sample/mock/auth.ts` 提供：

| 字段 | 值 |
|------|-----|
| 用户名 | `admin` |
| 密码 | `123456` |
| Token | `grow-admin-fake-token` |

## 路由守卫逻辑（apps-home）

`createAuthGuard()` 在 `beforeEach` 中处理：

| 场景 | 行为 |
|------|------|
| 访问白名单路由（`meta.whiteRoute`）且已有 Token | 重定向到 `Home` |
| 访问白名单路由且无 Token | 放行 |
| 访问受保护路由且无 Token | 跳转 `Login`，携带 `redirect` query |
| 已登录且动态路由未注册 | `registerDynamicRoutes()` → `replace` 重试当前路径 |
| 其他 | `next()` |

## 页面级 Bootstrap 与守卫的关系

`apps-home` 的 `useAppBootstrap` 在 `onMounted` 中也会调用 `registerDynamicRoutes()`，并显示 `PageLoading`。

| 触发点 | 时机 | 作用 |
|--------|------|------|
| 路由守卫 | 首次进入受保护路由（导航前） | 保证直接访问 `/home/workspace` 时路由已注册 |
| `useAppBootstrap` | Home 组件挂载后 | 拉取菜单、显示页面加载动画 |

两者通过 `authStore.getIsDynamicAddedRoute` 防重复注册。守卫负责**导航正确性**，bootstrap 负责**页面加载体验**。

## 登录页组件

`apps-login` 提供多种登录形态：

| 组件 | 说明 |
|------|------|
| `LoginForm` | 账号密码登录（默认） |
| `ForgetPassword` | 忘记密码 |
| `MobilePhone` | 手机号 + 验证码 |
| `QrCodeLogin` | 扫码登录 |
| `ThirdParty` | 第三方登录入口 |
| `LoginThemeSwitch` | 暗色模式切换 |
| `LoginLanguageSwitch` | 语言切换 |

通过 `useLoginEvent` 切换 `formType` 控制展示形态。

## OAuth / 认证模式（可选）

`apps-login/src/usage.ts` 提供 `useAuthMode()`、`useOAuth2Config()`，读取 `useGlobConfig()` 中的 `authMode`、`oauthCodeRoute` 等。

::: info 前置依赖
`useGlobConfig` 来自 `@grow-admin-rock/hooks`，依赖 `@grow-admin-rock/settings` 装配。当前 `sample` 宿主**未装配** `settings` + `hooks`，OAuth 相关能力需在宿主 `initIoc.ts` 中额外 `.use(settingsLib)` / `.use(hooksLib)` 并配置环境变量后才会生效。
:::

相关环境变量（`VITE_GLOB_APP_AUTH_MODE` 等）见 [项目配置 - 环境变量](/guide/development/project-setting#环境变量)。

## 相关 Mock 接口

| 接口 | 文件 | 说明 |
|------|------|------|
| `POST /api/login` | `sample/mock/auth.ts` | 账号密码登录 |
| `POST /api/verification/code` | `sample/mock/login.ts` | 发送验证码 |
| `POST /api/modify/phone/login` | `sample/mock/login.ts` | 手机号登录 |
| `GET /api/menu/list` | `sample/mock/routers.ts` | 登录后菜单数据 |

## 下一步

- [权限模式](/guide/development/permission-mode) — 动态菜单来源与角色过滤
- [路由与菜单](/guide/architecture/routing-and-menu) — 动态路由注册
- [Mock 数据](/guide/development/mock) — 开发环境接口模拟
- [HTTP 基础设施](/guide/development/http-infrastructure) — 请求封装与 Transform
