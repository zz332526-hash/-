# 微信小程序真支付接入说明

## 1) 前端已接入能力
`pages/order/order.js` 已实现真实支付主流程：
1. `createOrderAndPay()`：调用后端 `POST /api/pay/create` 生成订单并获取支付参数。
2. `requestPayment()`：调用 `wx.requestPayment` 拉起支付。
3. `verifyOrder()`：支付完成后请求 `POST /api/pay/confirm` 进行订单状态确认。

## 2) 你需要替换的配置
- 将 `pages/order/order.js` 中 `API_BASE_URL` 改为你的后端域名。
- 确保该域名已添加到小程序后台“request 合法域名”。

## 3) 后端接口约定
### `POST /api/pay/create`
请求示例：
```json
{
  "takeType": "外卖配送",
  "items": [{ "id": 1, "qty": 2 }],
  "amount": { "subtotal": 44, "deliveryFee": 3, "total": 47 }
}
```

返回示例：
```json
{
  "orderNo": "YT202605080001",
  "paymentParams": {
    "timeStamp": "1715155200",
    "nonceStr": "randomStr",
    "package": "prepay_id=wx201410272009395522657a690389285100",
    "signType": "RSA",
    "paySign": "xxxx"
  }
}
```

### `POST /api/pay/confirm`
请求示例：
```json
{ "orderNo": "YT202605080001" }
```

## 4) 安全要求
- 订单金额以后端重算为准，前端金额只用于展示。
- 签名 `paySign` 必须由后端生成，前端不得参与签名。
- 最终支付结果以后端微信支付回调（notify）落库状态为准。
