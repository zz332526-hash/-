const menuData = {
  茶饮: [
    { id: 1, name: '多肉葡萄', desc: '鲜果现剥，清爽微甜', price: 22 },
    { id: 2, name: '芝芝芒芒', desc: '浓郁芝士顶', price: 24 }
  ],
  奶茶: [
    { id: 3, name: '烤黑糖波波', desc: '温热更香', price: 19 },
    { id: 4, name: '轻焙乌龙奶', desc: '低甜顺滑', price: 18 }
  ],
  小食: [
    { id: 5, name: '海盐奶盖蛋糕', desc: '每日限量', price: 16 }
  ]
};

Page({
  data: {
    takeType: '自取',
    categories: Object.keys(menuData),
    currentCategory: Object.keys(menuData)[0],
    currentProducts: [],
    cartCount: 0,
    cartTotal: '0.00'
  },

  cart: new Map(),

  onLoad() {
    this.renderProducts();
    this.updateCartSummary();
  },

  onSwitchType() {
    this.setData({ takeType: this.data.takeType === '自取' ? '外带' : '自取' });
  },

  onSelectCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ currentCategory: cat }, () => this.renderProducts());
  },

  onChangeQty(e) {
    const id = Number(e.currentTarget.dataset.id);
    const delta = Number(e.currentTarget.dataset.delta);
    const product = Object.values(menuData).flat().find((p) => p.id === id);
    const item = this.cart.get(id) || { ...product, qty: 0 };
    item.qty += delta;
    if (item.qty <= 0) this.cart.delete(id);
    else this.cart.set(id, item);

    this.renderProducts();
    this.updateCartSummary();
  },

  renderProducts() {
    const list = menuData[this.data.currentCategory].map((p) => ({
      ...p,
      qty: this.cart.get(p.id)?.qty || 0
    }));
    this.setData({ currentProducts: list });
  },

  updateCartSummary() {
    const items = [...this.cart.values()];
    const cartCount = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    this.setData({ cartCount, cartTotal: total.toFixed(2) });
  },

  async onCheckout() {
    const items = [...this.cart.values()];
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    const payTotal = (total + 1).toFixed(2);

    const ok = await new Promise((resolve) => {
      wx.showModal({
        title: '确认支付',
        content: `商品金额：¥${total.toFixed(2)}\n打包费：¥1.00\n应付：¥${payTotal}`,
        confirmText: '立即支付',
        success: (res) => resolve(!!res.confirm)
      });
    });
    if (!ok) return;

    // 真支付流程：
    // 1) 请求你自己的后端创建订单并返回支付参数
    // 2) 调用 wx.requestPayment 拉起支付
    // 3) 支付后再请求后端确认订单状态
    // 这里保留占位逻辑，避免在无后端时报错
    wx.showModal({
      title: '待接入真支付',
      content: '请按 PAYMENT_FLOW.md 接入后端下单与 wx.requestPayment。',
      showCancel: false
    });
  }
});
