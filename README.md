# 点餐微信小程序（可维护版）

这版在保留 TypeScript 设计稿的同时，补了一个**可直接运行**的 Node.js 运行时（零依赖），用于本地联调。

## 目录

- `miniprogram/`：微信小程序页面骨架
- `backend/src/`：TypeScript 领域模型与分层示例
- `backend/runtime/`：可运行 HTTP 服务（内存存储）
- `docs/`：接口与架构文档

## 本地运行（无依赖）

```bash
node backend/runtime/server.js
```

服务默认地址：`http://localhost:3000`

## 可用接口

- `GET /api/v1/health`
- `POST /api/v1/orders`
- `GET /api/v1/orders/:orderId`
- `PATCH /api/v1/orders/:orderId/status`

## 运行测试

```bash
node --test backend/runtime/server.test.js
```
