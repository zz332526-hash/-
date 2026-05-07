# 点餐微信小程序（可维护版）

本仓库现在包含：
1. 可直接运行的零依赖 Node.js 点餐后端。
2. 可联调的小程序页面（菜单 -> 购物车 -> 提交订单 -> 订单详情）。

## 启动后端

```bash
node backend/runtime/server.js
```

## 运行测试

```bash
node --test backend/runtime/server.test.js
```

## 小程序端结构

- `miniprogram/utils/request.js`：统一请求封装
- `miniprogram/utils/cart.js`：购物车本地存储
- `miniprogram/pages/menu`：菜单页（加入购物车）
- `miniprogram/pages/cart`：购物车页（提交订单）
- `miniprogram/pages/orders`：订单详情页
