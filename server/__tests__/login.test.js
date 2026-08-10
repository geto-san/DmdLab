process.env.ADMIN_USER = 'admin';
process.env.ADMIN_PASS = 'password';
process.env.ADMIN_JWT_SECRET = 'test-secret-for-login';
delete process.env.ADMIN_PASS_HASH;

const express = require('express');
const request = require('supertest');

// A fresh app per test file avoids the rate limiter's in-memory counter
// leaking between test files; within this file we deliberately share one
// app so the "trips after 5 attempts" test can exercise the real limiter.
const adminRoutes = require('../routes/admin');
const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('POST /admin/login', () => {
  test('rejects missing username/password with 400', async () => {
    const res = await request(app).post('/admin/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('rejects missing password only', async () => {
    const res = await request(app).post('/admin/login').send({ username: 'admin' });
    expect(res.status).toBe(400);
  });

  test('rejects wrong password with 401', async () => {
    const res = await request(app).post('/admin/login').send({ username: 'admin', password: 'nope' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  test('rejects wrong username with 401', async () => {
    const res = await request(app).post('/admin/login').send({ username: 'not-admin', password: 'password' });
    expect(res.status).toBe(401);
  });

  test('accepts correct credentials and returns a token', async () => {
    const res = await request(app).post('/admin/login').send({ username: 'admin', password: 'password' });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.token.split('.')).toHaveLength(3); // header.payload.signature
  });

  test('rate-limits repeated attempts from the same client', async () => {
    // The app-level limiter allows 5 attempts per window; this test already
    // made several failed attempts above against the same `app` instance,
    // so a further handful of wrong-password requests should trip it.
    let lastStatus;
    for (let i = 0; i < 6; i++) {
      const res = await request(app).post('/admin/login').send({ username: 'admin', password: 'wrong' });
      lastStatus = res.status;
      if (lastStatus === 429) break;
    }
    expect(lastStatus).toBe(429);
  });
});

describe('POST /admin/login with ADMIN_PASS_HASH (bcrypt)', () => {
  let hashApp;

  beforeAll(() => {
    const bcrypt = require('bcryptjs');
    process.env.ADMIN_PASS_HASH = bcrypt.hashSync('correcthorsebattery', 10);
    delete process.env.ADMIN_PASS;
    // Re-require so the fresh env vars are picked up by config/auth.js's
    // module-level reads (jest caches modules per test file by default,
    // so resetModules + a fresh require gets an accurate re-evaluation).
    jest.resetModules();
    const freshApp = express();
    freshApp.use(express.json());
    freshApp.use('/admin', require('../routes/admin'));
    hashApp = freshApp;
  });

  afterAll(() => {
    delete process.env.ADMIN_PASS_HASH;
    process.env.ADMIN_PASS = 'password';
  });

  test('accepts the correct password against the bcrypt hash', async () => {
    const res = await request(hashApp).post('/admin/login').send({ username: 'admin', password: 'correcthorsebattery' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('rejects an incorrect password against the bcrypt hash', async () => {
    const res = await request(hashApp).post('/admin/login').send({ username: 'admin', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });
});
