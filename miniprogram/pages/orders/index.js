const { request } = require('../../utils/request');

Page({
  data: { order: null, error: '' },

  async onLoad(query) {
    if (!query.orderId) return;
    try {
      const order = await request({ url: `/orders/${query.orderId}` });
      this.setData({ order, error: '' });
    } catch (err) {
      this.setData({ error: err.message });
    }
  }
});
