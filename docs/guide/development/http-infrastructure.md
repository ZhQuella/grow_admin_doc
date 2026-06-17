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

## 错误处理与取消

| 能力 | 位置 | 说明 |
|------|------|------|
| HTTP 状态码 | `rock-infrastructure/src/checkStatus.ts` | 401 等触发 `InfrastructureOptions.onUnauthorized` |
| 请求取消 | `RequestCanceler` | 路由切换时可取消 pending 请求 |
| 全局 pending | `projectSetting.removeAllHttpPending` | 切换路由时移除所有未完成请求 |

## 下一步

- [Mock 数据](/guide/development/mock) — 开发环境接口模拟
- [认证与登录](/guide/development/authentication) — Token 与登录接口
- [DesignRock 包说明](/guide/packages/design-rock) — infrastructure 导出列表
