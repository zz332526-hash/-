# 微信小程序真支付接入说明

## 1) 你现在的前端能做什么
当前项目里 `onCheckout` 还是模拟支付（`wx.showModal` + `wx.showToast`）。
要改成真支付，前端只负责两步：
1. 调后端创建统一下单（获取支付参数）。
2. 调 `wx.requestPayment` 拉起微信支付。

## 2) 必备条件
- 小程序已认证并开通微信支付。
- 商户号（mchid）可用。
- 后端服务可签名并调用微信支付下单接口。

## 3) 推荐支付时序
1. 用户点“去结算”。
2. 前端把购物车和金额发给后端：`POST /api/pay/create`。
3. 后端校验金额、生成商户订单号、调用微信支付下单，返回：
   - `timeStamp`
   - `nonceStr`
   - `package`（通常 `prepay_id=xxx`）
   - `signType`
   - `paySign`
   - `orderNo`
4. 前端调用 `wx.requestPayment`。
5. 前端支付成功后调用后端 `POST /api/pay/confirm` 做兜底确认。
6. 后端以微信支付回调（notify）为最终准，更新订单状态。

## 4) 安全要点
- 金额以后端重算为准，前端金额仅展示。
- `paySign` 必须后端生成，前端不要参与签名。
- 支付成功页面提示不等于到账成功，必须以后端回调结果为准。

## 5) 前端改造点
- 把 `pages/index/index.js` 的模拟支付替换为：
  - `createOrderAndPay()`：请求后端拿支付参数。
  - `requestPayment()`：调用 `wx.requestPayment`。
  - `verifyOrder()`：支付后向后端确认订单状态。
