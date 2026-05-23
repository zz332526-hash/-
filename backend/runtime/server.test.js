const test = require('node:test');
const assert = require('node:assert/strict');
const { server } = require('./server');

const port = 3100;

test('order lifecycle works', async (t) => {
  await new Promise((resolve) => server.listen(port, resolve));
  t.after(() => server.close());

  const createRes = await fetch(`http://localhost:${port}/api/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId: 's_001', items: [{ dishId: 'd_001', quantity: 1 }] })
  });
  const created = await createRes.json();
  assert.equal(created.code, 0);
  assert.equal(created.data.status, 'PENDING_PAYMENT');

  const patchRes = await fetch(`http://localhost:${port}/api/v1/orders/${created.data.orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'PAID' })
  });
  const patched = await patchRes.json();
  assert.equal(patched.code, 0);
  assert.equal(patched.data.status, 'PAID');
});
