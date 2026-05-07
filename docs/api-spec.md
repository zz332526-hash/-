# API 规范（v1）

Base URL: `/api/v1`
统一返回：`{ code, message, data }`

## 菜单
- `GET /categories`
- `POST /categories` 新增分类
- `GET /dishes?categoryId=`
- `POST /dishes` 新增菜品

### POST /dishes body 示例
```json
{ "categoryId": "c_hot", "name": "鱼香肉丝", "price": 26 }
```

## 订单
- `GET /orders?status=`
- `POST /orders`
- `GET /orders/:orderId`
- `PATCH /orders/:orderId/status`
