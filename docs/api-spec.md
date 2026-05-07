# API 规范（v1）

Base URL: `/api/v1`

统一返回：`{ code, message, data }`

## 菜单
- `GET /categories` 分类列表
- `GET /dishes?categoryId=` 菜品列表（可按分类过滤）

## 订单
- `POST /orders` 创建订单（会计算总价）
- `GET /orders/:orderId` 查询订单
- `PATCH /orders/:orderId/status` 更新订单状态

状态流转：
- `PENDING_PAYMENT -> PAID/CANCELED`
- `PAID -> ACCEPTED`
- `ACCEPTED -> PREPARING`
- `PREPARING -> COMPLETED`
