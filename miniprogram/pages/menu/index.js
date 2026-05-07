const { request } = require('../../utils/request');
const { addToCart, getCart } = require('../../utils/cart');

Page({
  data: { dishes: [], loading: false },

  async onShow() {
    await this.loadDishes();
  },

  async loadDishes() {
    this.setData({ loading: true });
    try {
      const dishes = await request({ url: '/dishes' }).catch(() => []);
      this.setData({ dishes });
    } finally {
      this.setData({ loading: false });
    }
  },

  onAddTap(e) {
    const item = e.currentTarget.dataset.item;
    addToCart(item);
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },

  goCart() {
    wx.navigateTo({ url: '/pages/cart/index' });
  },

  getCartCount() {
    return getCart().reduce((sum, x) => sum + x.quantity, 0);
  }
});
