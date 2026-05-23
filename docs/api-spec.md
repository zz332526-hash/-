# API 规范（v1）

Base URL: `/api/v1`

统一返回：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

## 健康检查

### GET /health

返回服务状态。

## 订单

### POST /orders
创建订单。

### GET /orders/:orderId
查询订单。

### PATCH /orders/:orderId/status
更新订单状态。

状态流转：
- `PENDING_PAYMENT -> PAID/CANCELED`
- `PAID -> ACCEPTED`
- `ACCEPTED -> PREPARING`
- `PREPARING -> COMPLETED`
