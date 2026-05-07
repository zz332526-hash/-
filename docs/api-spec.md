# API 规范（v1）

Base URL: `/api/v1`
统一返回：`{ code, message, data }`

## 菜单
- `GET /categories`
- `GET /dishes?categoryId=`

## 订单
- `GET /orders?status=` 订单列表（商家端）
- `POST /orders` 创建订单（校验菜品，计算总价）
- `GET /orders/:orderId` 查询订单详情
- `PATCH /orders/:orderId/status` 更新状态

状态流转：
- `PENDING_PAYMENT -> PAID/CANCELED`
- `PAID -> ACCEPTED`
- `ACCEPTED -> PREPARING`
- `PREPARING -> COMPLETED`
