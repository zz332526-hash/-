const test = require('node:test');
const assert = require('node:assert/strict');
const { server } = require('./server');

async function withServer(run) {
  await new Promise((resolve) => server.listen(0, resolve));
  const base = `http://localhost:${server.address().port}`;
  try { await run(base); } finally { await new Promise((r) => server.close(r)); }
}

test('can create category and dish', async () => {
  await withServer(async (base) => {
    const c = await (await fetch(`${base}/api/v1/categories`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: '新品' })
    })).json();
    assert.equal(c.code, 0);

    const d = await (await fetch(`${base}/api/v1/dishes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId: c.data.categoryId, name: '椰子鸡', price: 48 })
    })).json();
    assert.equal(d.code, 0);

    const list = await (await fetch(`${base}/api/v1/dishes?categoryId=${c.data.categoryId}`)).json();
    assert.ok(list.data.some((x) => x.name === '椰子鸡'));
  });
});
