const app = getApp();

Page({
  data: {
    categories: [],
    dishes: [],
    cartCount: 0
  },

  onLoad() {
    this.loadData();
  },

  async loadData() {
    await Promise.all([this.loadCategories(), this.loadDishes()]);
  },

  loadCategories() {
    return wx.request({
      url: `${app.globalData.apiBase}/categories`,
      method: 'GET',
      success: (res) => {
        this.setData({ categories: res.data.data || [] });
      }
    });
  },

  loadDishes() {
    return wx.request({
      url: `${app.globalData.apiBase}/dishes`,
      method: 'GET',
      success: (res) => {
        this.setData({ dishes: res.data.data || [] });
      }
    });
  }
});
