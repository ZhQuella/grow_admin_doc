---
title: HTTP 基础设施
lang: zh-CN
---

# HTTP 基础设施

`@grow-admin-rock/infrastructure` 基于 Axios 封装 HTTP 请求，通过 IOC 注入 `InfrastructureAxios` 实例。宿主应用在 `initIoc.ts` 中绑定自定义 `AxiosTransform` 与 `InfrastructureOptions`。

## 架构

```
业务代码 / API 模块
        ↓ useRequest() 或 diKT(InfrastructureAxios)
InfrastructureAxios（拦截器链）
        ↓ AxiosTransform（宿主可扩展）
        ↓ checkStatus（401 等状态码处理）
后端 API
```

## 宿主扩展：GrowAxiosTransform

`sample/src/apis/infrastructure.ts` 演示如何继承 `AxiosTransform`：

```typescript
@Bean()
export class GrowAxiosTransform extends AxiosTransform {
  constructor(@Autowired(infrastructureLib.types.InfrastructureOptions) _options) {
    super()

    // 请求前：拼接 baseURL
    this.beforeRequestHook = (config, options) => {
      const { apiUrl } = options
      if (!config.baseURL && apiUrl) {
        config.baseURL = isString(apiUrl) ? apiUrl : ''
      }
      return config
    }

    // 响应后：统一解包 { data } / { result }
    this.transformRequestHook = (rawRes, options) => {
      const { data } = rawRes
      if (data.type === 'error') throw new Error(data.message || '请求失败')
      return data.data ?? data.result ?? data
    }
  }
}
```

在 `initIoc.ts` 中绑定：

```typescript
appContext.iocModules.push(
  new AsyncIocModule(async (bind) => {
    bind(infrastructureLib.types.AxiosTransform).to(GrowAxiosTransform)
    bind(infrastructureLib.types.InfrastructureOptions).toDynamicValue(() => {
      const { apiUrl } = getGlobalConfig(import.meta.env)
      return { apiUrl }
    })
  }),
)
```

## 业务代码调用

```typescript
import { useRequest } from '@/apis/infrastructure'

const request = useRequest()

// 示例：获取菜单列表（apps-home）
export function getMenuList() {
  return request.get({ url: '/api/menu/list' })
}
```

`useRequest()` 内部通过 `diKT(infrastructureLib.types.InfrastructureAxios)` 从 IOC 容器获取实例。

## 响应数据格式

`GrowAxiosTransform` 默认期望后端返回：

```json
{
  "type": "success",
  "data": { ... },
  "message": "操作成功"
}
```

Mock 工具 `resultSuccess` / `resultError`（`@grow-admin-rock/mock/util`）已按此格式封装，开发环境可直接对接。

| 字段 | 说明 |
|------|------|
| `type: 'error'` | 视为业务失败，抛出 `message` |
| `data` | 优先作为返回值 |
| `result` | `data` 不存在时的备选字段 |

## 请求选项

通过 `RequestOptions`（`@grow-admin-rock/types`）控制单次请求行为：

| 选项 | 说明 |
|------|------|
| `isReturnNativeResponse` | 返回原始 Axios 响应 |
| `isTransformResponse` | 是否走 `transformRequestHook` 解包 |
| `apiUrl` | 覆盖 baseURL |

## 环境如何区分（本地 / 测试 / 生产）

框架**不是**按接口配置多套 host，而是靠 **Vite `mode` + 环境文件** 决定整站统一的 API 前缀：

```
sample/.env.[mode]  →  VITE_GLOB_API_URL
        ↓ getGlobalConfig(import.meta.env).apiUrl
        ↓ IoC：InfrastructureOptions.apiUrl
        ↓ GrowAxiosTransform.beforeRequestHook → axios baseURL
业务只写相对路径，如 /user/info
```

| 环境 | 典型命令 | 读取文件 | 关键变量 |
|------|----------|----------|----------|
| 本地开发 | `pnpm serve` / `vite` | `.env` + `.env.development` | `VITE_GLOB_API_URL`、`VITE_PROXY`、`VITE_USE_MOCK` |
| 生产构建 | `vite build` | `.env` + `.env.production` | `VITE_GLOB_API_URL`、`VITE_USE_MOCK` |

当前 sample 默认两边都是 `VITE_GLOB_API_URL=/mock`（配合客户端 Mock）。对接真实后端时：

- 开发：改为 `/api`（或其它代理前缀），并配置下方 `VITE_PROXY`
- 生产：改为网关对外前缀（如 `/api`），由 **Nginx / API 网关** 反代，不依赖 Vite 代理

