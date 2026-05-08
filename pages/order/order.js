const menuData = {
  时令上新: [
    { id: 1, name: '青柠白桃露', desc: '青柠汁 + 白桃果肉 + 茉莉绿茶', price: 22, tags: ['清爽甘甜', '含茶'], image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=240&q=60' },
    { id: 2, name: '葡萄茉莉冰茶', desc: '阳光玫瑰葡萄 + 茉莉绿茶', price: 24, tags: ['清爽鲜果', '含茶'], image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=240&q=60' }
  ],
  人气推荐: [
    { id: 3, name: '西柚椰椰冻', desc: '西柚 + 椰子水 + 椰冻', price: 22, tags: ['果香', '椰香'], image: 'https://images.unsplash.com/photo-1553530666-ba11a90bb0b1?auto=format&fit=crop&w=240&q=60' },
    { id: 4, name: '橙香气泡茶', desc: '鲜橙 + 青柠 + 冰气泡', price: 20, tags: ['清新', '气泡'], image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=240&q=60' }
  ],
  鲜果茶: [
    { id: 5, name: '莓莓芭乐茶', desc: '草莓 + 芭乐 + 绿茶底', price: 23, tags: ['酸甜', '含茶'], image: 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=240&q=60' }
  ],
  奶茶系列: [
    { id: 6, name: '轻乳乌龙', desc: '乌龙茶底 + 轻乳', price: 18, tags: ['奶香', '低甜'], image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=240&q=60' }
  ]
};

const API_BASE_URL = 'https://your-api.example.com';

Page({
  data: {
    distance: 532,
    rating: 4.7,
    takeType: '到店取',
    storyCards: [
      { title: '柑橘香气', sub: '正当时' },
      { title: '杨梅气泡', sub: '清爽上线' },
      { title: '夏日出行', sub: '带上清爽' }
    ],
    categories: Object.keys(menuData),
    currentCategory: '时令上新',
    currentProducts: [],
    cartCount: 0,
    cartTotal: '0.00',
    paying: false
  },

  cart: new Map(),

  onLoad() {
    this.renderProducts();
    this.updateCartSummary();
  },

  onSwitchType() {
    this.setData({ takeType: this.data.takeType === '到店取' ? '外卖配送' : '到店取' });
  },

  onSelectCategory(e) {
    this.setData({ currentCategory: e.currentTarget.dataset.cat }, () => this.renderProducts());
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
    this.setData({
      currentProducts: menuData[this.data.currentCategory].map((p) => ({ ...p, qty: this.cart.get(p.id)?.qty || 0 }))
    });
  },

  updateCartSummary() {
    const items = [...this.cart.values()];
    const cartCount = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    this.setData({ cartCount, cartTotal: total.toFixed(2) });
  },

  buildOrderPayload() {
    const items = [...this.cart.values()];
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    const deliveryFee = this.data.takeType === '外卖配送' ? 3 : 0;
    return {
      takeType: this.data.takeType,
      items: items.map((item) => ({ id: item.id, qty: item.qty })),
      amount: {
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee
      }
    };
  },

  requestApi({ url, method = 'GET', data = {} }) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${API_BASE_URL}${url}`,
        method,
        data,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
            return;
          }
          reject(new Error(res.data?.message || `请求失败(${res.statusCode})`));
        },
        fail: (err) => reject(err)
      });
    });
  },

  async createOrderAndPay(orderPayload) {
    const createRes = await this.requestApi({
      url: '/api/pay/create',
      method: 'POST',
      data: orderPayload
    });

    const { paymentParams, orderNo } = createRes || {};
    if (!paymentParams || !orderNo) {
      throw new Error('后端未返回完整支付参数');
    }

    await this.requestPayment(paymentParams);
    await this.verifyOrder(orderNo);
  },

  requestPayment(paymentParams) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        ...paymentParams,
        success: () => resolve(),
        fail: (err) => {
          if (err?.errMsg?.includes('cancel')) {
            reject(new Error('用户已取消支付'));
            return;
          }
          reject(new Error('支付失败，请稍后重试'));
        }
      });
    });
  },

  verifyOrder(orderNo) {
    return this.requestApi({
      url: '/api/pay/confirm',
      method: 'POST',
      data: { orderNo }
    });
  },

  async onCheckout() {
    if (this.data.cartCount === 0 || this.data.paying) return;

    const orderPayload = this.buildOrderPayload();
    const { subtotal, deliveryFee, total } = orderPayload.amount;

    const modalRes = await new Promise((resolve) => {
      wx.showModal({
        title: '确认订单',
        content: `商品 ¥${subtotal.toFixed(2)}\n${this.data.takeType === '外卖配送' ? '配送费' : '服务费'} ¥${deliveryFee.toFixed(2)}\n应付 ¥${total.toFixed(2)}`,
        confirmText: '去支付',
        success: resolve
      });
    });

    if (!modalRes.confirm) return;

    this.setData({ paying: true });
    wx.showLoading({ title: '发起支付中' });

    try {
      await this.createOrderAndPay(orderPayload);
      wx.showToast({ title: '支付成功', icon: 'success' });
      this.cart.clear();
      this.renderProducts();
      this.updateCartSummary();
    } catch (error) {
      wx.showToast({ title: error.message || '支付未完成', icon: 'none' });
    } finally {
      wx.hideLoading();
      this.setData({ paying: false });
    }
  }
});
