const test = require('node:test');
const assert = require('node:assert/strict');
const { server } = require('./server');

async function withServer(run) {
  await new Promise((resolve) => server.listen(0, resolve));
  const base = `http://localhost:${server.address().port}`;
  try { await run(base); } finally { await new Promise((r) => server.close(r)); }
}

test('menu endpoints work', async () => {
  await withServer(async (base) => {
    const categories = await (await fetch(`${base}/api/v1/categories`)).json();
    assert.equal(categories.code, 0);
    const dishes = await (await fetch(`${base}/api/v1/dishes?categoryId=c_hot`)).json();
    assert.equal(dishes.data[0].categoryId, 'c_hot');
  });
});

test('order lifecycle and listing work', async () => {
  await withServer(async (base) => {
    const created = await (await fetch(`${base}/api/v1/orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId: 's_001', items: [{ dishId: 'd_001', quantity: 1 }] })
    })).json();
    assert.equal(created.data.totalAmount, 28);

    await fetch(`${base}/api/v1/orders/${created.data.orderId}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PAID' })
    });

    const list = await (await fetch(`${base}/api/v1/orders?status=PAID`)).json();
    assert.equal(list.code, 0);
    assert.ok(list.data.some((x) => x.orderId === created.data.orderId));
  });
});