生产构建还会把 `VITE_GLOB_*` 抽成独立 `_app.config.js`，挂到 `window.__PRODUCTION__GROW_ADMIN__CONF__`：

- **开发**：`getAppConfig` 直接读 `import.meta.env`
- **生产**：读 `window` 上这份配置（部署后可改，不必重编）

::: tip 测试 / 预发环境
仓库默认没有 `.env.test` / `.env.staging`。需要时可新增对应文件，并用 `vite --mode test` / `vite build --mode staging` 加载；区分方式仍是换整站 `VITE_GLOB_API_URL`，而不是按接口选 host。
:::

## 开发环境多代理（VITE_PROXY）

多后端转发**依赖**宿主 env 文件中的 `VITE_PROXY`，由 `@grow-admin-config/vite` 解析后注入 Vite `server.proxy`（或 https 下的 http2-proxy 插件）。

| 配置项 | 作用阶段 | 说明 |
|--------|----------|------|
| `sample/.env.development` → `VITE_PROXY` | `vite` 本地开发 | **主要配置位置** |
| `sample/.env.production` → `VITE_PROXY` | 生产构建 | **基本无效**；生产用网关 + `VITE_GLOB_API_URL` |

### 格式

JSON 数组 `[[前缀, 目标地址], ...]`。解析时单引号会转成双引号；`resolveProxy` 会 **rewrite 去掉前缀**：

```
浏览器请求  /api/user/info
  → 代理到   http://127.0.0.1:8080/user/info
```

### 示例（写在 `.env.development`）

```env
# 关闭 Mock，走真实后端
VITE_USE_MOCK = false

# 与下方代理前缀对齐（业务 baseURL）
VITE_GLOB_API_URL = /api

# 多代理：主 API + 上传 + 认证
VITE_PROXY = [["/api","http://127.0.0.1:8080"],["/upload","http://127.0.0.1:9000"],["/auth","https://auth-test.example.com"]]

# 普通 http：上面 VITE_PROXY 已足够（server.proxy）
# 若开启 https，需同时打开下面两项，走 vite-plugin-http2-proxy
VITE_USE_HTTPS = false
VITE_USE_PROXY = false
```

### 解析链路

```
loadEnv(mode) → wrapperEnv（解析 VITE_PROXY JSON）
    → resolveProxy → vite server.proxy   （http，默认）
    → 或 VITE_USE_HTTPS + VITE_USE_PROXY → vite-plugin-http2-proxy
```

相关实现：`configs/vite/src/utils/index.ts`（`wrapperEnv` / `resolveProxy`）、`configs/vite/src/index.ts`（`server.proxy`）、`configs/vite/src/plugins/https.ts`。

### 与 Mock 的关系

| 场景 | 建议配置 |
|------|----------|
| 纯本地 Mock | `VITE_USE_MOCK=true`，`VITE_GLOB_API_URL=/mock`，可不配 `VITE_PROXY` |
| 代理真实后端 | `VITE_USE_MOCK=false`，`VITE_GLOB_API_URL` 与代理前缀一致，配置 `VITE_PROXY` |
| 部分接口 Mock、部分走代理 | 前缀分开（如 `/mock` vs `/api`），业务侧按需覆盖单次请求的 `apiUrl` / `baseURL` |

::: warning 生产不要依赖 VITE_PROXY
`VITE_PROXY` 只作用于本地 Vite 开发服。生产请在 Nginx / 网关配置反代；`.env.production` 中至多保留注释示例，避免误以为构建产物会启用 Vite 代理。
:::

## 错误处理与取消

| 能力 | 位置 | 说明 |
|------|------|------|
| HTTP 状态码 | `rock-infrastructure/src/checkStatus.ts` | 401 等触发 `InfrastructureOptions.onUnauthorized` |
| 请求取消 | `RequestCanceler` | 路由切换时可取消 pending 请求 |
| 全局 pending | `projectSetting.removeAllHttpPending` | 切换路由时移除所有未完成请求 |

## 下一步

- [项目配置 - 环境变量](/guide/development/project-setting#环境变量) — env 变量一览
- [Mock 数据](/guide/development/mock) — 开发环境接口模拟
- [认证与登录](/guide/development/authentication) — Token 与登录接口
- [DesignRock 包说明](/guide/packages/design-rock) — infrastructure 导出列表
- [构建配置](/guide/packages/configs) — `@grow-admin-config/vite` 与代理解析
