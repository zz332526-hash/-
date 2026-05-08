Page({
  data: {
    banners: [
      'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=60'
    ]
  },
  goOrder() {
    wx.switchTab({ url: '/pages/order/order' });
  }
});
