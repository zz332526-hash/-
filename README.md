# 点餐微信小程序（可维护版）

你反馈“菜单是空的”，通常有两种原因：
1) 后端没启动；
2) 没有新增菜品数据。

## 先启动后端
```bash
node backend/runtime/server.js
```

## 通过小程序商家页加菜（推荐）

新增页面：`pages/admin/index`，可直接在小程序里：
- 新增分类
- 选择分类后新增菜品

## 命令行加菜（示例）
```bash
curl -X POST http://localhost:3000/api/v1/categories -H 'Content-Type: application/json' -d '{"name":"新品"}'
curl -X POST http://localhost:3000/api/v1/dishes -H 'Content-Type: application/json' -d '{"categoryId":"c_hot","name":"鱼香肉丝","price":26}'
```

## 测试
```bash
node --test backend/runtime/server.test.js
```
