const app = getApp();

function request({ url, method = 'GET', data = {} }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.apiBase}${url}`,
      method,
      data,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300 && res.data.code === 0) {
          resolve(res.data.data);
        } else {
          reject(new Error(res.data?.message || `请求失败(${res.statusCode})`));
        }
      },
      fail: (err) => reject(new Error(err.errMsg || '网络异常'))
    });
  });
}

module.exports = { request };
