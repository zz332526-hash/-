const { request } = require('../../utils/request');

Page({
  data: {
    categoryName: '',
    dishName: '',
    dishPrice: '',
    selectedCategoryId: '',
    categories: []
  },

  async onShow() {
    await this.loadCategories();
  },

  async loadCategories() {
    try {
      const categories = await request({ url: '/categories' });
      this.setData({
        categories,
        selectedCategoryId: categories[0]?.categoryId || ''
      });
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    }
  },

  onCategoryNameInput(e) { this.setData({ categoryName: e.detail.value }); },
  onDishNameInput(e) { this.setData({ dishName: e.detail.value }); },
  onDishPriceInput(e) { this.setData({ dishPrice: e.detail.value }); },
  onCategoryChange(e) { this.setData({ selectedCategoryId: this.data.categories[e.detail.value].categoryId }); },

  async addCategory() {
    if (!this.data.categoryName.trim()) return wx.showToast({ title: '请输入分类名', icon: 'none' });
    await request({ url: '/categories', method: 'POST', data: { name: this.data.categoryName.trim() } });
    this.setData({ categoryName: '' });
    await this.loadCategories();
    wx.showToast({ title: '分类已添加', icon: 'success' });
  },

  async addDish() {
    const price = Number(this.data.dishPrice);
    if (!this.data.selectedCategoryId || !this.data.dishName.trim() || Number.isNaN(price)) {
      return wx.showToast({ title: '请完整填写菜品信息', icon: 'none' });
    }

    await request({
      url: '/dishes',
      method: 'POST',
      data: {
        categoryId: this.data.selectedCategoryId,
        name: this.data.dishName.trim(),
        price
      }
    });

    this.setData({ dishName: '', dishPrice: '' });
    wx.showToast({ title: '菜品已添加', icon: 'success' });
  }
});
