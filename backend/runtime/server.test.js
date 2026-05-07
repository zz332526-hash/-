const test = require('node:test');
const assert = require('node:assert/strict');
const { server } = require('./server');

async function startServer() {
  await new Promise((resolve) => server.listen(0, resolve));
  return `http://localhost:${server.address().port}`;
}

test('menu endpoints work', async (t) => {
  const base = await startServer();
  t.after(() => server.close());

  const categoryRes = await fetch(`${base}/api/v1/categories`);
  const categories = await categoryRes.json();
  assert.equal(categories.code, 0);
  assert.ok(categories.data.length > 0);

  const dishesRes = await fetch(`${base}/api/v1/dishes?categoryId=c_hot`);
  const dishes = await dishesRes.json();
  assert.equal(dishes.code, 0);
  assert.equal(dishes.data[0].categoryId, 'c_hot');
});

test('order lifecycle works', async (t) => {
  const base = await startServer();
  t.after(() => server.close());

  const createRes = await fetch(`${base}/api/v1/orders`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId: 's_001', items: [{ dishId: 'd_001', quantity: 1 }] })
  });
  const created = await createRes.json();
  assert.equal(created.code, 0);
  assert.equal(created.data.totalAmount, 28);

  const patchRes = await fetch(`${base}/api/v1/orders/${created.data.orderId}/status`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'PAID' })
  });
  const patched = await patchRes.json();
  assert.equal(patched.code, 0);
  assert.equal(patched.data.status, 'PAID');
});
