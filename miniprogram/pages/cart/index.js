const { getCart, clearCart } = require('../../utils/cart');
const { request } = require('../../utils/request');

Page({
  data: { items: [], total: 0 },

  onShow() {
    const items = getCart();
    const total = items.reduce((sum, x) => sum + (x.price || 0) * x.quantity, 0);
    this.setData({ items, total });
  },

  async submitOrder() {
    if (this.data.items.length === 0) {
      wx.showToast({ title: '购物车为空', icon: 'none' });
      return;
    }

    const payload = {
      storeId: 's_001',
      items: this.data.items.map((x) => ({ dishId: x.dishId, quantity: x.quantity })),
      remark: ''
    };

    try {
      const order = await request({ url: '/orders', method: 'POST', data: payload });
      clearCart();
      wx.navigateTo({ url: `/pages/orders/index?orderId=${order.orderId}` });
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    }
  }
});
