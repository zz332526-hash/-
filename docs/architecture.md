# 架构说明（维护优先）

## 1. 分层原则

后端采用四层：

1. Controller：只接收/返回数据，不写业务。
2. Service：核心业务逻辑。
3. Repository（可后续加）：数据库读写。
4. DTO：输入输出结构。

## 2. 模块划分

- auth：登录与用户信息
- dish：分类/菜品
- order：购物车转订单、状态流转

## 3. 关键维护规范

- API 路径统一前缀 `/api/v1`。
- 所有状态用枚举，禁止魔法值。
- 单个函数不超过 60 行，复杂逻辑拆私有函数。
- 错误码集中维护。

## 4. 订单状态机

`PENDING_PAYMENT -> PAID -> ACCEPTED -> PREPARING -> COMPLETED`

可逆分支：`PENDING_PAYMENT -> CANCELED`

