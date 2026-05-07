# API 规范（v1）

## 通用

- Base URL: `/api/v1`
- 返回格式：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

## 菜单

### GET /dishes
获取菜品列表。

Query:
- `categoryId` 可选

### GET /categories
获取分类列表。

## 订单

### POST /orders
创建订单。

Body:

```json
{
  "storeId": "s_001",
  "items": [
    { "dishId": "d_001", "quantity": 2 }
  ],
  "remark": "少辣"
}
```

### GET /orders/:orderId
查询订单详情。

### PATCH /orders/:orderId/status
更新订单状态（商家端调用）。

