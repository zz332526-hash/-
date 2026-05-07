const test = require('node:test');
const assert = require('node:assert/strict');
const { server } = require('./server');

async function startServer() {
  await new Promise((resolve) => server.listen(0, resolve));
  const addr = server.address();
  return `http://localhost:${addr.port}`;
}

test('order lifecycle works', async (t) => {
  const base = await startServer();
  t.after(() => server.close());

  const createRes = await fetch(`${base}/api/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId: 's_001', items: [{ dishId: 'd_001', quantity: 1 }] })
  });
  const created = await createRes.json();
  assert.equal(created.code, 0);
  assert.equal(created.data.status, 'PENDING_PAYMENT');

  const patchRes = await fetch(`${base}/api/v1/orders/${created.data.orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'PAID' })
  });
  const patched = await patchRes.json();
  assert.equal(patched.code, 0);
  assert.equal(patched.data.status, 'PAID');
});

test('invalid transition rejected', async (t) => {
  const base = await startServer();
  t.after(() => server.close());

  const createRes = await fetch(`${base}/api/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId: 's_001', items: [{ dishId: 'd_001', quantity: 1 }] })
  });
  const created = await createRes.json();

  const patchRes = await fetch(`${base}/api/v1/orders/${created.data.orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'COMPLETED' })
  });
  const patched = await patchRes.json();
  assert.equal(patched.code, 1);
});
