const http = require('http');
const { URL } = require('url');

const OrderStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAID: 'PAID',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED'
};

const transitions = {
  PENDING_PAYMENT: ['PAID', 'CANCELED'],
  PAID: ['ACCEPTED'],
  ACCEPTED: ['PREPARING'],
  PREPARING: ['COMPLETED'],
  COMPLETED: [],
  CANCELED: []
};

const categories = [
  { categoryId: 'c_hot', name: '热销' },
  { categoryId: 'c_staple', name: '主食' },
  { categoryId: 'c_drink', name: '饮品' }
];
const dishes = [
  { dishId: 'd_001', categoryId: 'c_hot', name: '宫保鸡丁', price: 28 },
  { dishId: 'd_002', categoryId: 'c_staple', name: '扬州炒饭', price: 18 },
  { dishId: 'd_003', categoryId: 'c_drink', name: '酸梅汤', price: 8 }
];

const db = new Map();

function json(res, statusCode, payload) { res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(payload)); }
const ok = (res, data) => json(res, 200, { code: 0, message: 'ok', data });
const fail = (res, message, code = 400) => json(res, code, { code: 1, message, data: null });

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error('JSON body 非法')); }
    });
    req.on('error', reject);
  });
}

function createCategory(body) {
  if (!body.name) throw new Error('分类名称必填');
  const category = { categoryId: body.categoryId || `c_${Date.now()}`, name: body.name };
  categories.push(category);
  return category;
}

function createDish(body) {
  if (!body.categoryId || !body.name || typeof body.price !== 'number') throw new Error('categoryId/name/price 必填');
  if (!categories.find((c) => c.categoryId === body.categoryId)) throw new Error('分类不存在');
  const dish = { dishId: body.dishId || `d_${Date.now()}`, categoryId: body.categoryId, name: body.name, price: body.price };
  dishes.push(dish);
  return dish;
}

function createOrder(body) {
  if (!body.storeId || !Array.isArray(body.items) || body.items.length === 0) throw new Error('storeId 和 items 必填');
  const now = new Date().toISOString();
  const orderItems = body.items.map((i) => {
    const dish = dishes.find((d) => d.dishId === i.dishId);
    if (!dish) throw new Error(`菜品不存在: ${i.dishId}`);
    return { dishId: i.dishId, quantity: i.quantity, price: dish.price, name: dish.name };
  });
  const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const order = { orderId: `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`, storeId: body.storeId, items: orderItems, totalAmount, remark: body.remark || '', status: OrderStatus.PENDING_PAYMENT, createdAt: now, updatedAt: now };
  db.set(order.orderId, order);
  return order;
}

function listOrders(status) {
  const all = Array.from(db.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return status ? all.filter((o) => o.status === status) : all;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  try {
    if (req.method === 'GET' && path === '/api/v1/health') return ok(res, { status: 'up' });
    if (req.method === 'GET' && path === '/api/v1/categories') return ok(res, categories);
    if (req.method === 'POST' && path === '/api/v1/categories') return ok(res, createCategory(await readBody(req)));
    if (req.method === 'GET' && path === '/api/v1/dishes') {
      const categoryId = url.searchParams.get('categoryId');
      return ok(res, categoryId ? dishes.filter((d) => d.categoryId === categoryId) : dishes);
    }
    if (req.method === 'POST' && path === '/api/v1/dishes') return ok(res, createDish(await readBody(req)));
    if (req.method === 'GET' && path === '/api/v1/orders') return ok(res, listOrders(url.searchParams.get('status')));
    if (req.method === 'POST' && path === '/api/v1/orders') return ok(res, createOrder(await readBody(req)));

    const orderMatch = path.match(/^\/api\/v1\/orders\/([^/]+)$/);
    if (req.method === 'GET' && orderMatch) {
      const order = db.get(orderMatch[1]);
      if (!order) return fail(res, '订单不存在', 404);
      return ok(res, order);
    }

    const statusMatch = path.match(/^\/api\/v1\/orders\/([^/]+)\/status$/);
    if (req.method === 'PATCH' && statusMatch) {
      const order = db.get(statusMatch[1]);
      if (!order) return fail(res, '订单不存在', 404);
      const body = await readBody(req);
      if (!body.status || !OrderStatus[body.status]) return fail(res, 'status 非法');
      if (!transitions[order.status].includes(body.status)) return fail(res, `非法状态流转: ${order.status} -> ${body.status}`);
      order.status = body.status;
      order.updatedAt = new Date().toISOString();
      return ok(res, order);
    }

    return fail(res, '接口不存在', 404);
  } catch (err) {
    return fail(res, err.message || '服务异常', 500);
  }
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`ordering runtime listening on http://localhost:${port}`));
}

module.exports = { server };
