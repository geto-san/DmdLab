process.env.ADMIN_JWT_SECRET = 'test-secret-for-crud';

// Mock the Announcement model so these tests exercise admin.controller.js's
// own logic (status codes, safeEmit calls, error shapes) without needing a
// real MongoDB connection. Schema-level validation is already covered by
// models.test.js via validateSync(), which doesn't need a DB either.
jest.mock('../models/Announcement', () => {
  function Announcement(data) {
    Object.assign(this, data);
    this._id = 'mock-announcement-id';
  }
  Announcement.prototype.save = jest.fn();
  Announcement.find = jest.fn();
  Announcement.findByIdAndUpdate = jest.fn();
  Announcement.findByIdAndDelete = jest.fn();
  return Announcement;
});

// Other models required by admin.controller.js at import time — not under
// test here, but need a safe mock so requiring the controller doesn't try
// to touch a real DB connection.
for (const name of ['Article', 'Member', 'Post', 'About', 'Video', 'Content']) {
  jest.mock(`../models/${name}`, () => {
    function Model(data) { Object.assign(this, data); }
    Model.prototype.save = jest.fn();
    Model.find = jest.fn();
    Model.findById = jest.fn();
    Model.findByIdAndUpdate = jest.fn();
    Model.findByIdAndDelete = jest.fn();
    return Model;
  });
}

jest.mock('../utils/cloudinary', () => ({
  cloudinary: { uploader: { destroy: jest.fn() } },
  uploadStream: jest.fn(),
}));

const socket = require('../socket');
jest.spyOn(socket, 'safeEmit').mockImplementation(() => {});

const Announcement = require('../models/Announcement');
const adminController = require('../controllers/admin.controller');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('makeCrud (via announcement) — create', () => {
  afterEach(() => jest.clearAllMocks());

  test('creates successfully and emits announcement:created', async () => {
    Announcement.prototype.save.mockResolvedValueOnce({ _id: '1', title: 'Hi', body: 'Body' });
    const req = { body: { title: 'Hi', body: 'Body' } };
    const res = mockRes();

    await adminController.announcement.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(socket.safeEmit).toHaveBeenCalledWith('announcement:created', expect.objectContaining({ _id: '1' }));
  });

  test('returns 400 with the validation error message on save failure', async () => {
    Announcement.prototype.save.mockRejectedValueOnce(new Error('Announcement validation failed: title: Path `title` is required.'));
    const req = { body: {} };
    const res = mockRes();

    await adminController.announcement.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining('required') });
  });
});

describe('makeCrud (via announcement) — update', () => {
  afterEach(() => jest.clearAllMocks());

  test('returns 404 when the document does not exist', async () => {
    Announcement.findByIdAndUpdate.mockResolvedValueOnce(null);
    const req = { params: { id: 'missing' }, body: { title: 'New' } };
    const res = mockRes();

    await adminController.announcement.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(socket.safeEmit).not.toHaveBeenCalled();
  });

  test('updates successfully and emits announcement:updated', async () => {
    Announcement.findByIdAndUpdate.mockResolvedValueOnce({ _id: '1', title: 'New' });
    const req = { params: { id: '1' }, body: { title: 'New' } };
    const res = mockRes();

    await adminController.announcement.update(req, res);

    expect(res.json).toHaveBeenCalledWith({ _id: '1', title: 'New' });
    expect(socket.safeEmit).toHaveBeenCalledWith('announcement:updated', expect.objectContaining({ _id: '1' }));
  });
});

describe('makeCrud (via announcement) — delete', () => {
  afterEach(() => jest.clearAllMocks());

  test('returns 404 when the document does not exist', async () => {
    Announcement.findByIdAndDelete.mockResolvedValueOnce(null);
    const req = { params: { id: 'missing' } };
    const res = mockRes();

    await adminController.announcement.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('deletes successfully and emits announcement:deleted', async () => {
    Announcement.findByIdAndDelete.mockResolvedValueOnce({ _id: '1' });
    const req = { params: { id: '1' } };
    const res = mockRes();

    await adminController.announcement.delete(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true });
    expect(socket.safeEmit).toHaveBeenCalledWith('announcement:deleted', { id: '1' });
  });
});

describe('content controller — payload validation (regression test for the silent-wipe bug)', () => {
  afterEach(() => jest.clearAllMocks());

  test('create rejects a non-object payload with 400 instead of silently emptying it', async () => {
    const req = { body: { key: 'hero', payload: [1, 2, 3] } };
    const res = mockRes();

    await adminController.content.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'payload must be a JSON object' });
  });

  test('update rejects a null payload with 400', async () => {
    const req = { params: { id: '1' }, body: { payload: null } };
    const res = mockRes();

    await adminController.content.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'payload must be a JSON object' });
  });

  test('create rejects an invalid key format', async () => {
    const req = { body: { key: 'Not Valid Key!', payload: {} } };
    const res = mockRes();

    await adminController.content.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining('lowercase alphanumeric') });
  });
});
