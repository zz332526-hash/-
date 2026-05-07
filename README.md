# 点餐微信小程序（可维护版）

当前能力：
- 用户侧：菜单、购物车、下单、订单详情
- 商家侧 API：订单列表 + 按状态筛选
- 后端约束：菜品校验、订单总价计算、状态机流转

## 启动
```bash
node backend/runtime/server.js
```

## 测试
```bash
node --test backend/runtime/server.test.js
```
