process.env.ADMIN_JWT_SECRET = 'test-secret-for-adminauth';

const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');
const { JWT_SECRET } = require('../config/auth');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('adminAuth middleware', () => {
  test('rejects a request with no Authorization header', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing Authorization' });
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a malformed Authorization header (missing "Bearer")', () => {
    const req = { headers: { authorization: 'Basic abc123' } };
    const res = mockRes();
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Authorization format' });
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects an Authorization header with extra parts', () => {
    const req = { headers: { authorization: 'Bearer token extra' } };
    const res = mockRes();
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects an invalid/garbage token', () => {
    const req = { headers: { authorization: 'Bearer not-a-real-jwt' } };
    const res = mockRes();
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects an expired token', () => {
    const expiredToken = jwt.sign({ username: 'admin' }, JWT_SECRET, { expiresIn: -10 });
    const req = { headers: { authorization: `Bearer ${expiredToken}` } };
    const res = mockRes();
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a token signed with a different secret', () => {
    const wrongSecretToken = jwt.sign({ username: 'admin' }, 'a-different-secret', { expiresIn: '1h' });
    const req = { headers: { authorization: `Bearer ${wrongSecretToken}` } };
    const res = mockRes();
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('accepts a valid token and attaches the payload to req.admin', () => {
    const validToken = jwt.sign({ username: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    const req = { headers: { authorization: `Bearer ${validToken}` } };
    const res = mockRes();
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(req.admin.username).toBe('admin');
  });
});
