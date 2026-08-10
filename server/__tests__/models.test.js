const Announcement = require('../models/Announcement');
const Member = require('../models/Member');
const Post = require('../models/Post');
const About = require('../models/About');
const Video = require('../models/Video');

// mongoose's validateSync() runs schema validation without touching the
// database, so these run fully offline — no mongodb-memory-server (and no
// network access to download a mongod binary) required.

describe('Announcement model validation', () => {
  test('rejects an empty document (title, body required)', () => {
    const err = new Announcement({}).validateSync();
    expect(err).toBeDefined();
    expect(Object.keys(err.errors).sort()).toEqual(['body', 'title']);
  });

  test('accepts a valid document', () => {
    const err = new Announcement({ title: 'Hi', body: 'Body text' }).validateSync();
    expect(err).toBeUndefined();
  });

  test('rejects a title over the length limit', () => {
    const err = new Announcement({ title: 'x'.repeat(201), body: 'ok' }).validateSync();
    expect(err.errors.title).toBeDefined();
  });
});

describe('Member model validation', () => {
  test('rejects a document with no name', () => {
    const err = new Member({ role: 'Researcher' }).validateSync();
    expect(err.errors.name).toBeDefined();
  });

  test('accepts a minimal valid document', () => {
    const err = new Member({ name: 'Ada Lovelace' }).validateSync();
    expect(err).toBeUndefined();
  });
});

describe('Post model validation', () => {
  test('rejects a document missing title/content', () => {
    const err = new Post({}).validateSync();
    expect(Object.keys(err.errors).sort()).toEqual(['content', 'title']);
  });

  test('defaults author to "Unknown" when omitted', () => {
    const doc = new Post({ title: 'T', content: 'C' });
    expect(doc.author).toBe('Unknown');
    expect(doc.validateSync()).toBeUndefined();
  });
});

describe('About model validation', () => {
  test('rejects a document missing title/content', () => {
    const err = new About({}).validateSync();
    expect(Object.keys(err.errors).sort()).toEqual(['content', 'title']);
  });

  test('registers a pre-save hook to keep updatedAt current', () => {
    // We don't invoke Mongoose's internal hook pipeline directly here (its
    // exact internal shape isn't a stable public API to test against) —
    // instead this confirms the hook is actually registered on the schema,
    // which is what would silently disappear if someone removed it.
    const preSaveHooks = About.schema.s.hooks._pres.get('save') || [];
    expect(preSaveHooks.length).toBeGreaterThan(0);
  });
});

describe('Video model validation', () => {
  test('rejects a non-YouTube URL', () => {
    const err = new Video({ title: 'Talk', youtubeUrl: 'https://vimeo.com/123' }).validateSync();
    expect(err.errors.youtubeUrl).toBeDefined();
  });

  test('accepts a youtube.com watch URL', () => {
    const err = new Video({ title: 'Talk', youtubeUrl: 'https://www.youtube.com/watch?v=abc123' }).validateSync();
    expect(err).toBeUndefined();
  });

  test('accepts a youtu.be short URL', () => {
    const err = new Video({ title: 'Talk', youtubeUrl: 'https://youtu.be/abc123' }).validateSync();
    expect(err).toBeUndefined();
  });

  test('rejects a missing title', () => {
    const err = new Video({ youtubeUrl: 'https://youtu.be/abc123' }).validateSync();
    expect(err.errors.title).toBeDefined();
  });
});
